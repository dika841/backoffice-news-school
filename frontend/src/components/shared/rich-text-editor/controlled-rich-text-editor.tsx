import { Controller, useFormContext } from 'react-hook-form'
import RichTextEditor from './rich-text-editor'

interface ControlledRichTextEditorProps {
  name: string
  label?: string
  required?: boolean
}

export const ControlledRichTextEditor = ({
  name,
  label,
  required,
}: ControlledRichTextEditorProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RichTextEditor content={field.value} onChange={field.onChange} />
        )}
      />
      {errors[name] && (
        <p className="text-sm text-destructive mt-1">
          {(errors[name] as any)?.message ||
            'Terjadi kesalahan pada input konten'}
        </p>
      )}
    </div>
  )
}
