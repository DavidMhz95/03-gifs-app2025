import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {


  private gifService = inject(GifService);
  gifs = signal<Gif[]>([]);

  onSearchGifs(query: string) {
    this.gifService.searchGifs(query).subscribe((data) => {
      this.gifs.set(data)
    });
  }


 }
