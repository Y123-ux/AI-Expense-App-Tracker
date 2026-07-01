"""
Python OCR Microservice - FastAPI
Provides OCR text extraction and receipt parsing via REST API.
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
from ocr_processor import OCRProcessor
from receipt_parser import ReceiptParser

app = FastAPI(title="OCR Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ocr_processor = OCRProcessor()
receipt_parser = ReceiptParser()


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ocr-service"}


@app.post("/ocr/extract")
async def extract_receipt(file: UploadFile = File(...)):
    """Extract structured data from a receipt image."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Save uploaded file temporarily
    suffix = os.path.splitext(file.filename or "image.png")[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        # Run OCR
        raw_text, confidence = ocr_processor.extract_text(tmp_path)

        # Parse structured data from OCR text
        parsed = receipt_parser.parse(raw_text)

        return {
            "text": raw_text,
            "confidence": confidence,
            "parsed": {
                "merchant": parsed["merchant"],
                "amount": parsed["amount"],
                "date": parsed["date"],
                "items": parsed["items"],
                "raw_text": raw_text,
            },
        }
    finally:
        os.unlink(tmp_path)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
