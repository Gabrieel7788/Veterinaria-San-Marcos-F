export const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-auto shadow-sm">
      <div className="container text-center">
        <small className="mb-0 text-white-50">
          🐾 Veterinaria San Marcos © {new Date().getFullYear()} | Todos los derechos reservados.
        </small>
      </div>
    </footer>
  );
};