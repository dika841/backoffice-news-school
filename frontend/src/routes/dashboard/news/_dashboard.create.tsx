import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/news/_dashboard/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/news/_dashboard/create"!</div>
}
