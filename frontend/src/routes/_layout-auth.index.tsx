import { InputText } from '@/components/shared/input-text/Input-text'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { loginSchema, type TLogin } from '@/lib/schema/login.schema'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useLoginMutation } from '@/hooks/mutation/use-login-mutation/use-login-mutation'
import { useAuth } from '@/context/use-auth'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_layout-auth/')({
  component: App,
})

function App() {
  const form = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
    mode: 'all',
    defaultValues: {
      username: '',
      password: '',
    },
  })
  const { accessToken } = useAuth()
  const navigate = useNavigate()
  const loginMutate = useLoginMutation()

  const onSubmit = (data: TLogin) => {
    loginMutate.mutate(data, {
      onSuccess: () => {
        toast.success('Login Berhasil', {
          position: 'top-right',
          richColors: true,
          description: 'Selamat datang di dashboard',
        })
      },
      onError: () => {
        toast.error('Login Gagal', {
          position: 'top-right',
          richColors: true,
          description: 'Username atau password salah',
        })
      },
    })
  }

  useEffect(() => {
    if (accessToken) {
      navigate({ to: '/dashboard' })
    }
  }, [accessToken])
  return (
    <Card className="w-full max-w-sm rounded-none">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your Username below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6 mb-2">
              <div className="grid gap-2">
                <InputText
                  name="username"
                  type="text"
                  label="Username"
                  placeholder="Username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <InputText
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="********"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              isLoading={loginMutate.isPending}
            >
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
