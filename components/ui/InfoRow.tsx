import { ReactNode } from 'react'

interface InfoRowProps {
  label: string
  value: ReactNode
  className?: string
}

export default function InfoRow({ label, value, className = '' }: InfoRowProps) {
  return (
    <tr className={`border-b border-[#efefef] ${className}`}>
      <td className="w-[220px] py-3 pr-4 font-semibold text-[#3f3f3f]">{label}</td>
      <td className="py-3 text-[#666]">{value}</td>
    </tr>
  )
}
