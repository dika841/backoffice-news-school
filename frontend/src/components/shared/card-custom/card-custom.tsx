import { Edit, Trash2, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface NewsCardProps {
  id: string
  title: string
  description: string
  author: string
  publishedDate: string
  category: string
  imageUrl?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function CardCustom({
  id = '1',
  title = 'Breaking: New Technology Revolutionizes Industry',
  description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
  author = 'John Doe',
  publishedDate = '2024-01-15',
  category = 'Technology',
  imageUrl = '/placeholder.svg?height=200&width=400',
  onEdit = (id) => console.log(`Edit news item: ${id}`),
  onDelete = (id) => console.log(`Delete news item: ${id}`),
}: NewsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary" className="mb-2">
            {category}
          </Badge>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(id)}
              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            >
              <Edit className="h-4 w-4 text-green-500" />
              <span className="sr-only">Edit news item</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(id)}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 text-red-400" />
              <span className="sr-only">Delete news item</span>
            </Button>
          </div>
        </div>
        <CardTitle className="text-lg leading-tight line-clamp-2">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-3">
        {imageUrl && (
          <div className="mb-4 overflow-hidden rounded-md">
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={title}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </CardDescription>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(publishedDate)}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
