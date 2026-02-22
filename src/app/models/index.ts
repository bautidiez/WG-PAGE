// ============================================================
//  SHARED INTERFACES — WG Page
// ============================================================

export interface Benefit {
    icon: string;
    title: string;
    description: string;
}

export interface Plan {
    name: string;
    price: string;
    features: string[];
}

export interface TimelineStep {
    day: string;
    title: string;
    description: string;
    checklist: string[];
}

export interface ExchangeRate {
    blue: number;
    oficial: number;
    timestamp: Date;
}

export interface CommitmentItem {
    title: string;
    description: string;
}

// ——— Ficha Demo ———
export interface HorarioRow {
    dias: string;
    horas: string;
}

export interface ProductoItem {
    nombre: string;
    precio?: string;
}

export interface ProductoCategoria {
    categoria: string;
    items: ProductoItem[];
}

export interface FichaResult {
    nombre: string;
    rubro: string;
    descripcion: string;
    horarios: HorarioRow[];
    ubicacion: string;
    contacto: string[];
    productos: ProductoCategoria[];
    destacados: string[];
    rawText: string;
}

export interface FormData {
    menu: string;
    horarios: string;
    ubicacion: string;
    redes: string;
}
