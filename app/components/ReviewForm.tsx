"use client";
import { useState } from 'react';
import { CSVLink } from "react-csv"; // Herramienta para descargar CSV

// Usamos la interfaz que definimos en la fase anterior
interface ExtractedData {
  supplier_name: string | null;
  invoice_number: string | null;
  total: number | null;
  due_date: string | null;
}

export default function ReviewForm({ initialData }: { initialData: ExtractedData }) {
  // Guardamos los datos extraídos en un estado para que sean editables
  const [formData, setFormData] = useState<ExtractedData>({
    supplier_name: initialData.supplier_name || '',
    invoice_number: initialData.invoice_number || '',
    total: initialData.total || 0,
    due_date: initialData.due_date || '', // Si venía null, queda vacío para que el humano lo llene
  });

  // Función para manejar cuando el usuario escribe en un campo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Preparamos los datos para el CSV
  const csvHeaders = [
    { label: "Proveedor", key: "supplier_name" },
    { label: "Número Factura", key: "invoice_number" },
    { label: "Vencimiento", key: "due_date" },
    { label: "Total", key: "total" }
  ];

  return (
    <div className="p-4 bg-white rounded shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Revisar Datos Extraídos</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Proveedor</label>
          <input 
            name="supplier_name" 
            value={formData.supplier_name || ''} 
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Factura</label>
          <input 
            name="invoice_number" 
            value={formData.invoice_number || ''} 
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Vencimiento</label>
          {/* Aquí el contador podrá poner los 30 días manualmente si el campo estaba vacío */}
          <input 
            type="date"
            name="due_date" 
            value={formData.due_date || ''} 
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total</label>
          <input 
            type="number"
            name="total" 
            value={formData.total || ''} 
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        {/* El botón de exportación usa los datos validados del formData */}
        <CSVLink 
          data={[formData]} 
          headers={csvHeaders}
          filename={`factura_${formData.invoice_number}.csv`}
          separator={";"} // separar valores en exportación de excel
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Aprobar y Exportar a CSV
        </CSVLink>
      </div>
    </div>
  );
}