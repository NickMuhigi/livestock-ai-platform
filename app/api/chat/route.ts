import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";
import { getDiseaseAdvice, formatAdviceForChat } from "@/lib/disease-advice";
import { chatMessageSchema } from "@/lib/validations";

const configuredModel = process.env.GEMINI_MODEL;

const SYSTEM_PROMPT = `You are Herd AI Assistant, an AI assistant for livestock health support.

Rules:
- Be practical, calm, and concise.
- Never claim certainty or final diagnosis.
- Treat outputs as guidance only and recommend a licensed veterinarian when risk is medium/high/critical.
- If user mentions severe symptoms, sudden death, breathing distress, bleeding, or rapid spread, advise urgent vet/authority contact.
- Use plain language suitable for farmers.
- Do not provide harmful or illegal instructions.
`;

function normalizeApiKey(value?: string | null): string {
  if (!value) return "";
  return value.trim().replace(/^['\"]|['\"]$/g, "");
}

function keyFingerprint(key: string): string {
  if (!key) return "none";
  if (key.length <= 10) return `${key.slice(0, 3)}...`;
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

function resolveGeminiApiKey(): string {
  // Prefer .env.local explicitly to avoid stale process env values.
  try {
    const envLocalPath = join(process.cwd(), ".env.local");
    const raw = readFileSync(envLocalPath, "utf8");
    const line = raw
      .split("\n")
      .find((entry) => entry.startsWith("GEMINI_API_KEY="));
    const fileKey = normalizeApiKey(line?.slice("GEMINI_API_KEY=".length));
    if (fileKey.startsWith("AIza")) return fileKey;
  } catch {
    // File not found or unreadable; continue to process.env fallback
  }

  const envKey = normalizeApiKey(process.env.GEMINI_API_KEY);
  if (envKey.startsWith("AIza")) return envKey;

  return "";
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await req.json();
    const validationResult = chatMessageSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { disease, message, history = [], responseMode = "concise" } = validationResult.data;

    const apiKey = resolveGeminiApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured on the server." },
        { status: 500 }
      );
    }

    const geminiClient = new GoogleGenerativeAI(apiKey);

    const advice = disease ? getDiseaseAdvice(disease) : null;
    const formattedAdvice = advice ? formatAdviceForChat(advice) : "";
    const historyText = history
      .slice(-8)
      .map((entry) => `${entry.role.toUpperCase()}: ${entry.content}`)
      .join("\n");

    const prompt = `${SYSTEM_PROMPT}

${
  advice
    ? `Latest model analysis context (use as reference, not certainty):
Disease label: ${advice.disease}
Urgency: ${advice.urgency}
Suggested context:
${formattedAdvice}
`
    : "No disease label context is available yet."
}

Recent chat history:
${historyText || "No prior history."}

User question:
${message}

Formatting and length instructions:
${
  responseMode === "concise"
    ? `Use markdown and keep it short.
1. **Direct answer**: 1-2 sentences max.
2. **Practical next steps**: 3-5 plain bullet points using "- " (no checkboxes).
3. **When to escalate**: 1-2 bullets.
Target under 140 words unless the user asks for more detail.`
    : `Use markdown and provide detailed but clear guidance.
1. **Direct answer**
2. **Practical next steps** with plain bullet points using "- " (no checkboxes)
3. **When to escalate to a veterinarian**
4. **Why this matters**`
}`;

    const modelCandidates = [configuredModel, "gemini-2.5-flash"].filter(
      (model): model is string => Boolean(model)
    );

    let llmResponse = "";
    let lastModelError: string | null = null;

    for (const modelName of modelCandidates) {
      try {
        const model = geminiClient.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        llmResponse = result.response.text().trim();
        if (llmResponse) break;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        // Keep the first concrete upstream failure to avoid masking it with later fallback noise.
        if (!lastModelError) {
          lastModelError = `${modelName}: ${message}`;
        }
      }
    }

    if (!llmResponse) {
      if (advice) {
        // Keep the assistant usable even if upstream model calls fail.
        const reason = lastModelError ? `\n\nLive AI error: ${lastModelError}` : "";
        llmResponse = `I couldn't reach the live AI model right now. Here's guidance based on your latest analysis:\n\n${formattedAdvice}${reason}`;
      } else {
        return NextResponse.json(
          {
            error:
              lastModelError ||
              `AI returned an empty response. Check GEMINI_API_KEY and model access. key=${keyFingerprint(
                apiKey
              )}`,
          },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      response: llmResponse,
      disease: advice?.disease,
      urgency: advice?.urgency,
      bookAppointmentSuggestion:
        advice && advice.urgency !== "low"
          ? "We recommend scheduling an appointment with a veterinarian as soon as possible."
          : "Consider a routine check-up with your veterinarian.",
    });
  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Failed to process chat message: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to get advice without sending a message
export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get disease from query parameter
    const disease = req.nextUrl.searchParams.get("disease");

    if (!disease) {
      return NextResponse.json(
        { error: "Please provide a disease parameter" },
        { status: 400 }
      );
    }

    const advice = getDiseaseAdvice(disease);
    const formattedAdvice = formatAdviceForChat(advice);

    return NextResponse.json({
      success: true,
      response: formattedAdvice,
      disease: advice.disease,
      urgency: advice.urgency,
      recommendations: {
        treatmentOptions: advice.treatment,
        preventionMeasures: advice.prevention,
        recommendedAction: advice.recommendedAction,
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve advice" },
      { status: 500 }
    );
  }
}
