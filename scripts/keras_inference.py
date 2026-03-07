import base64
import json
import sys
from io import BytesIO


def main() -> int:
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing model path argument"}))
        return 1

    model_path = sys.argv[1]

    try:
        import numpy as np
        from PIL import Image
        import keras
    except Exception as exc:
        print(json.dumps({"error": f"Missing Python dependency: {exc}"}))
        return 1

    try:
        payload = json.loads(sys.stdin.read())
        image_base64 = payload.get("imageBase64")
        fallback_input_size = int(payload.get("inputSize", 224))

        if not image_base64:
            raise ValueError("imageBase64 was not provided")

        model = keras.models.load_model(model_path, compile=False)

        model_input_shape = getattr(model, "input_shape", None)
        input_size = fallback_input_size

        if (
            isinstance(model_input_shape, tuple)
            and len(model_input_shape) >= 4
            and isinstance(model_input_shape[1], int)
            and isinstance(model_input_shape[2], int)
        ):
            if model_input_shape[1] != model_input_shape[2]:
                raise ValueError(
                    f"Model expects non-square input: {model_input_shape}. This script supports square inputs only."
                )
            input_size = model_input_shape[1]

        image_bytes = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        image = image.resize((input_size, input_size))

        image_array = np.asarray(image, dtype=np.float32)
        batched = np.expand_dims(image_array, axis=0)
        predictions = model.predict(batched, verbose=0)

        if len(predictions.shape) != 2 or predictions.shape[1] < 4:
            raise ValueError(f"Unexpected model output shape: {predictions.shape}")

        scores = predictions[0].astype(float).tolist()
        print(json.dumps({"scores": scores[:4]}))
        return 0
    except Exception as exc:
        print(json.dumps({"error": str(exc)}))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
