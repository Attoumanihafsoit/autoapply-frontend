import { Shield, Lock, FileText, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SecurityBadges = () => {
  const { t } = useLanguage();

  const badges = [
    { icon: Lock, key: 'security.encrypted' },
    { icon: Shield, key: 'security.piiRestricted' },
    { icon: FileText, key: 'security.auditLog' },
    { icon: Users, key: 'security.rbac' },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {badges.map(({ icon: Icon, key }) => (
        <div key={key} className="security-badge">
          <Icon className="h-3.5 w-3.5" />
          <span>{t(key)}</span>
        </div>
      ))}
    </div>
  );
};

export default SecurityBadges;
