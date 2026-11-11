/** Base de todos los errores de reglas de negocio del dominio. */
export abstract class ErrorDeDominio extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = new.target.name;
  }
}

export class IsbnInvalidoError extends ErrorDeDominio {
  constructor(readonly textoRecibido: string) {
    super(`ISBN inválido: «${textoRecibido}»`);
  }
}
