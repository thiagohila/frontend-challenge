import { toast } from 'sonner'
import { t } from '@/i18n'

// Out-of-scope actions stay visible (Figma) but never fake success (ARCHITECTURE §11).
export const comingSoonProps = {
  'aria-disabled': true,
  title: t.comingSoon,
  onClick: (event: { preventDefault: () => void }) => {
    event.preventDefault()
    toast.info(t.comingSoonToast)
  },
} as const
