import { observer } from "mobx-react"

import { MediaContentStore } from "./MediaContentStore"
import { contentTypeSchema } from "./MediaContent.types"

export const FilterBar = observer(({ media }: { media: MediaContentStore }) => {
  return (
    <>
      <label>
        Filter by title
        <input
          type="text"
          placeholder="My favorite movie"
          value={media.titleFilter}
          onChange={(e) => {
            media.setTitleFilter(e.target.value)
          }}
        />
      </label>
      <label>
        Filter by type
        <select
          name="content type"
          value={media.contentTypeFilter ?? "all"}
          onChange={(e) => {
            if (e.target.value === "all") {
              media.setContentFilter(null)
            } else {
              const contentType = contentTypeSchema.parse(e.target.value)

              media.setContentFilter(contentType)
            }
          }}
        >
          <option value="all">All</option>
          <option value="movie">Movie</option>
          <option value="tv-show">TV Show</option>
          <option value="game">Game</option>
        </select>
      </label>
      <button type="button" onClick={media.clearFilters}>
        Clear Filters
      </button>
    </>
  )
})
