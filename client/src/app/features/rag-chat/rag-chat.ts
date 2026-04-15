import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { RagService, RagResponse } from '../../services/rag.service';

@Component({
  selector: 'app-rag-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './rag-chat.html',
  styleUrl: './rag-chat.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'ngSkipHydration': 'true' }  // ← Désactiver SSR pour éviter les mismatches
})
export class RagChatComponent implements OnInit {
  // FormControl pour la question
  questionControl = new FormControl('');
  
  responses = signal<RagResponse[]>([]);
  loading = signal(false);
  uploading = signal(false);
  error = signal<string | null>(null);
  apiHealthy = signal(false);
  selectedFile = signal<File | null>(null);
  questionLength = signal(0);
  documentSummary = signal<string | null>(null);
  showSummary = signal(false);

  constructor(private ragService: RagService) {
    // Écouter les changements du FormControl
    this.questionControl.valueChanges.subscribe(value => {
      console.log('Text changed:', value);
      this.questionLength.set((value || '').length);
    });
  }

  ngOnInit() {
    console.log('🎯 RagChatComponent initialisé');
    
    // Vérifier que l'API est accessible
    this.ragService.checkHealth().subscribe({
      next: (response) => {
        console.log('✅ Health check OK:', response);
        this.apiHealthy.set(true);
      },
      error: (err) => {
        console.error('❌ Health check failed:', err);
        this.apiHealthy.set(false);
        this.error.set('⚠️ Impossible de se connecter à l\'API RAG (port 5000). Vérifiez que le serveur Python est lancé.');
      }
    });
  }

  /**
   * Envoyer une question au RAG
   */
  sendQuestion() {
    const q = (this.questionControl.value || '').trim();
    
    console.log('📤 Question:', q, 'API:', this.apiHealthy());
    
    if (!q || !this.apiHealthy()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.ragService.askQuestion(q).subscribe({
      next: (response: RagResponse) => {
        console.log('✅ Réponse reçue');
        this.responses.update(prev => [...prev, response]);
        this.questionControl.setValue('');
        this.questionLength.set(0);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        this.error.set(`Erreur: ${err.error?.detail || 'Erreur inconnue'}`);
        this.loading.set(false);
      }
    });
  }

  /**
   * Gérer la sélection d'un fichier
   */
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.error.set('❌ Seuls les fichiers PDF sont acceptés');
        return;
      }
      this.selectedFile.set(file);
      this.error.set(null);
    }
  }

  /**
   * Uploader un PDF
   */
  uploadPDF() {
    const file = this.selectedFile();
    if (!file) {
      this.error.set('❌ Veuillez sélectionner un fichier');
      return;
    }

    this.uploading.set(true);
    this.error.set(null);

    this.ragService.uploadPDF(file).subscribe({
      next: (response: any) => {
        this.error.set(`✅ ${response.message || 'PDF uploadé avec succès'}`);
        this.selectedFile.set(null);
        this.uploading.set(false);
        this.showSummary.set(true);
        
        // Récupérer le résumé généré côté backend
        if (response.summary) {
          this.documentSummary.set(response.summary);
          console.log('✅ Résumé reçu du serveur');
        }
        
        const fileInput = document.getElementById('pdfInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (err) => {
        this.error.set(`❌ Erreur: ${err.error?.detail || 'Erreur inconnue'}`);
        this.uploading.set(false);
      }
    });
  }

  /**
   * Générer un résumé du document uploadé
   */
  generateDocumentSummary(file: File) {
    // Résumé généré automatiquement côté backend lors de l'upload
    console.log('Résumé généré automatiquement lors de l\'upload');
  }

  /**
   * Effacer l'historique
   */
  clearHistory() {
    this.responses.set([]);
  }

  /**
   * Gérer la touche Entrée
   */
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendQuestion();
    }
  }

  /**
   * Le bouton peut-il être cliqué ?
   */
  canSendQuestion(): boolean {
    return this.apiHealthy() && !this.loading() && this.questionLength() > 0;
  }
}
