export interface Receipt {
  id: string;
  image_path: string;
  raw_text: string | null;
  parsed_data: string | null;
  user_id: string;
  created_at: string;
}

export interface ParsedReceiptData {
  merchant: string;
  amount: number;
  date: string;
  items: ReceiptItem[];
  raw_text: string;
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  parsed: ParsedReceiptData;
}
