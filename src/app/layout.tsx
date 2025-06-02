// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpaceBackground3DWrapper from '@/components/SpaceBackgroun3DWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NASA Data Hub',
  description: 'Explore the universe with NASA data!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen relative`}>
        {/* Fixed 3D Background */}
        <div className="fixed inset-0 z-0">
          <SpaceBackground3DWrapper />
        </div>

        {/* Foreground content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto p-4 md:p-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}