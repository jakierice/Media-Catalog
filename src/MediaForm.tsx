import { observer } from "mobx-react"
import {
  MediaContentItem,
  ContentRating,
  ContentType,
  contentRatingSchema,
  contentTypeSchema,
} from "./MediaContent.types"

export const MediaForm = observer(
  ({
    item,
    onTitleEdit,
    onTypeEdit,
    onGenreEdit,
    onReleaseYearEdit,
    onRatingEdit,
  }: {
    item: Partial<MediaContentItem>
    onTitleEdit: (value: string) => void
    onTypeEdit: (value: ContentType) => void
    onGenreEdit: (value: string) => void
    onReleaseYearEdit: (value: number) => void
    onRatingEdit: (value: ContentRating) => void
  }) => {
    return (
      <form>
        <div>
          <label>
            Title
            <input
              placeholder="Forrest Gump"
              value={item.title}
              onChange={(e) => onTitleEdit(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Type
            <select
              name="content type"
              value={item.type}
              onChange={(e) => {
                const contentType = contentTypeSchema.parse(e.target.value)

                onTypeEdit(contentType)
              }}
            >
              <option value="movie">Movie</option>
              <option value="tv-show">TV Show</option>
              <option value="game">Game</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Genre
            <input
              placeholder="Romance"
              value={item.genre}
              onChange={(e) => onGenreEdit(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Release Year
            <input
              type="number"
              value={String(item.releaseYear)}
              onChange={(e) => {
                onReleaseYearEdit(parseInt(e.target.value))
              }}
            />
          </label>
        </div>
        <div>
          <label>
            Rating ({item.rating})
            <input
              type="range"
              min="0"
              max="10"
              value={item.rating}
              onChange={(e) => {
                const numberValue = contentRatingSchema.parse(
                  parseInt(e.target.value)
                )

                onRatingEdit(numberValue)
              }}
            />
          </label>
        </div>
      </form>
    )
  }
)
