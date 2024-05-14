import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Torneio } from '../models/torneio.model';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TorneioService {
  private apiUrl = 'https://node-express-server-eta.vercel.app/torneios';

  constructor(private http: HttpClient) { }

  getTorneios(): Observable<Torneio[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.get<Torneio[]>(this.apiUrl, { headers }).pipe(
      map(torneios => torneios.filter(torneio => torneio !== null))
    );
  }

  getTorneioById(id: string): Observable<Torneio> {
    const url = `${this.apiUrl}/${id}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.get<Torneio>(url, { headers });
  }
}
