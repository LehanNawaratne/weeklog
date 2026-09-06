import { Plus, Star, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function FlaggedList({
  value,
  onChange,
  flagField,
  flagLabel,
  placeholder,
  addLabel,
  emptyLabel
}) {
  function updateAt(index, text) {
    onChange(value.map((item, position) => (position === index ? { ...item, text } : item)))
  }

  function toggleFlagAt(index) {
    onChange(
      value.map((item, position) => ({
        ...item,
        [flagField]: position === index ? !item[flagField] : false
      }))
    )
  }

  function removeAt(index) {
    onChange(value.filter((unused, position) => position !== index))
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length === 0 ? (
        <p className="text-muted-foreground text-sm">{emptyLabel}</p>
      ) : null}

      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={item.text}
            placeholder={placeholder}
            onChange={(event) => updateAt(index, event.target.value)}
            aria-label={`${addLabel} ${index + 1}`}
          />

          <Button
            type="button"
            variant={item[flagField] ? 'default' : 'outline'}
            size="sm"
            aria-pressed={Boolean(item[flagField])}
            onClick={() => toggleFlagAt(index)}
            className="shrink-0"
          >
            <Star className={item[flagField] ? 'size-4 fill-current' : 'size-4'} />
            <span className="hidden sm:inline">{flagLabel}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeAt(index)}
            aria-label={`Remove item ${index + 1}`}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}

      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...value, { text: '', [flagField]: false }])}
        >
          <Plus className="size-4" />
          {addLabel}
        </Button>
      </div>
    </div>
  )
}
