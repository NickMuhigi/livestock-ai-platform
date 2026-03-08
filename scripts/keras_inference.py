import base64
import json
import sys
from io import BytesIO


def _load_model_compat(model_path: str):
    # Try TensorFlow Keras first because many .keras exports are tied to tf.keras internals.
    try:
        import tensorflow as tf

        class CompatibleRandomFlip(tf.keras.layers.RandomFlip):
            def __init__(self, *args, data_format=None, **kwargs):
                super().__init__(*args, **kwargs)

        class CompatibleRandomRotation(tf.keras.layers.RandomRotation):
            def __init__(self, *args, data_format=None, **kwargs):
                super().__init__(*args, **kwargs)

        class CompatibleRandomZoom(tf.keras.layers.RandomZoom):
            def __init__(self, *args, data_format=None, **kwargs):
                super().__init__(*args, **kwargs)

        custom_objects = {
            "RandomFlip": CompatibleRandomFlip,
            "RandomRotation": CompatibleRandomRotation,
            "RandomZoom": CompatibleRandomZoom,
        }

        return tf.keras.models.load_model(
            model_path,
            compile=False,
            custom_objects=custom_objects,
        )
    except Exception:
        pass

    # Fallback for environments where standalone keras is installed.
    import keras

    return keras.models.load_model(model_path, compile=False)


def _has_rescaling_layer(layer, visited=None) -> bool:
    if visited is None:
        visited = set()
    if id(layer) in visited:
        return False
    visited.add(id(layer))

    if layer.__class__.__name__ == "Rescaling":
        return True

    nested_layers = getattr(layer, "layers", None)
    if not nested_layers:
        return False

    return any(_has_rescaling_layer(nested, visited) for nested in nested_layers)


def main() -> int:
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing model path argument"}))
        return 1

    model_path = sys.argv[1]

    try:
        import numpy as np
        from PIL import Image
    except Exception as exc:
        print(json.dumps({"error": f"Missing Python dependency: {exc}"}))
        return 1

    try:
        payload = json.loads(sys.stdin.read())
        image_base64 = payload.get("imageBase64")
        fallback_input_size = int(payload.get("inputSize", 224))

        if not image_base64:
            raise ValueError("imageBase64 was not provided")

        model = _load_model_compat(model_path)
        normalize_input = not _has_rescaling_layer(model)

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
        if normalize_input:
            image_array = image_array / 255.0
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
