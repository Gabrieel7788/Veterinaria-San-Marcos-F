export const Nosotros = () => {
  return (
    <div className="container mt-4">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h2 className="text-primary fw-bold mb-4">Sobre Veterinaria San Marcos</h2>
          <p className="lead">
            Ubicados en Rancagua, desde 2009 nos dedicamos al cuidado integral de tus mascotas.
          </p>
          <p>
            Nuestro equipo está conformado por profesionales apasionados por el bienestar animal. 
            Atendemos perros, gatos y animales exóticos, ofreciendo servicios de consulta general, 
            vacunación, cirugía menor y más.
          </p>
          <div className="alert alert-info mt-4">
            <strong>Equipo Desarrollador:</strong>
            <ul className="mb-0 mt-2">
              <li>Tu Nombre / Integrante 1</li>
              <li>Integrante 2 (si aplica)</li>
              <li>Integrante 3 (si aplica)</li>
            </ul>
          </div>
        </div>
        <div className="col-md-6 text-center">
          <img 
            src="https://images.unsplash.com/photo-1599443015574-be5fe8a05783?q=80&w=800&auto=format&fit=crop" 
            alt="Veterinario examinando un perro" 
            className="img-fluid rounded shadow"
          />
        </div>
      </div>
    </div>
  );
};