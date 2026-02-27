// ─── Enums ────────────────────────────────────────────────

export enum Rubro {
  ALEATORIO = 'aleatorio',
  HAMBURGUESERIA = 'hamburgueseria',
  LOMITERIA = 'lomiteria',
  ESTETICA = 'estetica',
  CENTRO_SALUD = 'centro_salud',
  INDUMENTARIA = 'indumentaria',
  TALLER_MECANICO = 'taller_mecanico',
  GIMNASIO = 'gimnasio'
}

export enum Intent {
  PEDIR = 'PEDIR',
  PRECIOS = 'PRECIOS',
  HORARIOS = 'HORARIOS',
  UBICACION = 'UBICACION',
  PAGOS = 'PAGOS',
  DELIVERY_RETIRO = 'DELIVERY_RETIRO',
  PROMOS = 'PROMOS',
  TURNO = 'TURNO',
  PRESUPUESTO = 'PRESUPUESTO'
}

export enum Extra {
  DELIVERY = 'DELIVERY',
  RETIRO = 'RETIRO',
  PAGO_TRANSFERENCIA = 'PAGO_TRANSFERENCIA',
  PAGO_EFECTIVO = 'PAGO_EFECTIVO',
  PAGO_TARJETA = 'PAGO_TARJETA',
  URGENTE = 'URGENTE',
  PET_FRIENDLY = 'PET_FRIENDLY',
  COMER_LOCAL = 'COMER_LOCAL'
}

export enum Style {
  FORMAL = 'formal',
  NEUTRO = 'neutro',
  CANCHERO = 'canchero'
}

// ─── Interfaces ───────────────────────────────────────────

export interface ScenarioItem {
  name: string;
  price?: number;
}

export interface Scenario {
  id: string;
  rubro: string;
  businessName: string;
  address: string;
  hoursText: string;
  instagram?: string;
  payments: {
    efectivo: boolean;
    transferencia: boolean;
    tarjeta: boolean;
  };
  extras: {
    delivery: boolean;
    retiro: boolean;
    petFriendly: boolean;
    comerLocal: boolean;
  };
  items?: ScenarioItem[];
  services?: ScenarioItem[];
}

export interface SimulationConfig {
  rubro: Rubro;
  style: Style;
  intents: Intent[];
  extras: Extra[];
  lang: 'es' | 'en';
}

export interface ChatLine {
  sender: 'user' | 'bot';
  text: string;
  timestamp?: string;
}

/** Which intents are supported by each rubro */
export const RUBRO_INTENTS: Record<string, Intent[]> = {
  [Rubro.HAMBURGUESERIA]: [Intent.PEDIR, Intent.PRECIOS, Intent.HORARIOS, Intent.UBICACION, Intent.PAGOS, Intent.DELIVERY_RETIRO, Intent.PROMOS],
  [Rubro.LOMITERIA]:      [Intent.PEDIR, Intent.PRECIOS, Intent.HORARIOS, Intent.UBICACION, Intent.PAGOS, Intent.DELIVERY_RETIRO, Intent.PROMOS],
  [Rubro.ESTETICA]:       [Intent.PRECIOS, Intent.HORARIOS, Intent.UBICACION, Intent.PAGOS, Intent.TURNO, Intent.PROMOS],
  [Rubro.CENTRO_SALUD]:   [Intent.PRECIOS, Intent.HORARIOS, Intent.UBICACION, Intent.PAGOS, Intent.TURNO],
  [Rubro.INDUMENTARIA]:   [Intent.PEDIR, Intent.PRECIOS, Intent.HORARIOS, Intent.UBICACION, Intent.PAGOS, Intent.DELIVERY_RETIRO, Intent.PROMOS],
  [Rubro.TALLER_MECANICO]:[Intent.PRECIOS, Intent.HORARIOS, Intent.UBICACION, Intent.PAGOS, Intent.PRESUPUESTO],
  [Rubro.GIMNASIO]:       [Intent.PRECIOS, Intent.HORARIOS, Intent.UBICACION, Intent.PAGOS, Intent.TURNO, Intent.PROMOS],
};
