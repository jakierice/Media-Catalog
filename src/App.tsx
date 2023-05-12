import React from "react"
import { match } from "ts-pattern"
import { observer } from "mobx-react"

import { MediaContentStore } from "./MediaContentStore"
import { MediaContentService } from "./MediaContent.service"

import { FilterBar } from "./FilterBar"
import { MediaList } from "./MediaList"
import { CreateMediaItemForm } from "./CreateMediaItemForm"

const mediaStore = new MediaContentStore(new MediaContentService())

const MediaApplication = observer(({ media }: { media: MediaContentStore }) => {
  const modalRef = React.useRef<HTMLDialogElement | null>(null)

  React.useEffect(() => {
    media.fetchMedia()
  }, [media])

  return (
    <>
      <header>
        <h1>Media Catalog</h1>
      </header>

      <main>
        {match(media.mediaContent)
          .with({ _tag: "RemoteInitial" }, () => <></>)
          .with({ _tag: "RemotePending" }, () => <p>Loading...</p>)
          .with({ _tag: "RemoteFailure" }, ({ error }) => <p>{error}</p>)
          .with({ _tag: "RemoteSuccess" }, ({ value }) => (
            <>
              <button
                type="button"
                onClick={() => modalRef.current?.showModal()}
              >
                Add Media
              </button>
              <FilterBar media={media} />
              <MediaList
                mediaList={value}
                handleRemove={media.removeMediaItem}
              />

              <dialog ref={modalRef}>
                <CreateMediaItemForm
                  onSubmit={(newItem) => {
                    media.createMediaItem(newItem)
                    modalRef.current?.close()
                  }}
                />
              </dialog>
            </>
          ))
          .exhaustive()}
      </main>
    </>
  )
})

export const App = () => {
  return <MediaApplication media={mediaStore} />
}
