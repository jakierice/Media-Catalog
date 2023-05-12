export const mockPromise: <T>(
  result: { tag: "error"; message: string } | { tag: "success"; data: T },
  delay?: number,
  syncFn?: () => void
) => Promise<T> = (result, delay, syncFn) =>
  new Promise((resolve, reject) => {
    syncFn?.()

    setTimeout(
      () =>
        result.tag === "success"
          ? resolve(result.data)
          : reject(result.message),
      delay ?? 800
    )
  })
