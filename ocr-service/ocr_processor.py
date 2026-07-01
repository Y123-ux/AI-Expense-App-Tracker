"""
OCR Processor - Handles image preprocessing and text extraction using Tesseract.
"""

from PIL import Image, ImageFilter, ImageEnhance
import pytesseract
from typing import Tuple


class OCRProcessor:
    def extract_text(self, image_path: str) -> Tuple[str, float]:
        """Extract text from an image using Tesseract OCR with preprocessing."""
        image = Image.open(image_path)
        processed = self._preprocess(image)

        # Run Tesseract with receipt-optimized config
        data = pytesseract.image_to_data(
            processed, output_type=pytesseract.Output.DICT, config="--psm 6"
        )

        # Calculate average confidence
        confidences = [
            int(c) for c in data["conf"] if str(c) != "-1" and int(c) > 0
        ]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0

        # Get full text
        text = pytesseract.image_to_string(processed, config="--psm 6")

        return text.strip(), round(avg_confidence, 2)

    def _preprocess(self, image: Image.Image) -> Image.Image:
        """Preprocess image for better OCR accuracy."""
        # Convert to grayscale
        gray = image.convert("L")

        # Increase contrast
        enhancer = ImageEnhance.Contrast(gray)
        contrasted = enhancer.enhance(2.0)

        # Sharpen
        sharpened = contrasted.filter(ImageFilter.SHARPEN)

        # Resize if too small
        width, height = sharpened.size
        if width < 1000:
            scale = 1000 / width
            new_size = (int(width * scale), int(height * scale))
            sharpened = sharpened.resize(new_size, Image.LANCZOS)

        return sharpened
