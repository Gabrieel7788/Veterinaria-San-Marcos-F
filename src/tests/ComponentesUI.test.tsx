// @vitest-environment jsdom
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';

import { Boton } from '../componentes/atomos/Boton';
import { Contacto } from '../paginas/Contacto';

test('PRUEBA 7 (Renderizado): debe renderizar el componente Botón con su texto correcto', () => {
  render(<Boton texto="Guardar Reserva" />);
  const boton = screen.getByRole('button', { name: /guardar reserva/i });
  expect(boton).toBeInTheDocument();
});

test('PRUEBA 8 (Props): debe aplicar el atributo disabled al botón cuando se le pasa por propiedad', () => {
  render(<Boton texto="Enviar" disabled={true} />);
  const boton = screen.getByRole('button');
  expect(boton).toBeDisabled();
});

test('PRUEBA 9 (Vistas): debe mostrar el título principal en la página de Contacto', () => {
 
  render(<BrowserRouter><Contacto /></BrowserRouter>);
  const titulo = screen.getByRole('heading', { level: 2, name: /contáctanos/i });
  expect(titulo).toBeInTheDocument();
});

test('PRUEBA 10 (Responsividad): verifica que el formulario tenga las clases responsivas de Bootstrap', () => {
  render(<BrowserRouter><Contacto /></BrowserRouter>);
  const contenedor = screen.getByTestId('contenedor-responsivo');
  
  expect(contenedor).toHaveClass('col-12');
  expect(contenedor).toHaveClass('col-md-8');
  expect(contenedor).toHaveClass('col-lg-6');
});