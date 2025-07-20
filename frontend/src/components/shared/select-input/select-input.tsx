import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormContext } from 'react-hook-form'

interface TSelectInputProps {
  name: string
  placeholder?: string
  disabled?: boolean
  description?: string
  label?: string
  required?: boolean
  options: { label: string; value: string }[]
  className?: string
}
export const SelectInput = (props: TSelectInputProps) => {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {props.label}
            {props.required && (
              <span className="text-destructive -ml-1">*</span>
            )}
          </FormLabel>
          <Select
            key={field.value}
            onValueChange={field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {props.options.map((option, index) => (
                <SelectItem key={index} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription className="text-xs">
            {props.description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
