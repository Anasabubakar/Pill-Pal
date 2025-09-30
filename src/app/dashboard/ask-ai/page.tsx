import { PageHeader } from '@/components/page-header';
import { AIChat } from '@/components/ai-form';

export default function AskAiPage() {
  return (
    <>
      <PageHeader
        title="AI Adherence Tool"
        description="Ask questions about your medication history and get personalized insights."
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AIChat />
      </div>
    </>
  );
}
