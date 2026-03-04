import { LoadingSpinner } from '@/components/ui'

export default function GlobalLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#f2f2f2]">
      <LoadingSpinner size="md" color="primary" />
    </div>
  )
}
