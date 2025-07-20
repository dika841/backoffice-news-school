import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Form, FormField, FormItem, FormControl } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Api } from '@/lib/axios/axios'

const schema = z.object({
  value: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  id: string
  endpoint: string // contoh: '/news'
  fieldName: string // contoh: 'is_published'
  defaultValue: boolean
  queryKey: string // contoh: 'news', 'announcements'
}

export function SwitchFormField({
  id,
  endpoint,
  fieldName,
  defaultValue,
  queryKey,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      value: defaultValue,
    },
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (value: 1 | 0) =>
      Api.patch(`${endpoint}/${id}`, {
        [fieldName]: value,
      }),
    onSuccess: (_, value) => {
      queryClient.setQueryData([queryKey], (old: any) => {
        if (!old) return old
        return old.map((item: any) =>
          item.id === id ? { ...item, [fieldName]: value } : item,
        )
      })
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      })
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      })
    },
  })

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                    mutation.mutate(checked ? 1 : 0)
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
