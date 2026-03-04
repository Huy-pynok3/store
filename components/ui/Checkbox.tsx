import { InputHTMLAttributes, forwardRef } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', ...props }, ref) => {
    return (
      <label className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
        <input
          ref={ref}
          type="checkbox"
          className={`w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-0.5 ${className}`}
          {...props}
        />
        {(label || description) && (
          <div className="flex-1">
            {label && <span className="text-sm text-gray-700">{label}</span>}
            {description && <span className="text-xs text-gray-500 block">{description}</span>}
          </div>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
