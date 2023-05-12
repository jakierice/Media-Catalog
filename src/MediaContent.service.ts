import { from, Observable, catchError } from "rxjs"
import { MediaContentItem, MediaContentItemDetails } from "./MediaContent.types"

import { mockPromise } from "./mockPromise"

export const mockMediaData: Array<MediaContentItem> = [
  {
    id: 1,
    title: "Rocket Science",
    type: "movie",
    genre: "Comedy",
    releaseYear: 2003,
    rating: 9,
  },
  {
    id: 2,
    title: "Superstore",
    type: "tv-show",
    genre: "Comedy",
    releaseYear: 2017,
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
