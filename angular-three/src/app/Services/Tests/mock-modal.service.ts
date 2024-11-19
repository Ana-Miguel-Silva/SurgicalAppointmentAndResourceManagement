import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModalService } from '../modal.service';


@Injectable({
  providedIn: 'root'
})

export class MockModalService {
  private modalStates: Map<string, boolean> = new Map();

  openModal(modalId: string): void {
    this.modalStates.set(modalId, true);
  }

  closeModal(modalId: string): void {
    this.modalStates.set(modalId, false);
  }

  isModalOpen(modalId: string): boolean {
    return this.modalStates.get(modalId) || false;
  }
}