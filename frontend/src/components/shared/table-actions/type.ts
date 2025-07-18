type TActionList = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
}

export type TTableAction = {
  actions: TActionList[]
}
