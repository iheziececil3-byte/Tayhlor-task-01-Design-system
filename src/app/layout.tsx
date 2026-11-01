import type { Metadata } from 'next';
import { Lora, Manrope } from 'next/font/google';
import '../styles/globals.css';

const lora = Lora({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-family-display',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-family-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tayhlor | D Williams Fashion Hub',
  description: 'Bespoke tailoring management, precision measurements, and order progress tracking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-surface text-on-surface antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}

