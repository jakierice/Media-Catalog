import React from "react"
import { match } from "ts-pattern"
import { observer } from "mobx-react"
import { action } from "mobx"

import {
  Button,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
  Rating,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import { MoreVert, Movie, SportsEsports, Tv } from "@mui/icons-material"

import { MediaContentItem } from "./MediaContent.types"
import { useMediaForm, MediaForm } from "./MediaForm"

export const MediaItem = observer(
  ({
    item,
    handleDelete,
  }: {
    item: MediaContentItem
    handleDelete: (id: number) => void
  }) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const isActionMenuOpen = Boolean(anchorEl)
    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleCloseMenu = () => {
      setAnchorEl(null)
    }

    const handleOpenDialog = () => {
      setIsEditDialogOpen(true)
    }

    const handleCloseDialog = () => {
      setIsEditDialogOpen(false)
    }

    const mediaFormProps = useMediaForm({
      initial: item,
      handleChange: action((key, value) => {
        item[key] = value
      }),
    })

    return (
      <ListItem
        key={item.id}
        secondaryAction={
          <>
            <IconButton
              aria-label="media item actions"
              onClick={handleOpenMenu}
            >
              <MoreVert />
            </IconButton>
            <Menu
              open={isActionMenuOpen}
              onClose={handleCloseMenu}
              anchorEl={anchorEl}
            >
              <MenuItem onClick={handleOpenDialog}>Edit</MenuItem>
              <MenuItem onClick={() => handleDelete(item.id)}>Delete</MenuItem>
            </Menu>
          </>
        }
      >
        <ListItemIcon>
          {match(item.type)
            .with("movie", () => <Movie />)
            .with("tv-show", () => <Tv />)
            .with("game", () => <SportsEsports />)
            .exhaustive()}
        </ListItemIcon>
        <ListItemText
          primary={
            <Grid container spacing={1}>
              <Grid item xs={12} md="auto">
                {item.title}
              </Grid>
              <Grid item xs={12} md="auto">
                <Rating value={item.rating} max={10} readOnly />
              </Grid>
            </Grid>
          }
          secondary={`${item.genre} ${item.type} - ${item.releaseYear}`}
        />
        <Dialog
          open={isEditDialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Edit details for {item.title}</DialogTitle>
          <DialogContent>
            <MediaForm {...mediaFormProps} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </ListItem>
    )
  }
)
// <MediaFormDialog
//   item={item}
//   title={`Edit details for ${item.title}`}
//   isOpen={isEditDialogOpen}
//   onClose={handleCloseDialog}
//   handleFormChange={action((key, value) => {
//     item[key] = value
//   })}
// />

export const MediaList = observer(
  ({
    mediaList,
    handleRemove,
  }: {
    mediaList: Array<MediaContentItem>
    handleRemove: (id: number) => void
  }) => {
    return (
      <List>
        {mediaList.map((item) => (
          <MediaItem key={item.id} item={item} handleDelete={handleRemove} />
        ))}
      </List>
    )
  }
)
