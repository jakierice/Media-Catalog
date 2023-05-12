import React from "react"
import { observer } from "mobx-react"
import { Stack, TextField, Select, MenuItem, Rating } from "@mui/material"
import {
  MediaContentItem,
  MediaContentItemDetails,
  mediaContentItemDetailsSchema,
  contentRatingSchema,
  contentTypeSchema,
} from "./MediaContent.types"

const defaultMediaItemFormValues: MediaContentItemDetails = {
  title: "",
  type: "movie",
  genre: "",
  releaseYear: new Date().getFullYear(),
  rating: 5,
}

export type HandleMediaItemFormChange = <
  K extends keyof MediaContentItem,
  V extends MediaContentItem[K]
>(
  key: K,
  value: V
) => void

type MediaFormProps = {
  formValues: MediaContentItemDetails
  onChange: HandleMediaItemFormChange
  onSubmit?: (item: MediaContentItemDetails) => void
  handleFormReset: () => void
  isValid: boolean
  dirtyValues: Record<string, boolean>
}

export const useMediaForm = ({
  initial,
  handleChange,
  handleSubmit,
}: {
  initial?: MediaContentItemDetails
  handleChange?: HandleMediaItemFormChange
  handleSubmit?: (item: MediaContentItemDetails) => void
}): MediaFormProps => {
  const [formValues, setFormValues] = React.useState<MediaContentItemDetails>(
    initial ?? defaultMediaItemFormValues
  )
  const [dirtyValues, setDirtyValues] = React.useState<Record<string, boolean>>(
    {}
  )
  const [isValid, setIsValid] = React.useState(true)

  const onChange: HandleMediaItemFormChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
    handleChange?.(key, value)
    setDirtyValues((prev) => ({ ...prev, [key]: true }))
  }

  const handleFormReset = () => {
    setFormValues(defaultMediaItemFormValues)
  }

  React.useEffect(() => {
    setIsValid(mediaContentItemDetailsSchema.safeParse(formValues).success)
  }, [formValues])

  return {
    formValues,
    onChange,
    onSubmit: handleSubmit,
    handleFormReset,
    isValid,
    dirtyValues,
  }
}

export const MediaForm = observer(
  ({ formValues, onChange, onSubmit, dirtyValues }: MediaFormProps) => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit?.(formValues)
        }}
      >
        <Stack gap={2} px={1} py={2}>
          <TextField
            label="Title"
            placeholder="Forrest Gump"
            value={formValues.title}
            onChange={(e) => onChange("title", e.target.value)}
            error={
              dirtyValues["title"] &&
              !mediaContentItemDetailsSchema.shape.title.safeParse(
                formValues.title
              ).success
            }
            helperText="Media content must have a title"
            required
          />
          <Select
            name="content type"
            value={formValues.type}
            onChange={(e) => {
              const contentType = contentTypeSchema.parse(e.target.value)

              onChange("type", contentType)
            }}
          >
            <MenuItem value="movie">Movie</MenuItem>
            <MenuItem value="tv-show">TV Show</MenuItem>
            <MenuItem value="game">Game</MenuItem>
          </Select>
          <TextField
            label="Genre"
            placeholder="Romance"
            value={formValues.genre}
            onChange={(e) => onChange("genre", e.target.value)}
            error={
              dirtyValues["genre"] &&
              !mediaContentItemDetailsSchema.shape.genre.safeParse(
                formValues.genre
              ).success
            }
            helperText="At least one genre related to this content"
            required
          />
          <TextField
            label="Release Year"
            type="number"
            value={String(formValues.releaseYear)}
            onChange={(e) => {
              onChange("releaseYear", parseInt(e.target.value))
            }}
            error={
              dirtyValues["releaseYear"] &&
              !mediaContentItemDetailsSchema.shape.releaseYear.safeParse(
                formValues.releaseYear
              ).success
            }
            helperText={`Year between 1930 and ${new Date().getFullYear()}`}
            required
          />
          <Rating
            max={10}
            value={formValues.rating}
            onChange={(_e, newValue) => {
              // Guarding against null values makes it possible for users
              // to "overflow" the rating when using arrow key input. For
              // instance, if a user holds down the right arrow key, the
              // rating "overflows" past 10 and back to 1. Without the guard,
              // the content rating schema will throw because of a null
              // value.
              if (newValue) {
                const numberValue = contentRatingSchema.parse(newValue)

                onChange("rating", numberValue)
              }
            }}
          />
        </Stack>
      </form>
    )
  }
)
