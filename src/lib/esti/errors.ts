/** Bazowy błąd integracji Esti. */
export class EstiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EstiError";
  }
}

/** Brak / niekompletna konfiguracja (zmienne środowiskowe). */
export class EstiConfigError extends EstiError {
  constructor(message: string) {
    super(message);
    this.name = "EstiConfigError";
  }
}

/** Błąd autoryzacji do API Esti (nieprawidłowy company/token, 401/403). */
export class EstiAuthError extends EstiError {
  constructor(message = "Błąd autoryzacji do API EstiCRM.") {
    super(message);
    this.name = "EstiAuthError";
  }
}

/** Esti zwróciło błąd HTTP / przekroczono limit zapytań. */
export class EstiRequestError extends EstiError {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "EstiRequestError";
    this.status = status;
  }
}

/** Nie udało się sparsować odpowiedzi Esti. */
export class EstiParseError extends EstiError {
  constructor(message: string) {
    super(message);
    this.name = "EstiParseError";
  }
}
