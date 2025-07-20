export type TCategoryResponse = {
  id: string
  name: string
  slug: string
  description: string
}

export type TCategoryResponseOne = {
  data: TCategory
}
export type TCategory = {
  id?: string
  name: string
  slug: string
  description: string
}

export type TCategoryRequest = {
  name: string
  description?: string
}
export type TCategoryRequestUpdate = {
  name?: string
  description?: string
}
