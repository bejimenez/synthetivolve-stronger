import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MetricDataPoint {
    date: string;
    value: number;
    rolling_avg: number;
}

interface MetricChartProps {
    title: string;
    data: MetricDataPoint[];
    unit: string;
    valueLabel?: string;
    avgLabel?: string;
    color?: string;
}

export function MetricChart({
    title,
    data,
    unit,
    valueLabel = 'Value',
    avgLabel = '7-Day Average',
    color = 'hsl(var(--chart-1))'
}: MetricChartProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="flex h-full flex-col p-6">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <div className="flex flex-1 items-center justify-center text-muted-foreground">
                    No data available.
                </div>
            </Card>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const latestData = data[data.length -1];
    const latestValue = latestData?.value;
    const latestAvg = latestData?.rolling_avg;

    return (
        <Card className="flex h-full flex-col p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <div className="mt-2 flex items-baseline gap-4">
                    <div>
                        <div className="text-2xl font-bold">{latestValue?.toFixed(1)} {unit}</div>
                        <div className="text-xs text-muted-foreground">Latest</div>
                    </div>
                    <div>
                        <div className="text-xl font-semibold text-muted-foreground">{latestAvg?.toFixed(1)} {unit}</div>
                        <div className="text-xs text-muted-foreground">7-Day Avg</div>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value: number) => [`${value.toFixed(1)} ${unit}`]}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '2px',
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        dot={{ fill: color, r: 2 }}
                        name={valueLabel}
                        connectNulls
                    />
                    <Line
                        type="monotone"
                        dataKey="rolling_avg"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name={avgLabel}
                        connectNulls
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    )
}