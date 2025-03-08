// layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer'; // Ensure casing matches the actual file name
import ChatbotWrapper from '@/components/ChatbotWrapper';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Vijendra Singh Malik – Portfolio</title>
      </head>
      <body className="bg-gray-50">
        <Navbar />
        {/* Remove any default spacing on main */}
        <main className="m-0 p-0">
          {children}
        </main>
        <Footer />
        <ChatbotWrapper />
      </body>
    </html>
  );
}
