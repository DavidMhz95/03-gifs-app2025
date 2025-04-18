import { Injectable, signal } from '@angular/core';

@Injectable({providedIn: 'root'})
export class SrollStateService {

   trendingScrollState = signal<number>(0);


}
