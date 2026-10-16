"use client";
import { useState } from 'react';
// Importamos nuestro procesador XML que creamos en la fase 4
import { processDIANXml, ExtractedData } from '../../lib/processors/xmlProcessor'; 

interface UploaderProps {
  onUploadSuccess: (data: ExtractedData) => void;
}

export default function DocumentUploader({ onUploadSuccess }: UploaderProps) {
  const [status, setStatus] = useState<string>('Esperando archivo...');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus('Procesando archivo...');

    try {
      // 1. Aquí iría el código de Supabase (guardar en Storage y BD) que ya hicimos
      
      // 2. Leemos el contenido del archivo XML para procesarlo en el navegador
      const fileText = await file.text();
      
      // 3. Pasamos el texto al procesador
      const extractedData = await processDIANXml(fileText);

      setStatus('¡Extracción completada!');
      
      // 4. Enviamos los datos hacia arriba (a page.tsx)
      onUploadSuccess(extractedData);

    } catch (error: any) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center">
      <input type="file" onChange={handleFileUpload} accept=".xml" className="mb-2" />
      <p className="mt-2 text-sm text-blue-600">{status}</p>
    </div>
  );
}