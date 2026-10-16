"use client";
import { useState } from 'react';
import DocumentUploader from './components/Uploader';
import ReviewForm from './components/ReviewForm';
import { ExtractedData } from '../lib/processors/xmlProcessor';

export default function Home() {
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isAppVisible, setIsAppVisible] = useState(false);

  const handleExtractionSuccess = (data: ExtractedData) => {
    setExtractedData(data);
  };

  const resetFlow = () => {
    setExtractedData(null);
  };

  return (
    // Aplicamos una paleta de tonos azules para el fondo y la estructura
    <main className="min-h-screen bg-blue-50 font-sans text-gray-800">
      
      {/* Barra de Navegación (Header) */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight">DocuLector</div>
          <nav>
            <button 
              onClick={() => setIsAppVisible(true)}
              className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50 transition-colors"
            >
              Ir a la aplicación
            </button>
          </nav>
        </div>
      </header>

      {/* Si el usuario aún no ha entrado a la app, mostramos la Landing Page */}
      {!isAppVisible ? (
        <section className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <h1 className="text-5xl font-extrabold text-blue-900 mb-6 tracking-tight">
            Convierte tus facturas en datos organizados en segundos
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl">
            Deja de transcribir manualmente. Carga tus facturas electrónicas, revisa los datos extraídos y expórtalos directamente a Excel sin perder tiempo.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAppVisible(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-bold shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              Procesar mi primera factura
            </button>
          </div>

          {/* Sección de características rápidas */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <h3 className="text-xl font-bold text-blue-800 mb-2">1. Carga Rápida</h3>
              <p className="text-gray-600">Sube tus archivos XML de la DIAN directamente a la plataforma de forma segura.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <h3 className="text-xl font-bold text-blue-800 mb-2">2. Extracción Precisa</h3>
              <p className="text-gray-600">Identificamos proveedores, totales e impuestos sin errores de digitación.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <h3 className="text-xl font-bold text-blue-800 mb-2">3. Exportación a Excel</h3>
              <p className="text-gray-600">Descarga un archivo CSV perfectamente formateado y listo para tu contabilidad.</p>
            </div>
          </div>
        </section>
      ) : (
        /* Interfaz de la Aplicación (El núcleo que ya construimos) */
        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-blue-900">Panel de Procesamiento</h2>
            <button 
              onClick={() => { setIsAppVisible(false); resetFlow(); }}
              className="text-sm text-gray-500 hover:text-blue-600"
            >
              Volver al inicio
            </button>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-8 border border-blue-100">
            {!extractedData ? (
              <div className="text-center">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Paso 1: Selecciona tu archivo XML</h3>
                  <p className="text-sm text-gray-500">Los datos se extraerán automáticamente de forma local.</p>
                </div>
                <div className="max-w-md mx-auto">
                  <DocumentUploader onUploadSuccess={handleExtractionSuccess} />
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Paso 2: Verifica y Exporta</h3>
                  <button 
                    onClick={resetFlow}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Procesar otro documento
                  </button>
                </div>
                {/* Solución técnica aplicada para la fecha vacía inicial */}
                <ReviewForm initialData={{ ...extractedData, due_date: '' }} />
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}