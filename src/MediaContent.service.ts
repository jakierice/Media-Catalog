import { from, Observable } from "rxjs"
import { MediaContentItem } from "./MediaContent.types"

import { mockPromise } from "./mockPromise"

export const mockMediaData: Array<MediaContentItem> = [
  {
    id: 1,
    title: "Mobile Suit Gundam Wing Endless Waltz",
    type: "movie",
    genre: "Action, military science fiction",
    releaseYear: 1997,
    rating: 9,
  },
  {
    id: 2,
    title: "Inuyasha",
    type: "tv-show",
    genre: "Action, adventure",
    releaseYear: 2000,
    rating: 6,
  },
  {
    id: 3,
    title: "Legend of Zelda: Ocarina of Time",
    type: "game",
    genre: "RPG",
    releaseYear: 1998,
    rating: 10,
  },
  {
    id: 4,
    title: "Rurouni Kenshin",
    type: "tv-show",
    genre: "Adventure, martial arts, romance",
    releaseYear: 1994,
    rating: 7,
  },
]

export class MediaContentService {
  findAll = (): Observable<Array<MediaContentItem>> => {
    return from(
      mockPromise<Array<MediaContentItem>>(
        { tag: "success", data: mockMediaData },
        1500
      )
    )
  }
}
