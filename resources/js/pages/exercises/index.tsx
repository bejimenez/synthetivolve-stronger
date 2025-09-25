
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Exercise Database',
        href: '/exercises',
    },
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exercise Database" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="ml-auto">
                <Link className="bg-accent px-4 py-2 rounded-md cursor-pointer hover:opacity-90" as='button' href="/exercises/create">Add New Exercise</Link>
                </div>
                <div className='overflow-hidden border shadow-sm ring-1 ring-black/5'>
                <table className='w-full table-auto'>
                    
                    <thead>
                        <tr className='bg-accent/50'>
                            <th className="p-4 border">#</th>
                            <th className="p-4 border">Name</th>
                            <th className="p-4 border">Muscle Group</th>
                            <th className="p-4 border">Equipment</th>
                            <th className="p-4 border">Movement Type</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className='px-4 py-2 text-center border'>1</td>
                            <td className='px-4 py-2 border'>Competition Bench Press</td>
                            <td className='px-4 py-2 border'>Chest</td>
                            <td className='px-4 py-2 border'>Barbell</td>
                            <td className='px-4 py-2 border'>Compound</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </AppLayout>
    );
}
