//vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { Contacto } from "../paginas/Contacto"; 

test("verifica que el contenedor tenga las clases responsivas correctas", () => {
  render(<Contacto />);
  
  const contenedor = screen.getByTestId("contenedor-responsivo");
  

  expect(contenedor).toHaveClass("col-12");
  expect(contenedor).toHaveClass("col-md-8");
  expect(contenedor).toHaveClass("col-lg-6");
});