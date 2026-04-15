import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RagResponse {
  question: string;
  answer: string;
  sources: string[];
  time: number;
}

@Injectable({
  providedIn: 'root'
})
export class RagService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  /**
   * Poser une question au système RAG
   * @param question La question à poser
   * @param topK Nombre de sources à récupérer (default: 3)
   */
  askQuestion(question: string, topK: number = 3): Observable<RagResponse> {
    return this.http.post<RagResponse>(`${this.apiUrl}/ask`, {
      question: question,
      top_k: topK
    });
  }

  /**
   * Uploader un PDF et l'indexer dans Chroma
   * @param file Le fichier PDF à uploader
   */
  uploadPDF(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  /**
   * Vérifier la santé de l'API
   */
  checkHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  /**
   * Obtenir le statut du système RAG
   */
  getStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/status`);
  }

  /**
   * Résumer un texte/document
   * @param text Le texte à résumer
   * @param language La langue (default: English)
   */
  summarizeText(text: string, language: string = 'English'): Observable<any> {
    return this.http.post(`${this.apiUrl}/summarize`, {
      text: text,
      language: language
    });
  }
}
