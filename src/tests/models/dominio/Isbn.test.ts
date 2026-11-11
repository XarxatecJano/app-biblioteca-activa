import { describe, it, expect } from "vitest";
import { Isbn } from "../../../models/dominio/Isbn.js";
import { IsbnInvalidoError } from "../../../models/dominio/errores.js";

describe("Isbn", () => {
  describe("acepta ISBN válidos", () => {
    it("acepta un ISBN-13 válido", () => {
      const isbn = Isbn.crear("9788437604947");

      expect(isbn.valor).toBe("9788437604947");
    });

    it("acepta un ISBN-10 válido", () => {
      const isbn = Isbn.crear("0306406152");

      expect(isbn.valor).toBe("0306406152");
    });

    it("acepta un ISBN-10 cuyo dígito de control es X", () => {
      const isbn = Isbn.crear("080442957X");

      expect(isbn.valor).toBe("080442957X");
    });

    it("normaliza la x minúscula del dígito de control a X", () => {
      const isbn = Isbn.crear("080442957x");

      expect(isbn.valor).toBe("080442957X");
    });

    it("ignora guiones y espacios", () => {
      expect(Isbn.crear("978-84-376-0494-7").valor).toBe("9788437604947");
      expect(Isbn.crear("978 84 376 0494 7").valor).toBe("9788437604947");
      expect(Isbn.crear("  0-306-40615-2  ").valor).toBe("0306406152");
    });
  });

  describe("rechaza ISBN inválidos con IsbnInvalidoError", () => {
    it.each([
      ["dígito de control incorrecto (ISBN-13)", "9788437604948"],
      ["dígito de control incorrecto (ISBN-10)", "0306406153"],
      ["longitud incorrecta", "978843760494"],
      ["demasiados dígitos", "97884376049470"],
      ["contiene letras", "97884376A4947"],
      ["X en una posición que no es la última", "0X06406152"],
      ["X en un ISBN-13", "978843760494X"],
      ["cadena vacía", ""],
      ["solo espacios y guiones", " - - "],
    ])("%s: «%s»", (_motivo, texto) => {
      expect(() => Isbn.crear(texto)).toThrow(IsbnInvalidoError);
    });

    it("el error incluye el texto recibido", () => {
      expect(() => Isbn.crear("123")).toThrow(/123/);
    });
  });

  describe("igualdad", () => {
    it("dos ISBN con el mismo valor en distinto formato son iguales", () => {
      const conGuiones = Isbn.crear("978-84-376-0494-7");
      const sinGuiones = Isbn.crear("9788437604947");

      expect(conGuiones.equals(sinGuiones)).toBe(true);
    });

    it("dos ISBN distintos no son iguales", () => {
      const uno = Isbn.crear("9788437604947");
      const otro = Isbn.crear("9780306406157");

      expect(uno.equals(otro)).toBe(false);
    });
  });
});
