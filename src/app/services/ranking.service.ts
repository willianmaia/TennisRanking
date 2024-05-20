import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ranking } from '../models/ranking.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private apiUrl = 'https://node-express-server-eta.vercel.app/rankings';

  constructor(private http: HttpClient) { }

  getRankings(): Observable<Ranking[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.get<Ranking[]>(this.apiUrl, { headers });
  }

  getRankingById(id: string): Observable<Ranking> {
    const url = `${this.apiUrl}/${id}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.get<Ranking>(url, { headers });
  }

  criarRanking(novoRanking: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.apiUrl, novoRanking, { headers });
  }
}

