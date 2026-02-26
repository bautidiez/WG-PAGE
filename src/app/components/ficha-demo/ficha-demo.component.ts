import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FichaService } from '../../services/ficha.service';
import { FichaResult, FormData } from '../../models';
import { TranslationService } from '../../services/translation.service';

export interface ProductoInput {
    nombre: string;
    precio: string;
}

export interface DiaInput {
    nombre: string;
    activo: boolean;
    startH: string;
    startM: string;
    endH: string;
    endM: string;
}

export const COUNTRY_CODES = [
    { iso: 'ar', abbr: 'ARG', code: '+54', name: 'Argentina' },
    { iso: 'bo', abbr: 'BOL', code: '+591', name: 'Bolivia' },
    { iso: 'br', abbr: 'BRA', code: '+55', name: 'Brasil' },
    { iso: 'cl', abbr: 'CHI', code: '+56', name: 'Chile' },
    { iso: 'co', abbr: 'COL', code: '+57', name: 'Colombia' },
    { iso: 'cr', abbr: 'CRI', code: '+506', name: 'Costa Rica' },
    { iso: 'cu', abbr: 'CUB', code: '+53', name: 'Cuba' },
    { iso: 'ec', abbr: 'ECU', code: '+593', name: 'Ecuador' },
    { iso: 'sv', abbr: 'SLV', code: '+503', name: 'El Salvador' },
    { iso: 'es', abbr: 'ESP', code: '+34', name: 'España' },
    { iso: 'us', abbr: 'USA', code: '+1', name: 'Estados Unidos/Canadá' },
    { iso: 'gt', abbr: 'GUA', code: '+502', name: 'Guatemala' },
    { iso: 'hn', abbr: 'HON', code: '+504', name: 'Honduras' },
    { iso: 'mx', abbr: 'MEX', code: '+52', name: 'México' },
    { iso: 'ni', abbr: 'NIC', code: '+505', name: 'Nicaragua' },
    { iso: 'pa', abbr: 'PAN', code: '+507', name: 'Panamá' },
    { iso: 'py', abbr: 'PAR', code: '+595', name: 'Paraguay' },
    { iso: 'pe', abbr: 'PER', code: '+51', name: 'Perú' },
    { iso: 'do', abbr: 'DOM', code: '+1', name: 'Rep. Dominicana' },
    { iso: 'uy', abbr: 'URU', code: '+598', name: 'Uruguay' },
    { iso: 've', abbr: 'VEN', code: '+58', name: 'Venezuela' }
];

export interface ModernFormData {
    nombre: string;
    rubro: string;
    ubicacion: string;

    // Horarios por día
    dias: DiaInput[];

    // Contacto
    hasWhatsapp: boolean;
    whatsappCode: string; // Nuevo: selector de país
    whatsapp: string;
    hasInstagram: boolean;
    instagram: string;

    // Productos Dinámicos
    productosList: ProductoInput[];

    // Atributos Extra
    petfriendly: boolean;
    pagoLocal: boolean;
    delivery: boolean;
    retiroLocal: boolean;
    pagoEfectivo: boolean;
    pagoTarjeta: boolean;
    linkPagoTarjeta: string;
    pagoTransferencia: boolean;
    aliasTransferencia: string;
}

@Component({
    selector: 'app-ficha-demo',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './ficha-demo.component.html',
    styleUrl: './ficha-demo.component.css'
})
export class FichaDemoComponent {

    private fichaService = inject(FichaService);
    readonly translation = inject(TranslationService);

    countryCodes = COUNTRY_CODES;
    hoursList: string[] = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    minutesList: string[] = ['00', '15', '30', '45'];

    showCountryDropdown = false;

    t(key: string): string { return this.translation.t(key); }

    modernData: ModernFormData = this.getDefaultModernData();
    fichaResult: FichaResult | null = null;
    isGenerated = false;
    isCopied = false;
    isGenerating = false;

    selectedFileName: string = '';

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFileName = file.name;
        }
    }

    // UI State for Wizard
    currentStep: number = 1;

    toggleCountryDropdown(): void {
        this.showCountryDropdown = !this.showCountryDropdown;
    }

    selectCountry(country: any): void {
        this.modernData.whatsappCode = country.code;
        this.showCountryDropdown = false;
    }

    get selectedCountry() {
        return this.countryCodes.find(c => c.code === this.modernData.whatsappCode) || this.countryCodes[0];
    }

    nextStep(): void {
        this.currentStep++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    prevStep(): void {
        if (this.currentStep > 1) {
            this.currentStep--;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    private getDefaultModernData(): ModernFormData {
        return {
            nombre: '', rubro: 'Gastronomía', ubicacion: '',
            dias: [
                { nombre: 'Lunes', activo: false, startH: '12', startM: '00', endH: '21', endM: '00' },
                { nombre: 'Martes', activo: false, startH: '12', startM: '00', endH: '21', endM: '00' },
                { nombre: 'Miércoles', activo: false, startH: '12', startM: '00', endH: '21', endM: '00' },
                { nombre: 'Jueves', activo: false, startH: '12', startM: '00', endH: '21', endM: '00' },
                { nombre: 'Viernes', activo: false, startH: '12', startM: '00', endH: '21', endM: '00' },
                { nombre: 'Sábado', activo: false, startH: '12', startM: '00', endH: '21', endM: '00' },
                { nombre: 'Domingo', activo: false, startH: '12', startM: '00', endH: '21', endM: '00' }
            ],
            hasWhatsapp: false, whatsappCode: '+54', whatsapp: '',
            hasInstagram: false, instagram: '',
            productosList: [{ nombre: '', precio: '' }], // Fila inicial vacía
            petfriendly: false,
            pagoLocal: false,
            delivery: false,
            retiroLocal: false,
            pagoEfectivo: false,
            pagoTarjeta: false,
            linkPagoTarjeta: '',
            pagoTransferencia: false,
            aliasTransferencia: ''
        };
    }

    agregarProducto(): void {
        this.modernData.productosList.push({ nombre: '', precio: '' });
    }

    quitarProducto(index: number): void {
        if (this.modernData.productosList.length > 1) {
            this.modernData.productosList.splice(index, 1);
        } else {
            // Empties the first row if it's the only one left
            this.modernData.productosList[0] = { nombre: '', precio: '' };
        }
    }

    aplicarHorarioTodos(): void {
        const lunes = this.modernData.dias[0];
        // Aplica a martes (1) hasta domingo (6)
        for (let i = 1; i <= 6; i++) {
            this.modernData.dias[i].activo = lunes.activo;
            this.modernData.dias[i].startH = lunes.startH;
            this.modernData.dias[i].startM = lunes.startM;
            this.modernData.dias[i].endH = lunes.endH;
            this.modernData.dias[i].endM = lunes.endM;
        }
    }

    private compileLegacyData(): FormData {
        // Compile horarios interactivos
        let horariosText = '';
        this.modernData.dias.forEach(dia => {
            if (dia.activo) {
                horariosText += `${dia.nombre}: ${dia.startH}:${dia.startM} a ${dia.endH}:${dia.endM}hs\n`;
            }
        });
        if (!horariosText) horariosText = 'Consultar horarios';

        // Compile redes
        let redesText = '';
        if (this.modernData.hasWhatsapp && this.modernData.whatsapp) {
            redesText += `WhatsApp: ${this.modernData.whatsappCode} ${this.modernData.whatsapp}\n`;
        }
        if (this.modernData.hasInstagram && this.modernData.instagram) {
            redesText += `Instagram: ${this.modernData.instagram}\n`;
        }

        // Compile Extra Attributes
        let extras = [];
        if (this.modernData.petfriendly) extras.push('Petfriendly (Aceptamos mascotas)');
        if (this.modernData.delivery) extras.push('Delivery / Envío a domicilio disponible');
        if (this.modernData.retiroLocal) extras.push('Retiro en el local disponible (Takeaway)');

        let pagos = [];
        if (this.modernData.pagoLocal) pagos.push('Cobro en el local físico');
        if (this.modernData.pagoEfectivo) pagos.push('Efectivo');

        if (this.modernData.pagoTransferencia) {
            let t = 'Transferencia / Billetera Virtual';
            if (this.modernData.aliasTransferencia.trim()) {
                t += ` (Alias/CVU: ${this.modernData.aliasTransferencia.trim()})`;
            }
            pagos.push(t);
        }

        if (this.modernData.pagoTarjeta) {
            let t = 'Tarjetas de débito/crédito';
            if (this.modernData.linkPagoTarjeta.trim()) {
                t += ` (Link de pago: ${this.modernData.linkPagoTarjeta.trim()})`;
            }
            pagos.push(t);
        }

        // Inject Nombre y Rubro y Extras al inicio del menú para que la IA estructurada los procese
        let menuBase = `${this.modernData.nombre}\n${this.modernData.rubro}\n\n`;

        if (extras.length > 0) menuBase += `INFORMACIÓN ADICIONAL:\n- ${extras.join('\n- ')}\n\n`;
        if (pagos.length > 0) menuBase += `MÉTODOS DE PAGO ACORDADOS:\n- ${pagos.join('\n- ')}\n\n`;

        // Compile Productos Dinámicos
        const validProducts = this.modernData.productosList.filter(p => p.nombre.trim());
        if (validProducts.length > 0) {
            menuBase += `PRODUCTOS O SERVICIOS DESTACADOS\n`;
            validProducts.forEach(p => {
                if (p.precio.trim()) {
                    menuBase += `${p.nombre} - $${p.precio.replace('$', '')}\n`;
                } else {
                    menuBase += `${p.nombre}\n`;
                }
            });
        }

        return {
            menu: menuBase,
            horarios: horariosText.trim(),
            ubicacion: this.modernData.ubicacion,
            redes: redesText.trim()
        };
    }

    generateFicha(): void {
        const hasBasicData = this.modernData.nombre.trim() || this.modernData.productosList.some(p => p.nombre.trim());
        if (!hasBasicData && !this.modernData.ubicacion.trim()) return;

        this.isGenerating = true;
        this.isGenerated = false;

        const legacyFormData = this.compileLegacyData();

        setTimeout(() => {
            this.fichaResult = this.fichaService.procesarMenu(legacyFormData);
            this.isGenerating = false;
            this.isGenerated = true;
        }, 900);
    }

    activarAgente(): void {
        if (!this.fichaResult) return;
        const msg = `¡Hola! Quiero activar mi Agente IA con los siguientes datos:\n\n` +
            `🏪 *${this.fichaResult.nombre}* — ${this.fichaResult.rubro}\n\n` +
            `${this.fichaResult.rawText.slice(0, 600)}`;
        const url = `https://wa.me/5493584171716?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    }

    copyToClipboard(): void {
        if (!this.fichaResult) return;
        navigator.clipboard.writeText(this.fichaResult.rawText).then(() => {
            this.isCopied = true;
            setTimeout(() => this.isCopied = false, 2500);
        });
    }

    resetDemo(): void {
        this.modernData = this.getDefaultModernData();
        this.fichaResult = null;
        this.isGenerated = false;
        this.isCopied = false;
    }
}
