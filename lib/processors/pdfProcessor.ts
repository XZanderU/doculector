import pdf from 'pdf-parse';
import { ExtractedData } from './xmlProcessor'; // Reutilizamos la misma estructura del XML

// La función recibe un "Buffer". Un Buffer es la forma en que Node.js (el servidor) 
// maneja archivos binarios crudos en la memoria antes de convertirlos a texto.
export async function processPDF(fileBuffer: Buffer): Promise<ExtractedData> {
  
  // 1. pdf-parse toma el archivo binario y nos devuelve un objeto con el texto puro
  const data = await pdf(fileBuffer);
  const text = data.text;

  // 2. BÚSQUEDA CON PATRONES (Regex)
  // Qué hace esta variable cufeMatch:
  // - /CUFE/ -> Busca literalmente la palabra CUFE
  // - [\s:\n]* -> Le dice que ignore espacios en blanco (\s), dos puntos (:) o saltos de línea (\n)
  // - ([a-zA-Z0-9\n]+) -> Los paréntesis "atrapan" las letras y números siguientes y los guardan.
  // - /i -> Hace que la búsqueda no distinga entre mayúsculas y minúsculas.
  const cufeMatch = text.match(/CUFE[\s:\n]*([a-zA-Z0-9\n]+)/i);
  
  // Lo mismo para el NIT: buscamos "NIT", ignoramos puntos o guiones, y atrapamos los números
  const nitMatch = text.match(/NIT[\s:\.\-]*([0-9]+)/i);
  
  // Lo mismo para el Total: buscamos "Total", ignoramos el signo $, y atrapamos números y comas
  const totalMatch = text.match(/Total[\s:\$]*([0-9,\.]+)/i);

  // 3. LIMPIEZA DE VARIABLES
  // Si cufeMatch encontró algo, el valor atrapado estará en la posición [1].
  // Usamos .replace(/\n/g, '') para quitar cualquier salto de línea que se haya colado.
  const cufe = cufeMatch ? cufeMatch[1].replace(/\n/g, '') : null;
  const nit = nitMatch ? nitMatch[1] : null;

  // Para el total, necesitamos convertir un texto como "150,000.00" a un número matemático real.
  let total = null;
  if (totalMatch) {
    const cleanNumber = totalMatch[1].replace(/,/g, ''); // Quitamos las comas de miles
    total = parseFloat(cleanNumber); // Convertimos el texto a número decimal
  }

  // 4. RETORNO DE LA ESTRUCTURA
  // Devolvemos exactamente el mismo tipo de objeto que devolvía el procesador XML.
  // Respetamos el principio del documento: si no encontramos la fecha o el subtotal, mandamos null.
  return {
    invoice_number: cufe, // Usaremos el CUFE como identificador principal
    supplier_tax_id: nit,
    supplier_name: null,  // Extraer el nombre en PDF es muy variable, lo dejamos vacío para revisión manual
    issue_date: null,
    subtotal: null,
    tax_total: null,
    total: total,
    currency: 'COP'
  };
}