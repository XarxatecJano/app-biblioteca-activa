import { describe, it, expect } from "vitest";
import { Libro } from "../../../models/dominio/Libro.js";
import { Isbn } from "../../../models/dominio/Isbn.js";
import { IsbnInvalidoError } from "../../../models/dominio/errores.js";

describe("Libro", () => {
  it("se crea con un ISBN válido", () => {
    const libro = Libro.crear({
      id: 1,
      titulo: "Cien años de soledad",
      isbn: "978-84-376-0494-7",
    });

    expect(libro.id).toBe(1);
    expect(libro.titulo).toBe("Cien años de soledad");
    expect(libro.isbn?.equals(Isbn.crear("9788437604947"))).toBe(true);
  });

  it("se crea sin ISBN, porque es opcional", () => {
    const libro = Libro.crear({ id: 2, titulo: "Manuscrito sin catalogar" });

    expect(libro.isbn).toBeNull();
  });

  it("no se crea si el ISBN no es válido", () => {
    expect(() =>
      Libro.crear({ id: 3, titulo: "Libro con ISBN erróneo", isbn: "9788437604948" }),
    ).toThrow(IsbnInvalidoError);
  });
});
