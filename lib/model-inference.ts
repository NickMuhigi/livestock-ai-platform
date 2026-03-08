import * as tf from "@tensorflow/tfjs";
import Jimp from "jimp";
import path from "path";
import fs from "fs/promises";
import { spawn } from "child_process";

const MODEL_INPUT_SIZE = 224; // Standard size for most CV models

export interface PredictionResult {
  healthy: number;
  footAndMouth: number;
  lumpySkin: number;
  anthrax: number;
  classLabels: string[];
  classScores: Record<string, number>;
  detectedDisease: string;
  confidence: number;
}

let loadedModel: tf.LayersModel | null = null;
let loadedModelPath: string | null = null;

const MODEL_CLASSES = [
  "FOOT_AND_MOUTH",
  "HEALTHY",
  "LUMPY_SKIN",
  "MASTITIS",
] as const;

function getConfiguredModelClasses(outputCount: number): string[] {
  const configured = process.env.MODEL_CLASS_LABELS
    ?.split(",")
    .map((label) => label.trim().toUpperCase().replace(/\s+/g, "_"))
    .filter(Boolean);

  const baseClasses = (configured && configured.length > 0)
    ? configured
    : [...MODEL_CLASSES];

  if (outputCount <= 0) {
    return baseClasses;
  }

  if (baseClasses.length >= outputCount) {
    return baseClasses.slice(0, outputCount);
  }

  const padded = [...baseClasses];
  while (padded.length < outputCount) {
    padded.push(`CLASS_${padded.length + 1}`);
  }
  return padded;
}

async function ensureLocalWeightsFile() {
  const modelDir = path.join(process.cwd(), "public", "model");
  const primaryWeights = path.join(modelDir, "model.weights.bin");
  const fallbackWeights = path.join(modelDir, "model.weights.bin.new");

  const primaryStats = await fs
    .stat(primaryWeights)
    .catch(() => null);

  if (primaryStats && primaryStats.size > 0) {
    return;
  }

  const fallbackStats = await fs
    .stat(fallbackWeights)
    .catch(() => null);

  if (!fallbackStats || fallbackStats.size === 0) {
    return;
  }

  await fs.copyFile(fallbackWeights, primaryWeights);
  console.warn(
    "Recovered empty model.weights.bin by copying model.weights.bin.new"
  );
}

export async function loadModel(requestOrigin?: string): Promise<tf.LayersModel> {
  const configuredPath = process.env.TFJS_MODEL_PATH?.trim();
  const fallbackPath = requestOrigin
    ? `${requestOrigin}/model/model.json`
    : "http://127.0.0.1:3000/model/model.json";
  const modelPath = configuredPath || fallbackPath;

  if (loadedModel && loadedModelPath === modelPath) {
    return loadedModel;
  }

  try {
    if (modelPath.endsWith(".keras")) {
      throw new Error(
        "Unsupported model format '.keras' for TensorFlow.js runtime. TFJS needs model.json + shard files."
      );
    }

    if (modelPath.startsWith("file://")) {
      throw new Error(
        `TFJS_MODEL_PATH uses file:// (${modelPath}), which is not supported by @tensorflow/tfjs fetch-based loading in this server runtime. Use an HTTP(S) URL such as 'http://127.0.0.1:3000/model/model.json'.`
      );
    }

    if (!configuredPath) {
      await ensureLocalWeightsFile();
    }

    loadedModel = await tf.loadLayersModel(modelPath);
    loadedModelPath = modelPath;
    console.log("Model loaded successfully");
    return loadedModel;
  } catch (error) {
    console.error("Failed to load model:", error);
    const message = error instanceof Error ? error.message : "Failed to load prediction model";
    throw new Error(message);
  }
}

export async function preprocessImage(
  imageBuffer: Buffer
): Promise<tf.Tensor> {
  try {
    // Load image using Jimp
    const image = await Jimp.read(imageBuffer);

    // Resize to model input size
    image.resize(MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);

    // Convert RGBA -> RGB tensor and normalize in one pass
    const data = image.bitmap.data;
    const rgbData = new Float32Array(MODEL_INPUT_SIZE * MODEL_INPUT_SIZE * 3);
    let rgbIndex = 0;
    for (let i = 0; i < data.length; i += 4) {
      // Normalize to [0, 1] during conversion to avoid extra tensor operations
      rgbData[rgbIndex++] = data[i] / 255.0;
      rgbData[rgbIndex++] = data[i + 1] / 255.0;
      rgbData[rgbIndex++] = data[i + 2] / 255.0;
    }

    // Create normalized tensor directly
    const tensor = tf.tensor3d(
      rgbData,
      [MODEL_INPUT_SIZE, MODEL_INPUT_SIZE, 3],
      "float32"
    );

    return tensor;
  } catch (error) {
    console.error("Image preprocessing error:", error);
    throw new Error("Failed to preprocess image");
  }
}

async function fileExists(filePath: string) {
  return fs
    .access(filePath)
    .then(() => true)
    .catch(() => false);
}

async function runKerasPythonInference(
  imageBuffer: Buffer,
  modelPath: string
): Promise<number[]> {
  const scriptPath = path.join(process.cwd(), "scripts", "keras_inference.py");
  const scriptExists = await fileExists(scriptPath);

  if (!scriptExists) {
    throw new Error(
      "Missing scripts/keras_inference.py. Cannot run Keras model inference."
    );
  }

  const payload = JSON.stringify({
    imageBase64: imageBuffer.toString("base64"),
    inputSize: MODEL_INPUT_SIZE,
  });

  const configuredPython = process.env.KERAS_PYTHON_BIN?.trim();
  const pythonCandidates: Array<{ bin: string; argsPrefix: string[] }> = [];

  if (configuredPython) {
    pythonCandidates.push({ bin: configuredPython, argsPrefix: [] });
  } else if (process.platform === "win32") {
    // Prefer workspace venv to avoid py launcher selecting a different site-packages set.
    const localVenvPython = path.join(process.cwd(), ".venv", "Scripts", "python.exe");
    if (await fileExists(localVenvPython)) {
      pythonCandidates.push({ bin: localVenvPython, argsPrefix: [] });
    }

    pythonCandidates.push(
      { bin: "python", argsPrefix: [] },
      { bin: "py", argsPrefix: ["-3.11"] },
      { bin: "py", argsPrefix: ["-3.10"] }
    );
  } else {
    pythonCandidates.push(
      { bin: "python3.11", argsPrefix: [] },
      { bin: "python3", argsPrefix: [] },
      { bin: "python", argsPrefix: [] }
    );
  }

  const runWithPython = (candidate: { bin: string; argsPrefix: string[] }) =>
    new Promise<string>((resolve, reject) => {
      const args = [...candidate.argsPrefix, scriptPath, modelPath];

      const child = spawn(candidate.bin, args, {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk) => {
        stdout += String(chunk);
      });

      child.stderr.on("data", (chunk) => {
        stderr += String(chunk);
      });

      child.on("error", (error) => {
        reject(error);
      });

      child.on("close", (code) => {
        if (code !== 0) {
          const details = [stdout.trim(), stderr.trim()]
            .filter(Boolean)
            .join("\n")
            .trim();
          reject(
            new Error(
              details || `Python exited with code ${code}`
            )
          );
          return;
        }
        resolve(stdout);
      });

      child.stdin.write(payload);
      child.stdin.end();
    });

  let lastError: Error | null = null;

  for (const candidate of pythonCandidates) {
    try {
      const rawOutput = await runWithPython(candidate);
      const parsed = JSON.parse(rawOutput) as { scores?: number[]; error?: string };

      if (parsed.error) {
        throw new Error(parsed.error);
      }

      if (!parsed.scores || parsed.scores.length === 0) {
        throw new Error("Invalid prediction output from Keras inference script");
      }

      return parsed.scores;
    } catch (error) {
      lastError = error as Error;
    }
  }

  throw new Error(
    `Failed to run Keras inference. Ensure Python, Keras (with TensorFlow backend), Pillow, and NumPy are installed. ${lastError ? `Last error: ${lastError.message}` : ""}`
  );
}

function buildPredictionResult(rawScores: number[]): PredictionResult {
  const scores = rawScores
    .map((score) => Number(score))
    .filter((score) => Number.isFinite(score));

  if (scores.length === 0) {
    throw new Error("Model returned no valid prediction scores");
  }

  const classLabels = getConfiguredModelClasses(scores.length);
  const total = scores.reduce((sum, value) => sum + value, 0);
  const normalizedScores =
    total > 0 ? scores.map((value) => value / total) : scores.map(() => 0);

  const classScores = classLabels.reduce<Record<string, number>>((acc, label, index) => {
    acc[label] = Number((normalizedScores[index] ?? 0).toFixed(4));
    return acc;
  }, {});

  const maxScore = Math.max(...normalizedScores);
  const maxIndex = normalizedScores.indexOf(maxScore);
  const detectedDisease = classLabels[maxIndex] ?? classLabels[0] ?? "HEALTHY";

  return {
    healthy: classScores.HEALTHY ?? 0,
    footAndMouth: classScores.FOOT_AND_MOUTH ?? 0,
    lumpySkin: classScores.LUMPY_SKIN ?? 0,
    anthrax: classScores.ANTHRAX ?? classScores.MASTITIS ?? 0,
    classLabels,
    classScores,
    detectedDisease,
    confidence: Number(maxScore.toFixed(4)),
  };
}

async function analyzeWithTfjs(
  imageBuffer: Buffer,
  requestOrigin?: string
): Promise<PredictionResult> {
  let inputTensor: tf.Tensor | null = null;
  let batchedInput: tf.Tensor | null = null;
  let predictions: tf.Tensor | null = null;

  try {
    const model = await loadModel(requestOrigin);
    inputTensor = await preprocessImage(imageBuffer);
    
    // Use tf.tidy to automatically dispose intermediate tensors
    const result = tf.tidy(() => {
      batchedInput = inputTensor!.expandDims(0);
      predictions = model.predict(batchedInput) as tf.Tensor;
      return Array.from(predictions.dataSync()); // Use dataSync instead of data for speed
    });
    
    return buildPredictionResult(result);
  } finally {
    // Only dispose tensors not cleaned up by tf.tidy
    if (inputTensor) inputTensor.dispose();
  }
}

async function analyzeWithKeras(imageBuffer: Buffer): Promise<PredictionResult> {
  const configuredModelPath = process.env.KERAS_MODEL_PATH?.trim();
  const modelPath = configuredModelPath
    ? path.resolve(configuredModelPath)
    : path.join(process.cwd(), "cattle_model.keras");

  const modelExists = await fileExists(modelPath);
  if (!modelExists) {
    throw new Error(`Keras model not found at ${modelPath}`);
  }

  const scores = await runKerasPythonInference(imageBuffer, modelPath);
  return buildPredictionResult(scores);
}

async function resolveModelRuntime(): Promise<"keras" | "tfjs"> {
  const runtime = (process.env.MODEL_RUNTIME ?? "auto").trim().toLowerCase();

  if (runtime === "keras") {
    return "keras";
  }

  if (runtime === "tfjs") {
    return "tfjs";
  }

  const configuredModelPath = process.env.KERAS_MODEL_PATH?.trim();
  const modelPath = configuredModelPath
    ? path.resolve(configuredModelPath)
    : path.join(process.cwd(), "cattle_model.keras");

  return (await fileExists(modelPath)) ? "keras" : "tfjs";
}

export async function analyzeCattleImage(
  imageBuffer: Buffer,
  requestOrigin?: string
): Promise<PredictionResult> {
  try {
    const runtime = await resolveModelRuntime();
    if (runtime === "keras") {
      return await analyzeWithKeras(imageBuffer);
    }
    return await analyzeWithTfjs(imageBuffer, requestOrigin);
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
}
