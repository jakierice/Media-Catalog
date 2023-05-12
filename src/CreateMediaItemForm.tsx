import React from "react"
import {
  MediaContentItemDetails,
  ContentRating,
  ContentType,
} from "./MediaContent.types"
import { MediaForm } from "./MediaForm"

const CURRENT_YEAR = new Date().getFullYear()

export const CreateMediaItemForm = ({
  onSubmit,
}: {
  onSubmit: (details: MediaContentItemDetails) => void
}) => {
  const [title, setTitle] = React.useState("")
  const [type, setType] = React.useState<ContentType>("movie")
  const [releaseYear, setReleaseYear] = React.useState(CURRENT_YEAR)
  const [genre, setGenre] = React.useState("")
  const [rating, setRating] = React.useState<ContentRating>(5)

  return (
    <>
      <h2>Create New Content Item</h2>
      <MediaForm
        item={{ title, type, releaseYear, genre, rating }}
        onTitleEdit={setTitle}
        onTypeEdit={setType}
        onReleaseYearEdit={setReleaseYear}
        onGenreEdit={setGenre}
        onRatingEdit={setRating}
      />
      <button
        type="button"
        onClick={() => {
          onSubmit({ title, type, releaseYear, genre, rating })

          setTitle("")
          setType("movie")
          setReleaseYear(CURRENT_YEAR)
          setGenre("")
          setRating(5)
        }}
      >
        Create
      </button>
    </>
  )
}
