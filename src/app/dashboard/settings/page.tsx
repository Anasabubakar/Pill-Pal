import { PageHeader } from '@/components/page-header';
import { SettingsForm } from '@/components/settings-form';

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences."
      />
      <div className="flex-1 overflow-auto p-6 bg-background/50">
        <SettingsForm />
      </div>
    </>
  );
}
