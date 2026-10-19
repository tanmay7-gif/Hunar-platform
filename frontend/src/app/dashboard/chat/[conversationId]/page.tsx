import { Suspense } from "react";
import { ChatModule } from "@/components/chat/ChatModule";

interface ChatConversationPageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

async function ConversationWrapper({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params;
  return <ChatModule initialConversationId={conversationId} />;
}

export default function ChatConversationPage({ params }: ChatConversationPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
      <Suspense fallback={<div className="p-8 text-center text-stone-500">Loading conversation...</div>}>
        <ConversationWrapper params={params} />
      </Suspense>
    </div>
  );
}

