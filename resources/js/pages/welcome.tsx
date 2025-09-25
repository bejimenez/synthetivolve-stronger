// welcome.tsx
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to Synthetivolve:Stronger">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
            </Head>
            <div className="bg-slate-900">
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                        <div className="flex lg:flex-1">
                            <a href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">Synthetivolve:Stronger</span>
                                {/* Logo/Icon */}
                                <div className="flex items-center space-x-2">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                        <svg className="h-5 w-5 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <span className="text-slate-100 font-semibold text-lg hidden sm:block">Synthetivolve<span className="text-orange-400">:</span>Stronger</span>
                                </div>
                            </a>
                        </div>
                        <div className="flex lg:hidden">
                            <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-300">
                                <span className="sr-only">Open main menu</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="size-6">
                                    <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="hidden lg:flex lg:gap-x-12">
                            <a href="#" className="text-sm/6 font-semibold text-slate-300 hover:text-orange-400 transition-colors">Features</a>
                            <a href="#" className="text-sm/6 font-semibold text-slate-300 hover:text-orange-400 transition-colors">Training</a>
                            <a href="#" className="text-sm/6 font-semibold text-slate-300 hover:text-orange-400 transition-colors">Progress</a>
                            <a href="#" className="text-sm/6 font-semibold text-slate-300 hover:text-orange-400 transition-colors">Community</a>
                        </div>
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="text-sm/6 font-semibold text-slate-100 bg-orange-500 hover:bg-orange-400 px-4 py-2 rounded-md transition-colors"
                                >
                                    Dashboard <span aria-hidden="true">→</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm/6 font-semibold text-slate-300 hover:text-orange-400 transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="text-sm/6 font-semibold text-slate-100 bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-md transition-colors"
                                    >
                                        Get Started <span aria-hidden="true">→</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                    {/* Mobile menu placeholder - you can implement the full mobile menu dialog if needed */}
                </header>

                <div className="relative isolate px-6 pt-14 lg:px-8">
                    {/* Background gradient effects */}
                    <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                        <div style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}} className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-teal-600 to-orange-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                    </div>
                    
                    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                            <div className="relative rounded-full px-3 py-1 text-sm/6 text-slate-400 ring-1 ring-slate-700 hover:ring-slate-600 transition-all">
                                AI-Powered Strength Training <a href="#" className="font-semibold text-orange-400 hover:text-orange-300"><span aria-hidden="true" className="absolute inset-0"></span> Learn more <span aria-hidden="true">→</span></a>
                            </div>
                        </div>
                        <div className="text-center">
                            <h1 className="text-5xl font-bold tracking-tight text-balance text-slate-100 sm:text-7xl">
                                Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400">Strength</span> Journey
                            </h1>
                            <p className="mt-8 text-lg font-medium text-pretty text-slate-400 sm:text-xl/8">
                                Your personalized intelligent health & wellness engine. Harness the power of AI to optimize your strength training, track progress, and achieve your fitness goals with scientific precision.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-md bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:from-orange-400 hover:to-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-all"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={register()}
                                            className="rounded-md bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:from-orange-400 hover:to-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-all"
                                        >
                                            Start Training Free
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="text-sm/6 font-semibold text-slate-300 hover:text-orange-400 transition-colors"
                                        >
                                            Sign in <span aria-hidden="true">→</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        {/* Feature highlights */}
                        <div className="mt-32 grid grid-cols-1 gap-8 sm:grid-cols-3">
                            <div className="text-center">
                                <div className="mx-auto h-12 w-12 rounded-full bg-teal-600/20 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="mt-4 text-sm font-semibold text-slate-200">Personalized Programs</h3>
                                <p className="mt-2 text-sm text-slate-400">AI-driven workout plans tailored to your goals and progress</p>
                            </div>
                            <div className="text-center">
                                <div className="mx-auto h-12 w-12 rounded-full bg-orange-600/20 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h3 className="mt-4 text-sm font-semibold text-slate-200">Track Progress</h3>
                                <p className="mt-2 text-sm text-slate-400">Real-time analytics and insights on your strength gains</p>
                            </div>
                            <div className="text-center">
                                <div className="mx-auto h-12 w-12 rounded-full bg-slate-600/20 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="mt-4 text-sm font-semibold text-slate-200">Science-Based</h3>
                                <p className="mt-2 text-sm text-slate-400">Evidence-backed training methodologies for optimal results</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bottom gradient */}
                    <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                        <div style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}} className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-teal-700 to-slate-800 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
                    </div>
                </div>
            </div>
        </>
    );
}