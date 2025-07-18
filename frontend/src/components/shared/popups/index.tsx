import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { TPopUpDelete } from './type'
import type { FC, ReactElement } from 'react'
import { Button } from '@/components/ui/button'

export const PopUpDelete: FC<TPopUpDelete> = (props): ReactElement => {
  return (
    <Dialog open={props.show} onOpenChange={props.setShow}>
      <DialogContent className="md:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Apakah anda yakin?</DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-primary-500">
          Tindakan ini akan menghapus secara permanen dan tidak dapat
          dikembalikan
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={props.onCancel}>
            Batal
          </Button>
          <Button
            variant="destructive"
            isLoading={props.isLoading}
            onClick={props.onConfirm}
          >
            Lanjutkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
