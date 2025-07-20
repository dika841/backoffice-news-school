import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import type { FC } from 'react'
import { useFormContext } from 'react-hook-form'

interface TextAreaInputProps {
  description?: string
  placeholder?: string
  label?: string
  name: string
}

export const TextAreaInput: FC<TextAreaInputProps> = (props) => {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Textarea placeholder={props.placeholder} {...field} />
          </FormControl>
          <FormDescription>{props.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
