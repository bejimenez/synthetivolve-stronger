import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { MetricChart } from '@/components/metric-chart';
import { DailyMetricInput } from '@/components/daily-metric-input';
import { Scale, Activity } from 'lucide-react';
import axios from 'axios';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface MetricData {
    date: string;
    value: number;
    rolling_avg: number;
}

interface MetricInfo {
    data: MetricData[];
    latest: {
        id: number;
        date: string;
        metric_type: string;
        value: number;
        unit: string;
        notes: string | null;
    } | null;
}

interface DashboardMetrics {
    bodyweight: MetricInfo;
    steps: MetricInfo;
}

export default function Dashboard() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const response = await axios.get(route('daily-metrics.dashboard'));
            setMetrics(response.data);
        } catch (error) {
            console.error('Failed to fetch metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchMetrics();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <DailyMetricInput
                        metricType="bodyweight"
                        title="Body Weight"
                        unit="lbs"
                        icon={Scale}
                        placeholder="Enter your weight"
                    />
                    <DailyMetricInput
                        metricType="steps"
                        title="Daily Steps"
                        unit="steps"
                        icon={Activity}
                        placeholder="Enter yesterday's step count"
                        defaultDate={
                            new Date(Date.now() - 86400000).toISOString().split('T')[0]
                        }
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {loading ? (
                        <>
                            <div className="relative aspect-video overflow-hidden border border-sidebar-border/70 dark:border-sidebar-border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                            <div className="relative aspect-video overflow-hidden border border-sidebar-border/70 dark:border-sidebar-border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                        </>
                    ) : (
                        <>
                            <MetricChart
                                title="Body Weight Trend"
                                data={metrics?.bodyweight.data || []}
                                unit="lbs"
                                valueLabel="Weight"
                                avgLabel="7-Day Average"
                                color="hsl(var(--chart-1))"
                            />
                            <MetricChart
                                title="Daily Steps Trend"
                                data={metrics?.steps.data || []}
                                unit="steps"
                                valueLabel="Steps"
                                avgLabel="7-Day Average"
                                color="hsl(var(--chart-2))"
                            />
                        </>
                    )}
                </div>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
