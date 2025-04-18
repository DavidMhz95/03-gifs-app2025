import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { GifphyResponse } from '../interfaces/gifphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GifService {

  private http = inject(HttpClient);
  trendingGifs = signal<Gif[]>([])
  trendingGifsLoading = signal(false)

  private trendingPage = signal(0);

  searchHistory = signal<Record<string, Gif[]>>({});
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  trendingGifsGroup = computed<Gif[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }

    return groups;
  })

  constructor() {
    this.loadTrendingGifs();
    this.loadSearchHistoryFromLocalStorage();
  }


  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem('searchHistory', historyString);
  })

  loadSearchHistoryFromLocalStorage() {
    const historyString = localStorage.getItem('searchHistory') ?? '{}';
    const history = JSON.parse(historyString)
    this.searchHistory.set(history);
  }


  loadTrendingGifs() {

    if (this.trendingGifsLoading()) return;

    this.trendingGifsLoading.set(true);

    this.http.get<GifphyResponse>(`${environment.gifphyUrl}/gifs/trending`,
      {
        params: { api_key: environment.gifphyApiKey, limit: '20', offset: this.trendingPage() * 20 }
      }).subscribe((res) => {
        const gifs = GifMapper.toGifArray(res.data);
        this.trendingGifsLoading.set(false);
        this.trendingGifs.update(currentGifs => [...currentGifs, ...gifs]);
        this.trendingPage.update(page => page + 1);
      });

  }


  searchGifs(query: string): Observable<Gif[]> {

    return this.http.get<GifphyResponse>(`${environment.gifphyUrl}/gifs/search`,
      {
        params: { api_key: environment.gifphyApiKey, limit: '20', q: query }
      }).pipe(
        map(({ data }) => data),
        map((items) => GifMapper.toGifArray(items)),

        //TODO: Historial
        tap((items) => {
          this.searchHistory.update((history) => ({
            ...history,
            [query.toLowerCase()]: items,
          }));
        })
      );

  }


  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? []
  }

}
