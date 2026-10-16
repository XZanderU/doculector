"use client";
import { useState } from 'react';
import DocumentUploader from './components/Uploader';
import ReviewForm from './components/ReviewForm';

// Importamos la interfaz para que TypeScript sepa qué forma tienen los datos
import { ExtractedData } from '../lib/processors/xmlProcessor';

export default function Home() {
  // Guardamos los datos extraídos. Si es null, mostramos el Uploader. Si tiene datos, mostramos el Formulario.
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);

  // Esta función se la pasaremos al Uploader. Cuando termine, nos enviará los datos aquí.
  const handleExtractionSuccess = (data: ExtractedData) => {
    setExtractedData(data);
  };

  const resetFlow = () => {
    setExtractedData(null);
  };

  return (
    <main className="min-h-screen p-8 bg-blue-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">DocuLector</h1>
        <p className="mb-8 text-gray-600">
          Transforma tus facturas electrónicas a formato Excel/CSV sin esfuerzo.
        </p>

        {/* LÓGICA DE VISTAS: Si no hay datos, muestra Uploader. Si los hay, muestra ReviewForm */}
        {!extractedData ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Paso 1: Cargar Factura</h2>
            <DocumentUploader onUploadSuccess={handleExtractionSuccess} />
          </div>
        ) : (
          <div>
            <button 
              onClick={resetFlow}
              className="mb-4 text-blue-600 hover:underline text-sm font-medium"
            >
              ← Procesar otro documento
            </button>
            <ReviewForm initialData={{ ...extractedData, due_date: '' }} />
          </div>
        )}
      </div>
    </main>
  );
}