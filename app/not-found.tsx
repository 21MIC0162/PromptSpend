import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TrendingDown, Chrome as Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
          <TrendingDown className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Audit Not Found
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The audit you're looking for doesn't exist or may have been removed.
        </p>
        <Button asChild className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
