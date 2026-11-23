import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

export const MapaClinica = () => {

  const latitud = Number(
    import.meta.env.VITE_CLINICA_LAT || -34.17045
  );

  const longitud = Number(
    import.meta.env.VITE_CLINICA_LNG || -70.74146
  );

  const direccion =
    import.meta.env.VITE_CLINICA_DIRECCION ||
    'Ubicación de referencia, Rancagua, Chile';

  const centro: [number, number] = [
    latitud,
    longitud
  ];

  const enlaceIndicaciones =
    `https://www.google.com/maps/dir/?api=1&destination=${latitud},${longitud}`;

  return (
    <section className="card shadow-sm border-0 mb-4">

      <div className="card-body p-4">

        <h3 className="text-primary mb-3">
          📍 Nuestra ubicación
        </h3>

        <p className="text-muted">
          <strong>Veterinaria San Marcos</strong>
          <br />
          {direccion}
        </p>

        <p className="small text-muted">
          Ubicación de referencia para demostración académica.
        </p>

        <div
          className="rounded overflow-hidden border"
          style={{
            width: '100%',
            height: '400px'
          }}
        >

          <MapContainer
            center={centro}
            zoom={16}
            scrollWheelZoom={false}
            style={{
              height: '100%',
              width: '100%'
            }}
          >

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <CircleMarker
              center={centro}
              radius={10}
              pathOptions={{
                color: '#0d6efd',
                fillColor: '#0d6efd',
                fillOpacity: 0.8
              }}
            >

              <Popup>
                <strong>
                  Ubicación de referencia
                </strong>
                <br />
                {direccion}
              </Popup>

            </CircleMarker>

          </MapContainer>

        </div>

        <div className="mt-3">

          <a
            href={enlaceIndicaciones}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            🧭 Cómo llegar desde mi ubicación
          </a>

        </div>

      </div>

    </section>
  );
};
