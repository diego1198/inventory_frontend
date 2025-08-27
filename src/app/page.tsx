import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Sistema de Inventario y Facturación
          </h1>
          <p className="text-xl text-muted-foreground">
            Gestiona tu inventario, ventas y reportes de manera eficiente
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Gestión de Productos</h3>
            <p className="text-muted-foreground">
              Administra tu inventario, precios y stock de productos
            </p>
          </div>
          
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Control de Ventas</h3>
            <p className="text-muted-foreground">
              Registra y gestiona todas tus transacciones comerciales
            </p>
          </div>
          
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Reportes y Análisis</h3>
            <p className="text-muted-foreground">
              Obtén insights valiosos sobre tu negocio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
