import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Scale, Activity } from 'lucide-react';
import { Z_VERSION_ERROR } from "node:zlib";

interface DailyMetricInputProps {
  metricType: 'bodyweight' | 'steps';
  title: string;
  unit: string;
  icon: typeof Scale;
  placeholder?: string;
  defaultDate?: string;
}

export function DailyMetricInput({
  metricType,
  title,
  unit,
  icon: Icon,
  placeholder,
  defaultDate
}: DailyMetricInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data, setData, post, processing, reset, errors } = useForm({
    date: defaultDate || new Date().toISOString().split('T')[0],
    metric_type: metricType,
    value: '',
    unit: unit,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('daily-metrics.store'), {
      preserveScroll: true,
      onSuccess: () => {
        reset('value', 'notes');
        setIsOpen(false);
      },
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="h-auto flex flex-col items-start p-4 w-full"
      >
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-4 w-4" />
          <span className="font-semibold">{title}</span>
        </div>
        <span className="text-xs text-muted-foreground">Click to log {title.toLowerCase()}</span>
      </Button>
    );
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <h4 className="font-semibold">{title}</h4>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${metricType}-date`}>Date</Label>
          <Input
            id={`${metricType}-date`}
            type="date"
            value={data.date}
            onChange={(e) => setData('date', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            required
          />
          {errors.date && (
            <p className="text-sm text-destructive">{errors.date}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${metricType}-value`}>
            {title} ({unit})
          </Label>
          <Input
            id={`${metricType}-value`}
            type="number"
            step={metricType === 'bodyweight' ? '0.1' : '1'}
            min="0"
            value={data.value}
            onChange={(e) => setData('value', e.target.value)}
            placeholder={placeholder}
            required
            autoFocus
          />
          {errors.value && (
            <p className="text-sm text-destructive">{errors.value}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${metricType}-notes`}>Notes (optional)</Label>
          <Input
            id={`${metricType}-notes`}
            type="text"
            value={data.notes}
            onChange={(e) => setData('notes', e.target.value)}
            placeholder="Any notes relevant to today's measurement..."
            maxLength={500}
          />
        </div>

        <Button type="submit" disabled={processing} className="w-full">
          {processing ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Card>
  );
} 
