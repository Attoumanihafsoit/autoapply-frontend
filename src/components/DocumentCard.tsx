import { FileText, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import CompletionScore from './CompletionScore';
import type { DocumentInfo } from '@/types/onboarding';

interface DocumentCardProps {
  document: DocumentInfo;
  isSelected: boolean;
  onClick: () => void;
}

const DocumentCard = ({ document, isSelected, onClick }: DocumentCardProps) => {
  const { language } = useLanguage();
  
  const statusClass = 
    document.status === 'complete' 
      ? 'doc-complete' 
      : document.status === 'partial' 
      ? 'doc-partial' 
      : 'doc-missing';

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${statusClass} ${
        isSelected ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-background">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">
            {language === 'fr' ? document.nameFr : document.name}
          </h4>
          <div className="mt-2">
            <CompletionScore score={document.completionScore} />
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            {document.status === 'complete' ? (
              <span className="badge-success text-xs">
                <Check className="h-3 w-3" />
                Complet
              </span>
            ) : (
              <span className="badge-warning text-xs">
                <AlertCircle className="h-3 w-3" />
                {document.missingFields.length} champs manquants
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
