import { observer } from "mobx-react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"

import { MediaContentStore } from "./MediaContentStore"
import { useMediaForm, MediaForm } from "./MediaForm"
import { MediaContentItemDetails } from "./MediaContent.types"

export const NewMediaFormDialog = observer(
  ({
    isOpen,
    handleClose,
    media,
  }: {
    isOpen: boolean
    handleClose: () => void
    media: MediaContentStore
  }) => {
    const handleNewItemSubmit = (newItem: MediaContentItemDetails) => {
      media.createMediaItem(newItem)
      handleClose()
    }
    const mediaFormProps = useMediaForm({
      initial: {
        title: "",
        type: "movie",
        genre: "",
        rating: 5,
        releaseYear: new Date().getFullYear(),
      },
      handleSubmit: handleNewItemSubmit,
    })

    return (
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Create new media item</DialogTitle>
        <DialogContent>
          <MediaForm {...mediaFormProps} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            variant="contained"
            disabled={!mediaFormProps.isValid}
            onClick={() => handleNewItemSubmit(mediaFormProps.formValues)}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
)
