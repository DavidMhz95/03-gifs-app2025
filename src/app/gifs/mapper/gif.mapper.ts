import { Gif } from "../interfaces/gif.interface";
import { GiphyItem } from "../interfaces/gifphy.interfaces";

export class GifMapper {

  static toGif(item: GiphyItem): Gif {

    return {
      id: item.id,
      title: item.title,
      url: item.images.original.url,
    }
  }

  static toGifArray(items: GiphyItem[]): Gif[] {
    return items.map((item) => this.toGif(item));
  }


}
