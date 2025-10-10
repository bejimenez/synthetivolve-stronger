export interface DailyMetric {
    id: number;
    date: string;
    metric_type: 'bodyweight' | 'steps';
    value: number;
    unit: string;
    notes: string | null;
    created_at: string;
}

export interface MetricDataPoint {
    date: string;
    value: number;
    rolling_avg: number;
}

export interface MetricInfo {
    data: MetricDataPoint[];
    latest: DailyMetric | null;
}

export interface DashboardMetrics {
    bodyweight: MetricInfo;
    steps: MetricInfo;
}