import { useLanguage } from '@/contexts/LanguageContext';
import type { OnboardingStatus } from '@/types/onboarding';

interface StatusBadgeProps {
  status: OnboardingStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useLanguage();

  const statusConfig: Record<OnboardingStatus, { class: string; labelKey: string }> = {
    draft: { class: 'badge-info', labelKey: 'admin.status.draft' },
    submitted: { class: 'badge-warning', labelKey: 'admin.status.submitted' },
    'needs-info': { class: 'badge-warning', labelKey: 'admin.status.needsInfo' },
    approved: { class: 'badge-success', labelKey: 'admin.status.approved' },
    rejected: { class: 'badge-error', labelKey: 'admin.status.rejected' },
  };

  const config = statusConfig[status];

  return (
    <span className={config.class}>
      {t(config.labelKey)}
    </span>
  );
};

export default StatusBadge;
