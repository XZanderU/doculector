import { NextRequest, NextResponse } from 'next/server';
import { processPDF } from '../../../lib/processors/pdfProcessor';

export async function POST(request: NextRequest) {
  try {
    // 1. request.formData() recibe el "paquete" de datos que envió el navegador
    const formData = await request.formData();
    
    // 2. Sacamos el archivo específico llamado 'file' de ese paquete
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 });
    }

    // 3. TRANSFORMACIÓN CRÍTICA:
    // El navegador envía el archivo como un objeto web (File).
    // Pero nuestra función processPDF (Node.js) necesita un objeto binario (Buffer).
    // arrayBuffer() extrae los bytes, y Buffer.from() los empaqueta para el servidor.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Se lo pasamos a nuestro procesador (el que creamos en el paso 2)
    const extractedData = await processPDF(buffer);

    // 5. Devolvemos el JSON estructurado de vuelta al navegador
    return NextResponse.json(extractedData);

  } catch (error: any) {
    console.error('Error en la API de extracción:', error);
    return NextResponse.json({ error: 'Error procesando el documento' }, { status: 500 });
  }
}