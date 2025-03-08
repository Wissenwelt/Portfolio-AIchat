"use client";
import dynamic from 'next/dynamic';

// Dynamically import ChatbotWidget on the client only
const ChatbotWidget = dynamic(() => import('@/components/ChatbotWidget'), { ssr: false });

export default function ChatbotWrapper() {
  return (
    <div suppressHydrationWarning>
      <ChatbotWidget />
    </div>
  );
}
