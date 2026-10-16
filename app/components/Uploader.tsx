"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente (idealmente usar @supabase/ssr en el futuro, esto es conceptual)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'text/xml', 'application/xml'];

export default function DocumentUploader() {
  const [status, setStatus] = useState<string>('Esperando archivo...');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. Validar tamaño y formato (No confiar solo en la extensión)[cite: 12]
    if (file.size > MAX_FILE_SIZE) {
      setStatus('Error: El archivo supera los 5MB.');
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setStatus('Error: Formato no admitido. Solo PDF, JPG, PNG o XML.');
      return;
    }

    setStatus('Subiendo archivo...');

    try {
      // Obtener el usuario actual (Asumiendo que ya hay sesión iniciada)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Debes iniciar sesión');

      // 2. Guardar en Storage Privado[cite: 7, 14]
      // Usamos el ID del usuario como carpeta para aislar físicamente los archivos
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Crear el registro en PostgreSQL
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          original_filename: file.name,
          mime_type: file.type,
          storage_path: filePath,
          status: 'uploaded'
        });

      if (dbError) throw dbError;

      setStatus('¡Documento cargado correctamente!');
    } catch (error: any) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-4 border rounded">
      <input type="file" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.xml" />
      <p className="mt-2 text-sm text-gray-600">{status}</p>
    </div>
  );
}