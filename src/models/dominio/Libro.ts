import { Isbn } from "./Isbn.js";

export interface DatosLibro {
  id: number;
  titulo: string;
  isbn?: string;
}

/** Libro del catálogo (tabla `Item`). Por ahora solo con los campos que necesita el ISBN. */
export class Libro {
  private constructor(
    readonly id: number,
    readonly titulo: string,
    readonly isbn: Isbn | null,
  ) {}

  static crear(datos: DatosLibro): Libro {
    const isbn = datos.isbn === undefined ? null : Isbn.crear(datos.isbn);
    return new Libro(datos.id, datos.titulo, isbn);
  }
}
