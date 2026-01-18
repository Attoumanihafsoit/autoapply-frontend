import { useState, useRef } from 'react';
import { Upload, Camera, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { type DocumentsData } from '@/types/onboarding';

interface DocumentsStepProps {
  data: DocumentsData;
  onChange: (data: DocumentsData) => void;
}

const DocumentsStep = ({ data, onChange }: DocumentsStepProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<'front' | 'back' | 'selfie' | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleZoneClick = (docType: 'front' | 'back' | 'selfie') => {
    setActiveDoc(docType);
    setIsDialogOpen(true);
  };

  const handleOptionSelect = (option: 'upload' | 'camera') => {
    setIsDialogOpen(false);
    if (option === 'upload') {
      fileInputRef.current?.click();
    } else {
      cameraInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeDoc) return;

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewUrl = e.target?.result as string;
            if (activeDoc === 'front') onChange({ ...data, idDocumentFront: previewUrl });
            if (activeDoc === 'back') onChange({ ...data, idDocumentBack: previewUrl });
            if (activeDoc === 'selfie') onChange({ ...data, selfie: previewUrl });
            setIsUploading(false);
            setActiveDoc(null);
            toast.success("Document ajouté !");
        };
        reader.readAsDataURL(file);
    }, 1000);
    
    // Reset inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const renderUploadZone = (title: string, value: string | undefined, type: 'front' | 'back' | 'selfie') => (
    <div
        className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors ${value ? 'border-primary bg-primary/5' : 'border-border'}`}
        onClick={() => handleZoneClick(type)}
    >
        {value ? (
            <>
                <img src={value} alt={title} className="w-full h-32 object-contain mb-2 rounded" />
                 <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
                    <Check className="h-3 w-3" />
                </div>
                <p className="text-xs text-primary font-semibold">Cliquer pour remplacer</p>
            </>
        ) : (
            <>
                {type === 'selfie' ? <Camera className="h-8 w-8 text-muted-foreground mb-2"/> : <Upload className="h-8 w-8 text-muted-foreground mb-2"/>}
                <p className="text-sm font-medium">{title}</p>
            </>
        )}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-semibold mb-6">Justificatifs & Biométrie</h2>
        
        {/* Inputs */}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />

        {/* Dialog */}
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Ajouter un document</DialogTitle>
                <DialogDescription>Choisissez une méthode d'import.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
                <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => handleOptionSelect('upload')}>
                    <Upload className="h-8 w-8" /> <span>Fichier</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => handleOptionSelect('camera')}>
                    <Camera className="h-8 w-8" /> <span>Caméra</span>
                </Button>
            </div>
            </DialogContent>
        </Dialog>

        {isUploading && (
             <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="font-medium animate-pulse">Traitement sécurisé...</p>
                </div>
             </div>
        )}

        <div className="form-section">
            <h3 className="font-medium text-primary mb-4">Pièce d'Identité</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderUploadZone("Recto CNI / Passeport", data.idDocumentFront, 'front')}
                {renderUploadZone("Verso CNI", data.idDocumentBack, 'back')}
            </div>
        </div>

        <div className="form-section">
            <h3 className="font-medium text-primary mb-4">Vérification du visage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderUploadZone("Prendre un Selfie", data.selfie, 'selfie')}
                <div className="p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground flex flex-col justify-center">
                    <p className="mb-2 font-semibold">Conseils :</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Cadrez bien votre visage</li>
                        <li>Evitez les contre-jours</li>
                        <li>Ne portez pas de lunettes de soleil</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DocumentsStep;
