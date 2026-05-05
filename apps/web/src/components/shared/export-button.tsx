'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ExportButtonProps {
  filename: string
  data: Record<string, string | number>[]
  label?: string
}

function toCsv(data: Record<string, string | number>[]): string {
  if (!data.length) return ''
  const headers = Object.keys(data[0])
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = row[h]?.toString() ?? ''
      return val.includes(',') ? `"${val}"` : val
    }).join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

export function ExportButton({ filename, data, label = 'Export CSV' }: ExportButtonProps) {
  const handleExport = () => {
    const csv = toCsv(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="h-4 w-4" />
      {label}
    </Button>
  )
}
