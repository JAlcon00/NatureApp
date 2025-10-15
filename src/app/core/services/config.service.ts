import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config = {
    apiUrl: this.getEnvVariable('API_URL', 'http://localhost:5000/api'),
    mapboxToken: this.getEnvVariable('MAPBOX_TOKEN', ''),
    production: this.getEnvVariable('NODE_ENV', 'development') === 'production'
  };

  private getEnvVariable(key: string, defaultValue: string = ''): string {
    // En desarrollo, intentamos obtener de las variables globales
    if (typeof window !== 'undefined' && (window as any).env) {
      return (window as any).env[key] || defaultValue;
    }
    
    // Fallback a valores por defecto
    return defaultValue;
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get mapboxToken(): string {
    return this.config.mapboxToken;
  }

  get isProduction(): boolean {
    return this.config.production;
  }

  // Método para cargar configuración desde un archivo externo
  async loadConfig(): Promise<void> {
    try {
      const response = await fetch('/assets/config.json');
      if (response.ok) {
        const config = await response.json();
        this.config = { ...this.config, ...config };
      }
    } catch (error) {
      console.warn('No se pudo cargar la configuración externa, usando valores por defecto');
    }
  }
}