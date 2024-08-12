import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private apiKey = '6f06b2b714774324219fa2ed6a208ede';
  private apiReadKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjA2YjJiNzE0Nzc0MzI0MjE5ZmEyZWQ2YTIwOGVkZSIsIm5iZiI6MTcyMzMzMjcxNi4wOTQxODcsInN1YiI6IjY2YjdmNGE1OTdiZjQ0NDgyM2YyOWU5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jWc0q2pqOOZnCjDTNbTQL1S71t5Ed0pOLAY_9xNCBvA'
  private apiUrl = 'https://api.themoviedb.org/3/search/multi';
  private baseUrl = 'https://api.themoviedb.org/3/';

  constructor(private http: HttpClient) {}

  // Buscar contenido basado en título y país
  async search(query: string, country: string): Promise<Observable<any>> {
    const url = `${this.apiUrl}?api_key=${this.apiKey}&query=${query}&region=${country}`;
    return this.http.get<any>(url);
  }

  // Obtener la información de disponibilidad para un contenido específico
  getWatchProviders(mediaType: string, id: number): Observable<any> {
    const url = `${this.baseUrl}${mediaType}/${id}/watch/providers?api_key=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  async searchWithProviders(query: string, country: string): Promise<Observable<any>> {
    return (await this.search(query, country)).pipe(
      map(response => {
        const results = response.results;
        // Crear un array de observables para obtener las plataformas disponibles para cada resultado
        const observables = results.map((result : any)=>
          this.getWatchProviders(result.media_type, result.id).pipe(
            map(providers => ({
              ...result,
              watch_providers: providers.results
            }))
          )
        );
        // Ejecutar todas las solicitudes de forma concurrente
        return forkJoin(observables);
      })
    );
  }
}
