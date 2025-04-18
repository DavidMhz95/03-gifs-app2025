import {  AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { GifService } from '../../services/gifs.service';
import { SrollStateService } from 'src/app/shared/services/scroll-state.service';

@Component({
  selector: 'app-trending-page',
  // imports: [GifListComponent],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent implements AfterViewInit {


  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(! scrollDiv) return;

    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }

  gifService = inject(GifService);
  scrollStateService = inject(SrollStateService);

  scrollDivRef =  viewChild<ElementRef<HTMLDivElement>>('groupDiv')

  onScroll(event:Event){
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(! scrollDiv) return;


    const scrollTop = scrollDiv.scrollTop; // Altura scrolleada
    const clientHeight = scrollDiv.clientHeight; // Altura visible
    const scrollHeight = scrollDiv.scrollHeight; // Maximo scroll posible

    // Si Scrolltop + ScrollHeight es igual a ScrollHeight, significa que hemos llegado al final
    // Damos 300px de margen, para hacer la peticion CERCA del final
     const isAtBottom: boolean = scrollTop + clientHeight +300 >= scrollHeight;

     this.scrollStateService.trendingScrollState.set(scrollTop);


     if(isAtBottom){
      this.gifService.loadTrendingGifs();
     }
  }

}
