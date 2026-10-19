"use client";

import React from "react";
import { ChatModule } from "@/components/chat/ChatModule";

interface ChatConversationPageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default function ChatConversationPage({ params }: ChatConversationPageProps) {
  const unwrappedParams = React.use(params);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
      <ChatModule initialConversationId={unwrappedParams.conversationId} />
    </div>
  );
}
