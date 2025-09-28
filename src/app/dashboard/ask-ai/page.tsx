import { PageHeader } from '@/components/page-header';
import { AIForm } from '@/components/ai-form';

export default function AskAiPage() {
  return (
    <>
      <PageHeader
        title="AI Adherence Tool"
        description="Ask questions about your medication history and get personalized insights."
      />
      <div className="flex-1 overflow-auto p-6 bg-background/50">
        <AIForm />
      </div>
    </>
  );
}
