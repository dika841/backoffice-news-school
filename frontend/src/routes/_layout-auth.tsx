import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout-auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="w-full min-h-dvh flex items-center justify-center">
      <div className="border rounded-xl flex w-1/2 overflow-hidden">
        <div className="bg-gradient-to-br from-primary to-primary-foreground w-1/2">
          <img
            src="/logo.webp"
            alt="logo smk muhamadiyah sumowono"
            loading="lazy"
            className="w-3/5 h-full mx-auto aspect-square object-contain"
          />
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <Outlet />
        </div>
      </div>
    </section>
  )
}
