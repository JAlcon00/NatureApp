import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <h2>🌿 NatureApp</h2>
      </div>
      
      <ul class="nav-links">
        <li>
          <a routerLink="/home" routerLinkActive="active">
            🏠 Inicio
          </a>
        </li>
        <li>
          <a routerLink="/places" routerLinkActive="active">
            📍 Lugares
          </a>
        </li>
        <li>
          <a routerLink="/trails" routerLinkActive="active">
            🥾 Senderos
          </a>
        </li>
      </ul>
    </nav>
  `,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {}