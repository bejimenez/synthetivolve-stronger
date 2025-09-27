
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Exercise',
        href: '/exercises/create',
    },
];

export default function ExerciseForm() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Exercise" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Exercise Name</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className='flex flex-col gap-4 autoComplete=off'>
                            <div className='grid gap-6'>
                                <div className='grid gap-2'>
                                    <Label htmlFor='name'>Exercise Name</Label>

                                    <Input
                                        id='name'
                                        name='name'
                                        type='text'
                                        placeholder='Bench Press'
                                        autoFocus
                                        tabIndex={1}
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
