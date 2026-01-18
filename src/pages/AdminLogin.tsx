import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Scan, ShieldCheck, Lock, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'scan' | 'pin'>('scan');
    const [isScanning, setIsScanning] = useState(false);
    const [pin, setPin] = useState('');
    const [verifying, setVerifying] = useState(false);

    // Auto-start scanning effect simulation
    useEffect(() => {
        if (step === 'scan') {
            // Just a visual delay to look professional
            const timer = setTimeout(() => setIsScanning(true), 500);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Handle PIN Entry
    const handlePinInput = (num: string) => {
        if (pin.length < 6) {
            const newPin = pin + num;
            setPin(newPin);

            // Auto-submit when length is 6
            if (newPin.length === 6) {
                verifyPin(newPin);
            }
        }
    };

    const handleBackspace = () => {
        setPin(prev => prev.slice(0, -1));
    };

    const verifyPin = (code: string) => {
        setVerifying(true);
        // Simulate API verification
        setTimeout(() => {
            // Always succeed for this simulation as requested
            toast.success("Authentification réussie");
            localStorage.setItem('admin_authenticated', 'true');
            localStorage.setItem('admin_session_start', new Date().toISOString());
            navigate('/admin');
        }, 1500);
    };

    const handleScanSuccess = () => {
        // Simulate successful scan
        toast.info("Badge reconnu : ADMIN-ACCESS-LEVEL-1");
        setStep('pin');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 font-sans relative">
            <Button
                variant="ghost"
                className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/')}
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
            </Button>

            {/* Brand Header */}
            <div className="mb-8 text-center animate-fade-in">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Espace Sécurisé</h1>
                <p className="text-muted-foreground text-sm">Administration AutoApply</p>
            </div>

            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">

                {step === 'scan' && (
                    <div className="p-6 flex flex-col items-center animate-fade-in">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <QrCode className="w-5 h-5 text-primary" />
                            Scan Badge d'Accès
                        </h2>

                        {/* Simulated Camera Viewfinder */}
                        <div
                            className="relative w-64 h-64 bg-slate-950 rounded-2xl overflow-hidden mb-6 cursor-pointer group shadow-inner ring-4 ring-slate-100 dark:ring-slate-800"
                            onClick={handleScanSuccess}
                        >
                            {/* Camera Feed Simulation (Just dark placeholder) */}
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>

                            {/* Scan Line Animation */}
                            {isScanning && (
                                <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-scan-line z-20"></div>
                            )}

                            {/* Viewfinder Corners */}
                            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-white/50 rounded-tl-lg z-10"></div>
                            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-white/50 rounded-tr-lg z-10"></div>
                            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-white/50 rounded-bl-lg z-10"></div>
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-white/50 rounded-br-lg z-10"></div>

                            {/* Simulated Camera Content or Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-white/80 text-xs font-mono uppercase tracking-widest bg-black/50 px-3 py-1 rounded backdrop-blur">
                                    {isScanning ? 'Recherche...' : 'Prêt'}
                                </div>
                            </div>

                            {/* Instructions on hover */}
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30">
                                <p className="text-white font-medium flex flex-col items-center gap-2">
                                    <Scan className="w-8 h-8" />
                                    Cliquer pour simuler
                                </p>
                            </div>
                        </div>

                        <p className="text-center text-sm text-muted-foreground px-4">
                            Placez votre badge administrateur dans le cadre pour vous identifier.
                        </p>

                        <Button variant="ghost" className="mt-4 text-xs" onClick={handleScanSuccess}>
                            Simuler le scan (Dev)
                        </Button>
                    </div>
                )}

                {step === 'pin' && (
                    <div className="p-6 flex flex-col items-center animate-slide-in-right">
                        <div className="flex items-center self-start mb-4">
                            <Button variant="ghost" size="icon" onClick={() => setStep('scan')} className="h-8 w-8 -ml-2 text-muted-foreground">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="mb-8 text-center">
                            <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
                                <Lock className="w-5 h-5 text-primary" />
                                Code Secret
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">Saisissez votre code à 6 chiffres</p>
                        </div>

                        {/* PIN Display Dots */}
                        <div className="flex gap-3 mb-8">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-4 h-4 rounded-full transition-all duration-300 ${i < pin.length ? 'bg-primary scale-110' : 'bg-slate-200 dark:bg-slate-700'}`}
                                />
                            ))}
                        </div>

                        {/* Errors or Loading */}
                        {verifying && (
                            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                                <p className="text-sm font-medium">Vérification des accès...</p>
                            </div>
                        )}

                        {/* Numeric Keypad */}
                        <div className="grid grid-cols-3 gap-4 w-full max-w-[260px]">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <Button
                                    key={num}
                                    variant="outline"
                                    className="h-14 text-xl font-medium rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-105"
                                    onClick={() => handlePinInput(num.toString())}
                                    disabled={verifying}
                                >
                                    {num}
                                </Button>
                            ))}
                            <div className="flex items-center justify-center">
                                {/* Empty slot */}
                            </div>
                            <Button
                                variant="outline"
                                className="h-14 text-xl font-medium rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                                onClick={() => handlePinInput('0')}
                                disabled={verifying}
                            >
                                0
                            </Button>
                            <Button
                                variant="ghost"
                                className="h-14 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl"
                                onClick={handleBackspace}
                                disabled={verifying}
                            >
                                Effacer
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 text-center text-xs text-muted-foreground/60">
                <p>Système Sécurisé par Nixacom Security • v2.4.0</p>
            </div>

            {/* CSS for scan animation */}
            <style>{`
        @keyframes scan-line {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .animate-scan-line {
          animation: scan-line 3s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default AdminLogin;
