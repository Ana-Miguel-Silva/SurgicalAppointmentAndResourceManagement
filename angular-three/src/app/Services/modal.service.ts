import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

@Injectable()
export class ModalService {
  private modalStates: Map<string, boolean> = new Map();

  // Abre o modal especificado pelo ID
  openModal(modalId: string): void {
    this.modalStates.set(modalId, true);
  }

  // Fecha o modal especificado pelo ID
  closeModal(modalId: string): void {
    this.modalStates.set(modalId, false);
  }

  // Retorna o estado de abertura do modal
  isModalOpen(modalId: string): boolean {
    return this.modalStates.get(modalId) || false;
  }
}
