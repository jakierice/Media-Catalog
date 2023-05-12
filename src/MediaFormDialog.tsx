import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"

import { MediaContentItemDetails } from "./MediaContent.types"
import { HandleMediaItemFormChange, MediaForm } from "./MediaForm"

export const MediaFormDialog = ({
  onSubmit,
  isOpen,
  onClose,
  handleFormChange,
  item,
  title,
}: {
  item: MediaContentItemDetails
  isOpen: boolean
  onClose: () => void
  handleFormChange: HandleMediaItemFormChange
  onSubmit?: (details: MediaContentItemDetails) => void
  title: string
}) => {
  const handleSubmit = () => {
    onSubmit?.(item)
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {onSubmit && (
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
