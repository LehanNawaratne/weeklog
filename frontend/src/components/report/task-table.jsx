import { Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

export const TASK_STATUSES = [
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'blocked', label: 'Blocked' }
]

export const emptyTask = {
  taskName: '',
  priority: 'medium',
  plannedPct: '100',
  actualPct: '0',
  status: 'in_progress',
  timePlanned: '0',
  timeSpent: '0',
  output: ''
}

function NumberCell({ value, onChange, label, max }) {
  return (
    <Input
      type="number"
      min="0"
      max={max}
      step={max === 100 ? '5' : '0.5'}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={label}
      className="w-20"
    />
  )
}

export function TaskTable({ value, onChange }) {
  function updateAt(index, field, fieldValue) {
    onChange(
      value.map((task, position) =>
        position === index ? { ...task, [field]: fieldValue } : task
      )
    )
  }

  function removeAt(index) {
    onChange(value.filter((unused, position) => position !== index))
  }

  return (
    <div className="flex flex-col gap-3">
      {value.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No tasks yet. Add at least one before sending this report for review.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-4xl">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-48">Task</TableHead>
                <TableHead className="w-32">Priority</TableHead>
                <TableHead className="w-24">Planned %</TableHead>
                <TableHead className="w-24">Actual %</TableHead>
                <TableHead className="w-36">Status</TableHead>
                <TableHead className="w-24">Hrs planned</TableHead>
                <TableHead className="w-24">Hrs spent</TableHead>
                <TableHead className="min-w-40">Output</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {value.map((task, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={task.taskName}
                      placeholder="Checkout redesign"
                      onChange={(event) => updateAt(index, 'taskName', event.target.value)}
                      aria-label={`Task ${index + 1} name`}
                      required
                    />
                  </TableCell>

                  <TableCell>
                    <Select
                      value={task.priority}
                      onValueChange={(next) => updateAt(index, 'priority', next)}
                    >
                      <SelectTrigger aria-label={`Task ${index + 1} priority`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <NumberCell
                      value={task.plannedPct}
                      max={100}
                      label={`Task ${index + 1} planned percent`}
                      onChange={(next) => updateAt(index, 'plannedPct', next)}
                    />
                  </TableCell>

                  <TableCell>
                    <NumberCell
                      value={task.actualPct}
                      max={100}
                      label={`Task ${index + 1} actual percent`}
                      onChange={(next) => updateAt(index, 'actualPct', next)}
                    />
                  </TableCell>

                  <TableCell>
                    <Select
                      value={task.status}
                      onValueChange={(next) => updateAt(index, 'status', next)}
                    >
                      <SelectTrigger aria-label={`Task ${index + 1} status`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_STATUSES.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <NumberCell
                      value={task.timePlanned}
                      label={`Task ${index + 1} hours planned`}
                      onChange={(next) => updateAt(index, 'timePlanned', next)}
                    />
                  </TableCell>

                  <TableCell>
                    <NumberCell
                      value={task.timeSpent}
                      label={`Task ${index + 1} hours spent`}
                      onChange={(next) => updateAt(index, 'timeSpent', next)}
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                      value={task.output}
                      placeholder="PR #211 merged"
                      onChange={(event) => updateAt(index, 'output', event.target.value)}
                      aria-label={`Task ${index + 1} output`}
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAt(index)}
                      aria-label={`Remove task ${index + 1}`}
                    >
                      <X className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...value, { ...emptyTask }])}
        >
          <Plus className="size-4" />
          Add task
        </Button>
      </div>
    </div>
  )
}
