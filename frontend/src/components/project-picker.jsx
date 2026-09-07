import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useProjects } from '@/hooks/use-projects'

export const ANY_PROJECT = 'any'

function placeholderFor({ isLoading, error, projects }) {
  if (isLoading) return 'Loading projects…'
  if (error) return 'Could not load projects'
  if (projects.length === 0) return 'No projects yet — ask your manager'
  return 'Choose a project'
}

export function ProjectPicker({ value, onChange, disabled, allLabel, ...props }) {
  const { projects, isLoading, error } = useProjects()

  const isEmpty = isLoading || Boolean(error) || projects.length === 0
  const isUnavailable = allLabel ? isLoading || Boolean(error) : isEmpty

  return (
    <Select value={value ?? ''} onValueChange={onChange} disabled={disabled || isUnavailable}>
      <SelectTrigger className="w-full" {...props}>
        <SelectValue placeholder={placeholderFor({ isLoading, error, projects })} />
      </SelectTrigger>

      <SelectContent>
        {allLabel ? <SelectItem value={ANY_PROJECT}>{allLabel}</SelectItem> : null}

        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
