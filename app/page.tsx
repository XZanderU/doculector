// Importamos el componente que creamos en la ruta correspondiente
import DocumentUploader from './components/Uploader';

export default function Home() {
  return (
    // Usamos un fondo azul suave (bg-blue-50) para la pantalla principal
    <main className="min-h-screen p-8 bg-blue-50">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">DocuLector</h1>
        <p className="mb-6 text-gray-600">
          Carga tus facturas para extraer los datos automáticamente.
        </p>
        
        {/* Aquí insertamos nuestro componente interactivo */}
        <DocumentUploader />
      </div>
    </main>
  );
}