import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RoomTypesService } from '../roomtypes.service';

@Injectable()
export class MockRoomTypesService extends RoomTypesService {

  // Mock para o método insertRoomTypes
  override insertRoomTypes(params: any): Observable<any> {
    // Simula sucesso, retornando o mesmo objeto enviado para o POST.
    return of({ success: true, roomType: params });
  }
}