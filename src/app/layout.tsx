import React from 'react';
import { SITE_CONFIG } from '@/config';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components';
import QueryClientWrapper from '@/components/providers/QueryClientWrapper';
import { Toaster } from '@/components/ui/sonner';
import ModalProvider from '@/components/providers/ModalProvider';

const font = Inter({ subsets: ['latin'] });

export const metadata = SITE_CONFIG;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background text-foreground antialiased max-w-full overflow-x-hidden',
          font.className,
        )}
      >
        <ThemeProvider>
          <QueryClientWrapper>
            <ClerkProvider appearance={{ baseTheme: dark }}>
              <ModalProvider>
                <Toaster />
                {children}
              </ModalProvider>
            </ClerkProvider>
          </QueryClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
