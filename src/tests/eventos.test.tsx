// @vitest-environment jsdom
import { test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';

import { Boton } from '../componentes/atomos/Boton';
import { Contacto } from '../paginas/Contacto';
import { Input } from '../componentes/atomos/Input';

test('PRUEBA 11 (Eventos): debe gatillar la función onClick al presionar un botón', () => {
  const handleClick = vi.fn();
  render(<Boton texto="Click aquí" onClick={handleClick} />);
  const boton = screen.getByRole('button');
  fireEvent.click(boton);
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('PRUEBA 12 (Estado): debe actualizar el valor de un Input al escribir en él', () => {
  render(<Input name="prueba" placeholder="Escribe algo" onChange={() => {}} />);
  const input = screen.getByPlaceholderText('Escribe algo') as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'Texto de prueba' } });
  expect(input.value).toBe('Texto de prueba');
});

test('PRUEBA 13 (Validaciones): debe mostrar mensaje de error si se envía el formulario vacío', () => {
  render(<BrowserRouter><Contacto /></BrowserRouter>);
  const botonEnviar = screen.getByRole('button', { name: /enviar mensaje/i });
  fireEvent.click(botonEnviar);
  
  const mensajeError = screen.getByText('El nombre es obligatorio.');
  expect(mensajeError).toBeInTheDocument();
});

test('PRUEBA 14 (Espías): debe mostrar la alerta de éxito con datos válidos', () => {
  const spyAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

  const { container } = render(<BrowserRouter><Contacto /></BrowserRouter>);

  const inputNombre = container.querySelector('input[name="nombre"]') as HTMLInputElement;
  const textareaComentario = container.querySelector('textarea[name="comentario"]') as HTMLTextAreaElement;
  const botonEnviar = screen.getByRole('button', { name: /enviar mensaje/i });

  fireEvent.change(inputNombre, { target: { value: 'Juan Pérez' } });
  fireEvent.change(textareaComentario, { target: { value: 'Consulta sobre mi mascota' } });
  fireEvent.click(botonEnviar);

  expect(spyAlert).toHaveBeenCalledWith('Mensaje enviado correctamente (Simulado)');
  spyAlert.mockRestore(); 
});

test('PRUEBA 15 (Renderizado): debe renderizar el campo de texto para el comentario', () => {
  const { container } = render(<BrowserRouter><Contacto /></BrowserRouter>);
  
  const textarea = container.querySelector('textarea[name="comentario"]');
  
  expect(textarea).not.toBeNull(); 
});