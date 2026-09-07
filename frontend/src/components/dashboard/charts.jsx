import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis
} from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { useChart } from '@/hooks/use-chart'
import { formatWeekRange } from '@/lib/week'

const SERIES_COLOURS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

function ChartCard({ title, description, isLoading, error, isEmpty, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        {!error && isLoading ? <Skeleton className="h-56 w-full" /> : null}
        {!error && !isLoading && isEmpty ? (
          <div className="border-border text-muted-foreground flex h-56 items-center justify-center rounded-xl border-2 border-dashed text-sm">
            Not enough data yet
          </div>
        ) : null}
        {!error && !isLoading && !isEmpty ? children : null}
      </CardContent>
    </Card>
  )
}

export function TasksTrendChart() {
  const { data, isLoading, error } = useChart('tasksTrend')
  const rows = (data?.labels ?? []).map((label, index) => ({
    label,
    value: data.values[index]
  }))

  return (
    <ChartCard
      title="Tasks completed"
      description="Across the team, week by week."
      isLoading={isLoading}
      error={error}
      isEmpty={rows.length === 0}
    >
      <ChartContainer
        config={{ value: { label: 'Tasks completed', color: 'var(--chart-1)' } }}
        className="h-56 w-full"
      >
        <LineChart data={rows} margin={{ left: 4, right: 12, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => formatWeekRange(value).split(' – ')[0]}
          />
          <YAxis tickLine={false} axisLine={false} width={28} allowDecimals={false} />
          <ChartTooltip
            content={
              <ChartTooltipContent labelFormatter={(value) => `Week of ${formatWeekRange(value)}`} />
            }
          />
          <Line
            dataKey="value"
            type="monotone"
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  )
}

export function StatusByMemberChart() {
  const { data, isLoading, error } = useChart('statusByMember')

  const rows = (data?.labels ?? []).map((label, index) => {
    const row = { label }
    for (const entry of data.series) {
      row[entry.name] = entry.values[index]
    }
    return row
  })

  const config = {
    submitted: { label: 'Submitted', color: 'var(--status-submitted)' },
    needs_correction: { label: 'Needs correction', color: 'var(--status-correction)' },
    approved: { label: 'Approved', color: 'var(--status-approved)' }
  }

  return (
    <ChartCard
      title="Report status by member"
      description="How each person's reports have been reviewed."
      isLoading={isLoading}
      error={error}
      isEmpty={rows.length === 0}
    >
      <ChartContainer config={config} className="h-56 w-full">
        <BarChart data={rows} margin={{ left: 4, right: 12, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.split(' ')[0]}
          />
          <YAxis tickLine={false} axisLine={false} width={28} allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="approved" stackId="a" fill="var(--color-approved)" radius={[0, 0, 4, 4]} />
          <Bar dataKey="needs_correction" stackId="a" fill="var(--color-needs_correction)" />
          <Bar dataKey="submitted" stackId="a" fill="var(--color-submitted)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

export function WorkloadByProjectChart() {
  const { data, isLoading, error } = useChart('workloadByProject')
  const rows = (data?.labels ?? []).map((label, index) => ({
    label,
    value: data.values[index]
  }))

  return (
    <ChartCard
      title="Workload by project"
      description="Hours spent on completed tasks."
      isLoading={isLoading}
      error={error}
      isEmpty={rows.length === 0}
    >
      <ChartContainer
        config={{ value: { label: 'Hours', color: 'var(--chart-1)' } }}
        className="h-56 w-full"
      >
        <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis type="number" tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            tickLine={false}
            axisLine={false}
            width={110}
            tickMargin={4}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

export function TimeByTaskTypeChart() {
  const { data, isLoading, error } = useChart('timeByTaskType')
  const rows = (data?.labels ?? []).map((label, index) => ({
    label,
    value: data.values[index]
  }))

  const total = rows.reduce((sum, row) => sum + row.value, 0)

  const config = Object.fromEntries(
    rows.map((row, index) => [row.label, { label: row.label, color: SERIES_COLOURS[index] }])
  )

  return (
    <ChartCard
      title="Time by task type"
      description={`${total} hours logged across the team.`}
      isLoading={isLoading}
      error={error}
      isEmpty={total === 0}
    >
      <ChartContainer config={config} className="h-56 w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
          <Pie data={rows} dataKey="value" nameKey="label" innerRadius={48} outerRadius={78}>
            {rows.map((row, index) => (
              <Cell key={row.label} fill={SERIES_COLOURS[index]} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="label" />} />
        </PieChart>
      </ChartContainer>
    </ChartCard>
  )
}
