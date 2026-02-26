import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-vincular',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vincular.html',
  styleUrl: './vincular.css'
})
export class Vincular implements OnInit {
  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);

  businessId: string | null = null;
  businessName: string = '';

  isLoading = true;
  isValid = false;
  isLinking = false;
  linkSuccess = false;
  errorMsg = '';

  async ngOnInit() {
    this.businessId = this.route.snapshot.paramMap.get('uid');

    if (this.businessId) {
      await this.verifyBusiness(this.businessId);
    } else {
      this.errorMsg = 'Código QR inválido o enlace corrupto.';
      this.isLoading = false;
    }
  }

  async verifyBusiness(uid: string) {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        this.businessName = data['empresa'] || data['nombre'] || 'este negocio';
        this.isValid = true;
      } else {
        this.errorMsg = 'El negocio escaneado no existe o fue dado de baja.';
      }
    } catch (error) {
      console.error('Error al verificar:', error);
      this.errorMsg = 'Error de conexión. Intenta escanear nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }

  async confirmConnection() {
    if (!this.businessId || !this.isValid) return;

    this.isLinking = true;
    this.errorMsg = '';

    try {
      // Registrar un nuevo documento en la subcolección 'vinculaciones'
      const vinculacionesRef = collection(this.firestore, `users/${this.businessId}/vinculaciones`);

      const newConnection = {
        fecha: new Date().toISOString(),
        dispositivo: navigator.userAgent || 'Dispositivo Desconocido',
        estado: 'activo'
      };

      await addDoc(vinculacionesRef, newConnection);

      this.linkSuccess = true;
    } catch (error) {
      console.error('Error vinculando:', error);
      this.errorMsg = 'No pudimos procesar la vinculación. Reintentá por favor.';
    } finally {
      this.isLinking = false;
    }
  }
}
