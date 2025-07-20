import { useCallback, useEffect } from 'react'
import { useDropzone, type Accept } from 'react-dropzone'
import { Controller, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { UploadCloud, X } from 'lucide-react'

interface RHFImageUploadProps {
  name: string
  accept?: Accept
  maxSize?: number
  disabled?: boolean
  label?: string
  required?: boolean
}

export function ImageUpload({
  name,
  accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
  maxSize = 5,
  disabled = false,
  label,
  required = false,
}: RHFImageUploadProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => {
        const file = value as File | string | null

        const onDrop = useCallback(
          (acceptedFiles: File[]) => {
            const selectedFile = acceptedFiles[0]
            if (!selectedFile) return

            if (selectedFile.size > maxSize * 1024 * 1024) {
              alert(`File lebih dari ${maxSize}MB`)
              return
            }

            const acceptedExtensions = Object.values(accept).flat()
            const ext = `.${selectedFile.name.split('.').pop()?.toLowerCase()}`
            if (!acceptedExtensions.includes(ext)) {
              alert('Format tidak didukung')
              return
            }

            onChange(selectedFile)
          },
          [onChange],
        )

        const handleRemove = () => {
          onChange(null)
        }

        const { getRootProps, getInputProps, isDragActive, open } = useDropzone(
          {
            onDrop,
            multiple: false,
            maxSize: maxSize * 1024 * 1024,
            accept,
            disabled,
            noClick: true,
          },
        )

        const preview = file
          ? typeof file === 'string'
            ? file
            : URL.createObjectURL(file)
          : null
        useEffect(() => {
          return () => {
            if (typeof file !== 'string' && file) {
              URL.revokeObjectURL(preview!)
            }
          }
        }, [file])

        return (
          <div className="space-y-1">
            {label && (
              <label className="text-sm font-medium">
                {label}{' '}
                {required ? (
                  <span className="text-destructive ml-1">*</span>
                ) : (
                  '(Optional)'
                )}
              </label>
            )}
            <div
              {...getRootProps()}
              onClick={() => !disabled && open()}
              className={`relative w-full h-64 rounded-xl border-2 border-dashed overflow-hidden transition-all duration-300 cursor-pointer
                ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted bg-muted'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} className="hidden" />

              {/* PREVIEW */}
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="absolute inset-0 object-cover w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground z-0">
                  <UploadCloud className="w-10 h-10" />
                  <p className="text-sm text-center">
                    Seret gambar ke sini atau klik untuk mengunggah
                  </p>
                  <p className="text-xs">
                    Format: {Object.values(accept).flat().join(', ')} – max{' '}
                    {maxSize}MB
                  </p>
                </div>
              )}

              {/* REMOVE BUTTON */}
              {preview && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={handleRemove}
                  className="absolute top-3 right-3 z-20 bg-white/80 hover:bg-white/90"
                >
                  <X className="w-5 h-5 text-destructive" />
                </Button>
              )}
            </div>

            {/* ERROR */}
            {errors[name] && (
              <p className="text-sm text-destructive mt-1">
                {(errors[name] as any)?.message ||
                  'Terjadi kesalahan pada input gambar'}
              </p>
            )}
          </div>
        )
      }}
    />
  )
}
