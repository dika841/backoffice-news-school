import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout-auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="w-full min-h-screen flex">
      <div className="w-1/2 bg-cover min-h-dvh bg-gradient-to-bl from-primary to-secondary"></div>
      <div className="w-1/2 flex items-center justify-center">
        <Outlet />
      </div>
    </section>
  )
}
