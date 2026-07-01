import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import { IOCRStrategy } from './IOCRStrategy';
import { OCRResult } from '../../models/Receipt';
import Config from '../../config';

// Strategy Pattern: Python microservice OCR implementation
export class PythonOCRStrategy implements IOCRStrategy {
  readonly name = 'python';
  private baseUrl: string;

  constructor() {
    this.baseUrl = Config.getInstance().pythonOcrUrl;
  }

  async extractText(imagePath: string): Promise<OCRResult> {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath));

    const response = await axios.post(`${this.baseUrl}/ocr/extract`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000,
    });

    return response.data as OCRResult;
  }
}
