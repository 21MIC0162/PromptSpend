import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'PromptSpend - AI Spend Audit Platform',
  description:
    'Analyze your AI tooling costs and unlock savings. Get a free audit of your ChatGPT, Claude, Cursor, and other AI subscriptions in 2 minutes.',
  openGraph: {
    title: 'PromptSpend - AI Spend Audit Platform',
    description:
      'Analyze your AI tooling costs and unlock savings. Get a free audit of your ChatGPT, Claude, Cursor, and other AI subscriptions in 2 minutes.',
    siteName: 'PromptSpend',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptSpend - AI Spend Audit Platform',
    description:
      'Analyze your AI tooling costs and unlock savings. Get a free audit of your ChatGPT, Claude, Cursor, and other AI subscriptions in 2 minutes.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
