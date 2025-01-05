import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';  // Make sure to import this if using headers
import { RoomTypesService } from '../roomtypes.service';

@Injectable()
export class MockRoomTypesService extends RoomTypesService {

  private roomTypes = [
    {      
      code: 'SR011234',
      designacao: 'Single Room',
      descricao: 'A standard single room with basic amenities.',
      surgerySuitable: true,          
    },
    {      
      code: 'SR0112-123',
      designacao: 'Poli Room',
      descricao: 'A multiple single room with basic amenities.',
      surgerySuitable: true,   
    },
  ];

  override insertRoomTypes(params: any): Observable<any> {
    return of({ success: true, roomType: params });
  }


  override getAllRoomTypes(): Observable<any[]> {
    return of(this.roomTypes);  
  }


  override getByCode(id: string): Observable<any> {
    const roomType = this.roomTypes.find(rt => rt.code === id);
    return of(roomType);  
  }


  override update(updatedData: any): Observable<any> {   
    return of({ success: true, updatedRoomType: updatedData });
  }
}
