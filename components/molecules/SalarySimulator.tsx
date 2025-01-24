"use client"
// Import necessary libraries
import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Dialog, DialogOverlay, DialogContent, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';

const SalarySimulator = () => {
    // State variables for inputs and outputs
    const [ral, setRal] = useState<number | undefined>(undefined); // Default RAL
    const [results, setResults] = useState<{
        nettoAnnuale?: string;
        nettoMensile12?: string;
        nettoMensile13?: string;
        nettoMensile14?: string;
    }>({});
    const [showPopup, setShowPopup] = useState(false);
    const [formData, setFormData] = useState({name: "", surname: "", email: ""});
    const [errorDialog, setErrorDialog] = useState(false);
    const [errorRal, setErrorRal] = useState(false);

    // Constants for calculations
    //const TAGLIO_CUNEO_FISCALE = 1.0; // Always on
    //const BONUS_100 = 0.0; // Always off

    // Function to calculate outputs
    const calculateSalary = () => {
        if (ral === undefined || ral <= 0) {
            setErrorRal(true);
            return;
        }
        const contributiINPS = ral * 0.0953; // Fixed INPS contribution rate
        const redditoImponibile = ral - contributiINPS;
        const irpefLorda = redditoImponibile * 0.23; // Applying 23% IRPEF rate
        const detrazioni = 1840; // Standard deductions
        const irpefNetta = Math.max(irpefLorda - detrazioni, 0);
        const nettoAnnuale = redditoImponibile - irpefNetta;
        const nettoMensile12 = nettoAnnuale / 12;
        const nettoMensile13 = nettoAnnuale / 13;
        const nettoMensile14 = nettoAnnuale / 14;

        setResults({
            nettoAnnuale: nettoAnnuale.toFixed(2),
            nettoMensile12: nettoMensile12.toFixed(2),
            nettoMensile13: nettoMensile13.toFixed(2),
            nettoMensile14: nettoMensile14.toFixed(2),
        });
        setShowPopup(true);
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleFormSubmit = () => {
        if (formData.email && emailRegex.test(formData.email)) {
            setShowPopup(false);
        } else {
            setErrorDialog(true);
        }
    };


    return (


        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-black mb-20 text-center">
                Simulatore Stipendio Netto
            </h1>
            <Card className="p-6 w-full max-w-lg">

                <p className="text-gray-600 mb-6 text-center">
                    Inserisci i tuoi dati per calcolare lo stipendio netto mensile.
                </p>

                {/* Input Fields */}
                <div className="mb-4">
                    <label className="block text-black font-medium mb-2 text-center">
                        RAL (Reddito Annuale Lordo)
                    </label>
                    <Input
                        type="number"
                        value={ral}
                        onChange={(e) => setRal(Number(e.target.value))}
                        placeholder="Inserisci la tua RAL"
                        className="w-full text-center"
                    />
                </div>

                {/* Calculate Button */}
                <Button onClick={calculateSalary} className="w-full bg-black text-white">
                    Calcola Stipendio Netto
                </Button>

                {/* Popup for user details */}
                {showPopup && (
                    <Dialog open={showPopup}>
                        <DialogOverlay
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <DialogContent className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                                <DialogTitle className="text-2xl text-center font-bold mb-4">
                                    Inserisci la tua email
                                </DialogTitle>
                                <p className="text-gray-600 mb-4">
                                    Inserisci la tua email per ricevere i risultati e restare aggiornato sulle novità di
                                    JetHR
                                </p>
                                <div className="mb-4">

                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="Inserisci la tua email"
                                        className="w-full"
                                    />
                                </div>
                                <Button onClick={handleFormSubmit}
                                        className="w-full font-bold bg-black text-white text-xl">
                                    Invia
                                </Button>
                            </DialogContent>
                        </DialogOverlay>
                    </Dialog>
                )}

                {/* Error Dialog */}
                {errorDialog && (
                    <Dialog open={errorDialog} onOpenChange={setErrorDialog}>
                        <DialogOverlay
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <DialogContent className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
                                <DialogTitle className="text-lg font-bold mb-4">
                                    Errore
                                </DialogTitle>
                                <p className="text-gray-600 mb-6">
                                    Per favore, inserisci un email valida.
                                </p>
                                <Button onClick={() => setErrorDialog(false)} className="bg-black text-white">
                                    Chiudi
                                </Button>
                            </DialogContent>
                        </DialogOverlay>
                    </Dialog>
                )}

                {/* Error ral */}
                {errorRal && (
                    <Dialog open={errorRal} onOpenChange={setErrorRal}>
                        <DialogOverlay
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <DialogContent className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
                                <DialogTitle className="text-lg font-bold mb-4">
                                    Errore
                                </DialogTitle>
                                <p className="text-gray-600 mb-6">
                                    Per favore, inserisci una RAL valida.
                                </p>
                                <Button onClick={() => setErrorRal(false)} className="bg-black text-white">
                                    Chiudi
                                </Button>
                            </DialogContent>
                        </DialogOverlay>
                    </Dialog>
                )}

                {/* Results */}
                {results.nettoAnnuale && !showPopup && (
                    <Card className="mt-6 p-4 bg-gray-100">
                        <h2 className="text-lg font-bold text-black">
                            Risultati:
                        </h2>
                        <p className="text-black mt-2">
                            <strong>Reddito Netto Annuale:</strong> € {results.nettoAnnuale}
                        </p>
                        <p className="text-black mt-2">
                            <strong>Reddito Netto Mensile (12 mesi):</strong> € {results.nettoMensile12}
                        </p>
                        <p className="text-black mt-2">
                            <strong>Reddito Netto Mensile (13 mesi):</strong> € {results.nettoMensile13}
                        </p>
                        <p className="text-black mt-2">
                            <strong>Reddito Netto Mensile (14 mesi):</strong> € {results.nettoMensile14}
                        </p>
                    </Card>
                )}
            </Card>
        </div>
    );
};

export default SalarySimulator;