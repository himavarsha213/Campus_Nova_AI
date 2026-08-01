import './globals.css';
import type { Metadata } from 'next';
import AmbientBackground from '@/components/ui/AmbientBackground';
import { AuthProvider } from '@/lib/auth/AuthContext';

export const metadata: Metadata = {
  title: 'CampusNova AI - AI-Powered College Knowledge Assistant',
  description: 'Grounded AI College Knowledge Platform powered by Retrieval-Augmented Generation (RAG). Instant, verified responses from official college documents with source citations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-[var(--bg-color)] text-[var(--text-color)] font-sans antialiased min-h-screen">
        <AuthProvider>
          <AmbientBackground />
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

