import { z } from "zod"

export const contentTypeSchema = z.union([
  z.literal("movie"),
  z.literal("tv-show"),
  z.literal("game"),
])
export type ContentType = z.infer<typeof contentTypeSchema>

export const contentRatingSchema = z.number().gte(0).lte(10)
export type ContentRating = z.infer<typeof contentRatingSchema>

export const mediaContentItemDetailsSchema = z.object({
  title: z.string().min(1),
  type: contentTypeSchema,
  genre: z.string().min(1),
  releaseYear: z.number().gte(1930).lte(new Date().getFullYear()),
  rating: contentRatingSchema,
})

export type MediaContentItemDetails = z.infer<
  typeof mediaContentItemDetailsSchema
>

export const mediaContentItemSchema = mediaContentItemDetailsSchema.extend({
  id: z.number(),
})
export type MediaContentItem = z.infer<typeof mediaContentItemSchema>
