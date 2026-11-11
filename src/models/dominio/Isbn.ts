import { IsbnInvalidoError } from "./errores.js";

const FORMATO_ISBN_10 = /^\d{9}[\dX]$/;
const FORMATO_ISBN_13 = /^\d{13}$/;

/** Objeto de valor inmutable: un ISBN-10 o ISBN-13 con dígito de control correcto. */
export class Isbn {
  private constructor(readonly valor: string) {}

  static crear(texto: string): Isbn {
    const normalizado = texto.replace(/[\s-]/g, "").toUpperCase();

    const esValido =
      (FORMATO_ISBN_10.test(normalizado) && controlIsbn10Correcto(normalizado)) ||
      (FORMATO_ISBN_13.test(normalizado) && controlIsbn13Correcto(normalizado));

    if (!esValido) {
      throw new IsbnInvalidoError(texto);
    }
    return new Isbn(normalizado);
  }

  equals(otro: Isbn): boolean {
    return this.valor === otro.valor;
  }
}

/** Suma ponderada 10..1; la X vale 10. Es válido si la suma es múltiplo de 11. */
function controlIsbn10Correcto(isbn: string): boolean {
  let suma = 0;
  for (let i = 0; i < 10; i++) {
    const caracter = isbn.charAt(i);
    const digito = caracter === "X" ? 10 : Number(caracter);
    suma += digito * (10 - i);
  }
  return suma % 11 === 0;
}

/** Pesos alternos 1 y 3. Es válido si la suma es múltiplo de 10. */
function controlIsbn13Correcto(isbn: string): boolean {
  let suma = 0;
  for (let i = 0; i < 13; i++) {
    suma += Number(isbn.charAt(i)) * (i % 2 === 0 ? 1 : 3);
  }
  return suma % 10 === 0;
}
