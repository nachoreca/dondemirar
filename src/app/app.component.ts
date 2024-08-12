import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServiceService } from './services/service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Importa CommonModule
import { tailspin } from 'ldrs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  country: string = '';
  title: string = '';
  results: any[] = [];
  loader: boolean = false;
  emptyResults: boolean = false;
  constructor(private movieService: ServiceService) {}

  // search() {
  //   this.loader = true;
  //   setTimeout(() => {
  //     this.movieService.search(this.title, this.country).subscribe(data => {
  //       this.results = data.results;
  //       this.results.forEach(result => {
  //         this.movieService.getWatchProviders(result.media_type, result.id).subscribe(providers => {
  //           if (providers.results) {
  //             result.watch_providers = providers.results[this.country];
  //           }
  //         });
  //       });
  //       this.loader = false;
  //     });
  //   }, 1500); // 2000 ms = 2 segundos
  // }

  search() {
    setTimeout(async () => {
      this.loader = true;
      (await this.movieService.search(this.title, this.country)).subscribe(data => {
        if (data.results) {
          this.results = data.results;
          this.loader = false;
          this.emptyResults = false;
        }

        if (!data.results) {
          this.loader = false; // No hay resultados, oculta el loader
          this.emptyResults = true;
          return;
        }

        let processedResults = 0;

        if (this.results) {
          this.results.forEach(result => {
            this.movieService.getWatchProviders(result.media_type, result.id).subscribe(providers => {
              if (providers.results) {
                result.watch_providers = providers.results[this.country];
              }
              processedResults++;

              // Cuando todos los resultados han sido procesados
              if (processedResults === this.results.length) {
                // Filtra los resultados para eliminar aquellos que no tienen watch_providers
                this.results = this.results.filter(res => res.watch_providers !== undefined);
                this.loader = false; // Oculta el loader
              }
            });
          });
        }
      });
    }, 300)
  }




}
