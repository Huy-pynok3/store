import { ReactNode } from 'react'

interface TableProps {
  children: ReactNode
  className?: string
}

interface TableHeaderProps {
  children: ReactNode
  className?: string
}

interface TableBodyProps {
  children: ReactNode
  className?: string
}

interface TableRowProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

interface TableHeadProps {
  children: ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

interface TableCellProps {
  children: ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm ${className}`}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={`bg-gray-50 border-b border-gray-200 ${className}`}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className = '' }: TableBodyProps) {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className = '', hover = true }: TableRowProps) {
  return (
    <tr className={`border-b border-gray-100 ${hover ? 'hover:bg-gray-50' : ''} ${className}`}>
      {children}
    </tr>
  )
}

export function TableHead({ children, className = '', align = 'left' }: TableHeadProps) {
  return (
    <th className={`py-3 px-3 font-medium text-gray-700 whitespace-nowrap ${alignClasses[align]} ${className}`}>
      {children}
    </th>
  )
}

export function TableCell({ children, className = '', align = 'left' }: TableCellProps) {
  return (
    <td className={`py-3 px-3 text-gray-700 ${alignClasses[align]} ${className}`}>
      {children}
    </td>
  )
}
