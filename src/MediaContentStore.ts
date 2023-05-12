import { of, map, catchError } from "rxjs"
import * as RD from "@devexperts/remote-data-ts"
import { makeObservable, observable, runInAction, action } from "mobx"
import {
  MediaContentItem,
  MediaContentItemDetails,
  ContentType,
} from "./MediaContent.types"
import { MediaContentService } from "./MediaContent.service"

// Model the application state.
export class MediaContentStore {
  content: RD.RemoteData<string, Array<MediaContentItem>> = RD.initial
  titleFilter: string = ""
  contentTypeFilter: ContentType | null = null

  constructor(private mediaContentService: MediaContentService) {
    makeObservable(this, {
      content: observable,
      titleFilter: observable,
      contentTypeFilter: observable,
      fetchMedia: action,
      setTitleFilter: action,
      setContentFilter: action,
      clearFilters: action,
      createMediaItem: action,
      removeMediaItem: action,
    })
  }

  get mediaContent() {
    if (RD.isSuccess(this.content)) {
      return RD.success(
        this.content.value
          .filter(({ title }) =>
            title.toLowerCase().includes(this.titleFilter.toLowerCase())
          )
          .filter(({ type }) =>
            this.contentTypeFilter ? type === this.contentTypeFilter : true
          )
      )
    } else {
      return this.content
    }
  }

  setTitleFilter = (value: string) => {
    this.titleFilter = value
  }

  setContentFilter = (value: ContentType | null) => {
    this.contentTypeFilter = value
  }

  clearFilters = () => {
    this.titleFilter = ""
    this.contentTypeFilter = null
  }

  fetchMedia() {
    this.content = RD.pending

    this.mediaContentService
      .findAll()
      .pipe(
        map((data) => RD.success(data)),
        catchError((err) => of(RD.failure(err)))
      )
      .subscribe((data) => {
        runInAction(() => {
          this.content = data
        })
      })
  }

  createMediaItem = (item: MediaContentItemDetails) => {
    if (RD.isSuccess(this.content)) {
      const nextId =
        this.content.value.reduce(
          (acc, current) => (acc > current.id ? acc : current.id),
          1
        ) + 1

      this.content = RD.success(
        this.content.value.concat({ ...item, id: nextId })
      )
    }
  }

  removeMediaItem = (id: number) => {
    if (RD.isSuccess(this.content)) {
      this.content = RD.success(
        this.content.value.filter((item) => item.id !== id)
      )
    }
  }
}
