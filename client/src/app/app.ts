import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HeroSection } from './features/hero-section/hero-section';
import { RagChatComponent } from './features/rag-chat/rag-chat';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, HeroSection, RagChatComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
}
