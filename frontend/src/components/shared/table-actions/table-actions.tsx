import { Ellipsis } from 'lucide-react'
import type { TTableAction } from './type'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { FC } from 'react'
import { cn } from '@/lib/utils'

export const TableActions: FC<TTableAction> = (props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Ellipsis size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 mr-20">
        {props.actions?.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={action.onClick}
            className={cn('font-inter flex w-[240px] items-center gap-3', {
              'mt-2': index !== 0,
            })}
          >
            <action.icon className="stroke-black" /> {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
