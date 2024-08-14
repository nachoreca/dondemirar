import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServiceService } from './services/service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { tailspin } from 'ldrs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  country: string = '';
  title: string = '';
  results: any[] = [];
  loader: boolean = false;
  darkMode: boolean = false;
  searched: boolean = false;
  fill: string = 'black';
  constructor(private movieService: ServiceService) {}

  search() {
    this.results = []; //Se reinicia el resultado final.
    setTimeout(async () => {
      this.loader = true;
      (await this.movieService.search(this.title, this.country)).subscribe(
        (data) => {

          this.searched = true;

          if (data.results) {
            this.results = data.results;
            this.loader = false;
          }

          if (!data.results) {
            this.loader = false; // No hay resultados, oculta el loader
            return;
          }

          let processedResults = 0;

          if (this.results) {
            this.results.forEach((result) => {
              this.movieService
                .getWatchProviders(result.media_type, result.id)
                .subscribe((providers) => {
                  if (providers.results) {
                    result.watch_providers = providers.results[this.country];
                  }
                  processedResults++;

                  if(result.watch_providers === undefined) {
                    this.results = this.results.filter((item) => item.id !== result.id)
                  }

                  // Cuando todos los resultados han sido procesados
                  // if (processedResults === this.results.length) {
                  //   // Filtra los resultados para eliminar aquellos que no tienen watch_providers
                  //   this.results = this.results.filter(
                  //     (res) => res.watch_providers !== undefined
                  //   );
                  //   this.loader = false; // Oculta el loader
                  // }
                });
            });
          }
        }
      );
    }, 300);
  }

  clear() {
    this.results = [];
    this.title = '';
    this.country = '';
    this.searched = false;

  }

  toggleDarkMode(value: boolean) {
    this.darkMode = value;
    const body = document.getElementsByTagName('body');
    const title: any = document.getElementsByClassName('title');
    const footer: any = document.getElementsByClassName('footer-name');
    if (this.darkMode) {
      body[0].style.background = 'rgb(60, 60, 60)';
      title[0].style.color = 'white';
      footer[0].style.color = 'white';
      this.fill = 'white';
    } else {
      body[0].style.background = '#f8f8f8';
      title[0].style.color = '#333';
      footer[0].style.color = '#333';
      this.fill = 'black';

    }
  }
}
