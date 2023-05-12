import React from "react"
import { match } from "ts-pattern"
import * as RD from "@devexperts/remote-data-ts"
import { observer } from "mobx-react"

import {
  AppBar,
  Container,
  Divider,
  Typography,
  Stack,
  Box,
  Fab,
  Skeleton,
} from "@mui/material"
import { Movie, Add } from "@mui/icons-material"

import { MediaContentStore } from "./MediaContentStore"
import { MediaContentService } from "./MediaContent.service"

import { FilterBar } from "./FilterBar"
import { MediaList } from "./MediaList"
import { NewMediaFormDialog } from "./NewMediaFormDialog"

const mediaStore = new MediaContentStore(new MediaContentService())

const MediaApplication = observer(({ media }: { media: MediaContentStore }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  React.useEffect(() => {
    media.fetchMedia()
  }, [media])

  return (
    <>
      <header>
        <AppBar position="sticky">
          <Stack direction="row" gap={2} alignItems="center" p={1}>
            <Movie />
            <Typography variant="h1" fontSize={32} sx={{ userSelect: "none" }}>
              Media Catalog
            </Typography>
          </Stack>
        </AppBar>
      </header>

      <Box component="main">
        <Container maxWidth="lg">
          <FilterBar media={media} />
        </Container>

        <Divider />
        <Container maxWidth="lg">
          {match(media.mediaContent)
            .with({ _tag: "RemoteInitial" }, () => <></>)
            .with({ _tag: "RemotePending" }, () => (
              <Stack gap={1} p={2}>
                <Skeleton variant="rectangular" height={60} />
                <Skeleton variant="rectangular" height={60} />
                <Skeleton variant="rectangular" height={60} />
                <Skeleton variant="rectangular" height={60} />
                <Skeleton variant="rectangular" height={60} />
              </Stack>
            ))
            .with({ _tag: "RemoteFailure" }, ({ error }) => <p>{error}</p>)
            .with({ _tag: "RemoteSuccess" }, ({ value }) => (
              <>
                <MediaList
                  mediaList={value}
                  handleRemove={media.removeMediaItem}
                />
                <NewMediaFormDialog
                  isOpen={isCreateDialogOpen}
                  handleClose={() => setIsCreateDialogOpen(false)}
                  media={media}
                />
              </>
            ))
            .exhaustive()}
        </Container>

        <Fab
          color="primary"
          disabled={!RD.isSuccess(media.mediaContent)}
          aria-label="add media"
          onClick={() => setIsCreateDialogOpen(true)}
          sx={{ position: "fixed", bottom: 16, right: 16 }}
        >
          <Add />
        </Fab>
      </Box>
    </>
  )
})

export const App = () => {
  return <MediaApplication media={mediaStore} />
}
