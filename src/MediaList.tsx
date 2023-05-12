import React from "react"
import { observer } from "mobx-react"
import { action } from "mobx"

import { MediaContentItem } from "./MediaContent.types"
import { MediaForm } from "./MediaForm"

export const MediaItem = observer(
  ({
    item,
    handleDelete,
  }: {
    item: MediaContentItem
    handleDelete: (id: number) => void
  }) => {
    const modalRef = React.useRef<HTMLDialogElement | null>(null)

    return (
      <li key={item.id}>
        <h2>{item.title}</h2>
        <p>
          {item.genre} {item.type}
        </p>
        <p>Rating: {item.rating}</p>
        <p>Released: {item.releaseYear}</p>
        <button type="button" onClick={() => modalRef.current?.showModal()}>
          Edit
        </button>
        <button type="button" onClick={() => handleDelete(item.id)}>
          Delete
        </button>
        <dialog ref={modalRef}>
          <MediaForm
            item={item}
            onTitleEdit={action((value) => {
              item.title = value
            })}
            onTypeEdit={action((value) => {
              item.type = value
            })}
            onReleaseYearEdit={action((value) => {
              item.releaseYear = value
            })}
            onGenreEdit={action((value) => {
              item.genre = value
            })}
            onRatingEdit={action((value) => {
              item.rating = value
            })}
          />
          <button type="button" onClick={() => modalRef.current?.close()}>
            Close
          </button>
        </dialog>
      </li>
    )
  }
)

export const MediaList = observer(
  ({
    mediaList,
    handleRemove,
  }: {
    mediaList: Array<MediaContentItem>
    handleRemove: (id: number) => void
  }) => {
    return (
      <ol>
        {mediaList.map((item) => (
          <MediaItem key={item.id} item={item} handleDelete={handleRemove} />
        ))}
      </ol>
    )
  }
)
