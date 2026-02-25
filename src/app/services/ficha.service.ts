import { Injectable } from '@angular/core';
import { FichaResult, FormData, HorarioRow, ProductoCategoria, ProductoItem } from '../models';

@Injectable({ providedIn: 'root' })
export class FichaService {

    private readonly abreviaciones: Record<string, string> = {
        'muzza': 'muzzarella', 'muzz': 'muzzarella', 'napol': 'napolitana',
        'esp': 'especial', 'jyq': 'jamón y queso', 'j y q': 'jamón y queso',
        'ham': 'jamón', 'champ': 'champiñones', 'wisk': 'whisky',
        'ck': 'con', 'p/': 'para', 'x': 'por', 'telf': 'teléfono',
        'tel': 'teléfono', 'cel': 'celular', 'dom': 'domicilio',
        'lun': 'lunes', 'mar': 'martes', 'mie': 'miércoles', 'mié': 'miércoles',
        'jue': 'jueves', 'vie': 'viernes', 'sab': 'sábado', 'sab.': 'sábado',
        'dom.': 'domingo', 'hs': 'hs', 'hrs': 'hs'
    };

    procesarMenu(formData: FormData): FichaResult {
        const menu = this.cleanText(formData.menu);
        const horarios = this.cleanText(formData.horarios);
        const ubicacion = this.cleanText(formData.ubicacion);
        const redes = this.cleanText(formData.redes);

        const productos = this.parseProductos(menu);
        const destacados = this.extractDestacados(productos);
        const horariosFormateados = this.parseHorarios(horarios);
        const contactoLinks = this.parseContacto(redes);
        const { nombre, rubro } = this.inferNombreRubro(formData.menu, redes, ubicacion);
        const descripcion = this.generarDescripcion(nombre, rubro, productos, horariosFormateados, formData.menu);

        const rawText = this.buildRawText({ nombre, rubro, descripcion, horarios: horariosFormateados, ubicacion, contacto: contactoLinks, productos, destacados });

        return { nombre, rubro, descripcion, horarios: horariosFormateados, ubicacion, contacto: contactoLinks, productos, destacados, rawText };
    }

    private cleanText(text: string): string {
        if (!text) return '';
        let result = text.trim();
        Object.entries(this.abreviaciones).forEach(([abbr, full]) => {
            const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
            result = result.replace(regex, full);
        });
        const lines = result.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        return [...new Set(lines)].join('\n');
    }

    private inferNombreRubro(menu: string, redes: string, ubicacion: string): { nombre: string; rubro: string } {
        const combined = (menu + ' ' + redes + ' ' + ubicacion).toLowerCase();
        const firstLine = menu.split('\n')[0]?.trim() || '';
        const hasPrice = /\d+/.test(firstLine);
        const nombre = (!hasPrice && firstLine.length > 2 && firstLine.length < 60)
            ? this.capitalizar(firstLine) : 'El Negocio';

        let rubro = 'Comercio Local';
        if (/pizza|milanesa|empanada|burger|hamburguesa|parrilla|sushi|pasta|delivery/i.test(combined)) rubro = 'Gastronomía / Delivery';
        else if (/kinesio|kinesiolog|fisio|rehabilita|masaje|salud/i.test(combined)) rubro = 'Centro de Salud / Kinesiología';
        else if (/ropa|vestido|remera|pantalon|calzado|moda|indumentaria/i.test(combined)) rubro = 'Indumentaria / Moda';
        else if (/peluquer|barberia|barber|salon de belleza|manicura|facial/i.test(combined)) rubro = 'Estética / Peluquería';
        else if (/taller|mecani|auto|freno|aceite|service/i.test(combined)) rubro = 'Taller Mecánico / Automotriz';
        else if (/farmac|medicament|remedios/i.test(combined)) rubro = 'Farmacia';
        else if (/ferretera|herramienta|pintura|material/i.test(combined)) rubro = 'Ferretería / Materiales';
        else if (/veterinar|mascota|perro|gato|pet/i.test(combined)) rubro = 'Veterinaria / Mascotas';
        else if (/panaderia|panadería|torta|pastelería|factura|medialunas/i.test(combined)) rubro = 'Panadería / Pastelería';

        return { nombre, rubro };
    }

    private generarDescripcion(nombre: string, rubro: string, productos: ProductoCategoria[], horarios: HorarioRow[], rawMenu: string): string {
        const numItems = productos.reduce((acc, cat) => acc + cat.items.length, 0);
        const tiene_delivery = /delivery|pedido|envio|envío|domicilio/i.test(rawMenu);
        const tiene_local = /local|salon|salón|mesa|lugar/i.test(rawMenu);
        let desc = `${nombre} es un emprendimiento de ${rubro.toLowerCase()} con atención personalizada.`;
        if (numItems > 0) desc += ` Ofrecemos una excelente variedad de especialidades y productos para nuestros clientes.`;
        if (tiene_delivery) desc += ' Hacemos delivery a domicilio.';
        if (tiene_local) desc += ' Contamos con atención en el local.';
        return desc;
    }

    private parseProductos(text: string): ProductoCategoria[] {
        if (!text.trim()) return [];
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        const categorias: ProductoCategoria[] = [];
        let currentCat: ProductoCategoria | null = null;
        const precioRegex = /\$?\s?[\d.,]+\s?\$?/;
        const categoriaRegex = /^([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{2,30}):?\s*$/;

        for (const line of lines) {
            const isCategoria = categoriaRegex.test(line) || (line.endsWith(':') && !precioRegex.test(line));
            if (isCategoria) {
                currentCat = { categoria: line.replace(':', '').trim(), items: [] };
                categorias.push(currentCat);
            } else {
                const priceMatch = line.match(/^(.*?)\s*[-–:]\s*(\$?[\d.,]+\s?\$?)\s*$/);
                const inlinePrice = line.match(/^(.*?)\s+(\$[\d.,]+)\s*$/);
                let nombre = line;
                let precio: string | undefined;
                if (priceMatch) { nombre = this.capitalizar(priceMatch[1].trim()); precio = priceMatch[2].trim(); }
                else if (inlinePrice) { nombre = this.capitalizar(inlinePrice[1].trim()); precio = inlinePrice[2].trim(); }
                else { nombre = this.capitalizar(line); }
                if (!currentCat) { currentCat = { categoria: 'Productos', items: [] }; categorias.push(currentCat); }
                currentCat.items.push({ nombre, precio });
            }
        }
        return categorias.filter(c => c.items.length > 0);
    }

    private extractDestacados(productos: ProductoCategoria[]): string[] {
        const dest: string[] = [];
        for (const cat of productos) {
            if (cat.items[0]) dest.push(cat.items[0].nombre);
            if (dest.length >= 5) break;
        }
        return dest;
    }

    private parseHorarios(text: string): HorarioRow[] {
        if (!text.trim()) return [{ dias: 'Consultar disponibilidad', horas: '' }];
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        const result: HorarioRow[] = [];
        for (const line of lines) {
            const match = line.match(/^(.*?):?\s*(\d{1,2}[:.]?\d{0,2}\s*(?:a|–|-|hasta)\s*\d{1,2}[:.]?\d{0,2}\s*(?:hs|hrs|h)?)/i);
            const simpleMatch = line.match(/^(.*?)\s+([\d]{1,2}[:.]?\d{0,2}.+)$/);
            if (match) result.push({ dias: this.capitalizar(match[1].replace(':', '').trim()), horas: match[2].trim() });
            else if (simpleMatch) result.push({ dias: this.capitalizar(simpleMatch[1].trim()), horas: simpleMatch[2].trim() });
            else result.push({ dias: this.capitalizar(line), horas: '' });
        }
        return result.length > 0 ? result : [{ dias: 'Consultar disponibilidad', horas: '' }];
    }

    private parseContacto(redes: string): string[] {
        if (!redes.trim()) return [];
        return redes.split('\n').map(l => l.trim()).filter(l => l).map(line => {
            if (/instagram|ig\b|@/i.test(line)) return 'Instagram: ' + line.replace(/instagram:?/i, '').trim();
            if (/facebook|fb\b/i.test(line)) return 'Facebook: ' + line.replace(/facebook:?/i, '').trim();
            if (/whatsapp|wsp|wa\b/i.test(line)) return 'WhatsApp: ' + line.replace(/whatsapp:?|wsp:?|wa:/i, '').trim();
            if (/tiktok/i.test(line)) return 'TikTok: ' + line.replace(/tiktok:?/i, '').trim();
            if (/twitter|x\b/i.test(line)) return 'Twitter / X: ' + line.replace(/twitter:?/i, '').trim();
            if (/web|www\.|http/i.test(line)) return 'Web: ' + line.replace(/(web|sitio):?/i, '').trim();
            if (/\d{6,}/i.test(line)) return 'Tel: ' + line;
            return this.capitalizar(line);
        });
    }

    private buildRawText(ficha: Omit<FichaResult, 'rawText'>): string {
        let text = `${ficha.nombre}\n${ficha.rubro}\n\n`;
        text += `DESCRIPCION\n${ficha.descripcion}\n\n`;
        if (ficha.horarios.length > 0) {
            text += `HORARIOS\n`;
            ficha.horarios.forEach(h => { text += h.horas ? `${h.dias}: ${h.horas}\n` : `${h.dias}\n`; });
            text += '\n';
        }
        if (ficha.ubicacion) text += `UBICACION\n${ficha.ubicacion}\n\n`;
        if (ficha.contacto.length > 0) {
            text += `CONTACTO / REDES\n`;
            ficha.contacto.forEach(c => text += `${c}\n`);
            text += '\n';
        }
        if (ficha.productos.length > 0) {
            text += `PRODUCTOS / SERVICIOS\n`;
            ficha.productos.forEach(cat => {
                text += `\n${cat.categoria.toUpperCase()}\n`;
                cat.items.forEach(item => { text += item.precio ? `${item.nombre} - ${item.precio}\n` : `${item.nombre}\n`; });
            });
            text += '\n';
        }
        if (ficha.destacados.length > 0) {
            text += `DESTACADOS\n`;
            ficha.destacados.forEach(d => text += `- ${d}\n`);
        }
        return text.trim();
    }

    private capitalizar(str: string): string {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}
