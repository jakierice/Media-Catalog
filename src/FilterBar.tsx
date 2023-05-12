import { observer } from "mobx-react"
import * as RD from "@devexperts/remote-data-ts"

import { TextField, Select, MenuItem, Button, Stack } from "@mui/material"

import { MediaContentStore } from "./MediaContentStore"
import { contentTypeSchema } from "./MediaContent.types"

export const FilterBar = observer(({ media }: { media: MediaContentStore }) => {
  return (
    <Stack direction="row" alignItems="center" gap={2} px={1} py={2}>
      <TextField
        label="Filter by title"
        size="small"
        placeholder="My favorite movie"
        disabled={!RD.isSuccess(media.mediaContent)}
        value={media.titleFilter}
        onChange={(e) => {
          media.setTitleFilter(e.target.value)
        }}
      />
      <Select
        label="Filter by type"
        name="content type"
        size="small"
        sx={{ width: "128px" }}
        disabled={!RD.isSuccess(media.mediaContent)}
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
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="movie">Movie</MenuItem>
        <MenuItem value="tv-show">TV Show</MenuItem>
        <MenuItem value="game">Game</MenuItem>
      </Select>
      <Button
        disabled={
          !RD.isSuccess(media.mediaContent) ||
          (!media.contentTypeFilter && media.titleFilter === "")
        }
        onClick={media.clearFilters}
      >
        Clear Filters
      </Button>
    </Stack>
  )
})
