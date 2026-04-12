import { AlertDialog, AlertDialogTitle, AlertDialogHeader, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../ui/alert-dialog'
import { buttonVariants } from '../ui/button'

interface CommonConfirmDialogueProps {
  open: boolean
  setOpen: (open: boolean) => void
  title: string
  description: string
  variant: 'destructive' | 'default'
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}
export default function CommonConfirmDialogue({
  open,
  setOpen,
  title,
  description,
  variant,
  onConfirm,
  onCancel,
  isLoading,
}: CommonConfirmDialogueProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel type="button" onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            className={
              variant === 'destructive' ? buttonVariants({ variant: 'destructive' }) : undefined
            }
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog >
  )
}