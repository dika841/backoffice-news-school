export type TPopUpDelete = {
  show: boolean
  setShow: (show: boolean) => void
  isLoading?: boolean
  onCancel?: () => void
  onConfirm?: () => void
}
