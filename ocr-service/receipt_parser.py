"""
Receipt Parser - Extracts structured data (merchant, amount, date, items) from OCR text.
Uses regex patterns and heuristics for common receipt formats.
"""

import re
from datetime import datetime
from typing import Dict, List, Any


class ReceiptParser:
    def parse(self, text: str) -> Dict[str, Any]:
        """Parse OCR text into structured receipt data."""
        lines = [line.strip() for line in text.split("\n") if line.strip()]

        return {
            "merchant": self._extract_merchant(lines),
            "amount": self._extract_total(text),
            "date": self._extract_date(text),
            "items": self._extract_items(lines),
        }

    def _extract_merchant(self, lines: List[str]) -> str:
        """Extract merchant name - typically the first meaningful line."""
        for line in lines[:5]:
            # Skip lines that look like dates, numbers, or common headers
            if re.match(r"^\d", line):
                continue
            if re.match(r"^(date|time|receipt|invoice|order|tel|phone|fax)", line, re.I):
                continue
            if len(line) > 2:
                # Clean up common OCR artifacts
                cleaned = re.sub(r"[^\w\s&'-]", "", line).strip()
                if cleaned:
                    return cleaned

        return "Unknown Merchant"

    def _extract_total(self, text: str) -> float:
        """Extract total amount from receipt text."""
        patterns = [
            r"(?:grand\s*)?total[\s:]*\$?\s*([\d,]+\.?\d{0,2})",
            r"amount\s*due[\s:]*\$?\s*([\d,]+\.?\d{0,2})",
            r"balance\s*due[\s:]*\$?\s*([\d,]+\.?\d{0,2})",
            r"total\s*amount[\s:]*\$?\s*([\d,]+\.?\d{0,2})",
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                amount_str = match.group(1).replace(",", "")
                try:
                    return float(amount_str)
                except ValueError:
                    continue

        # Fallback: find the largest dollar amount in the text
        amounts = re.findall(r"\$?\s*([\d,]+\.\d{2})", text)
        if amounts:
            values = []
            for a in amounts:
                try:
                    values.append(float(a.replace(",", "")))
                except ValueError:
                    pass
            if values:
                return max(values)

        return 0.0

    def _extract_date(self, text: str) -> str:
        """Extract date from receipt text."""
        date_patterns = [
            (r"(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})", "%m/%d/%Y"),
            (r"(\d{4}[/-]\d{1,2}[/-]\d{1,2})", "%Y-%m-%d"),
            (
                r"((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2},?\s+\d{4})",
                "%B %d, %Y",
            ),
        ]

        for pattern, fmt in date_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                date_str = match.group(1)
                try:
                    # Handle 2-digit years
                    if re.match(r"\d{1,2}[/-]\d{1,2}[/-]\d{2}$", date_str):
                        fmt = fmt.replace("%Y", "%y")
                    parsed = datetime.strptime(date_str.replace("-", "/"), fmt.replace("-", "/"))
                    return parsed.strftime("%Y-%m-%d")
                except ValueError:
                    continue

        return datetime.now().strftime("%Y-%m-%d")

    def _extract_items(self, lines: List[str]) -> List[Dict[str, Any]]:
        """Extract line items from receipt."""
        items = []

        for line in lines:
            # Match patterns like "Item Name   $12.34" or "2 x Item  12.34"
            match = re.match(
                r"^(\d+)?\s*[xX]?\s*(.+?)\s+\$?\s*([\d,]+\.\d{2})\s*$", line
            )
            if match:
                qty = int(match.group(1)) if match.group(1) else 1
                name = match.group(2).strip()
                price = float(match.group(3).replace(",", ""))

                # Skip total/subtotal/tax lines
                if re.search(r"total|subtotal|tax|change|cash|credit|debit|tip", name, re.I):
                    continue

                if name and price > 0:
                    items.append({"name": name, "quantity": qty, "price": price})

        return items
