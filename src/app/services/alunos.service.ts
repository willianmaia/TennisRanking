import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Aluno } from '../models/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class AlunosService {
  private apiUrl = 'https://node-express-server-eta.vercel.app/alunos';

  constructor(private http: HttpClient) { }

  criarAluno(aluno: Aluno): Observable<Aluno> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.post<Aluno>(this.apiUrl, aluno, { headers });
  }

  getAlunos(): Observable<Aluno[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });

    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      map(dados => {
        return (dados || []).filter(dado => dado !== null).map(dado => {
          if (typeof dado === 'string') {
            return { nome: dado, categoria: 'não especificada' } as Aluno;
          }
          // Assegura que 'categoria' é definida; se não, usa 'não especificada'
          return { nome: dado.nome, categoria: dado.categoria || 'não especificada' } as Aluno;
        });
      })
    );
  }

  getAlunoByCategoria(categoria: string): Observable<Aluno[]> {
    const url = `${this.apiUrl}/${categoria}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'  
    });

    return this.http.get<any[]>(url, { headers }).pipe(
      map(dados => {
        return (dados || []).filter(dado => dado !== null).map(dado => {
          if (typeof dado === 'string') {
            return { nome: dado, categoria: 'não especificada' } as Aluno;
          }
          // Assegura que 'categoria' é definida; se não, usa 'não especificada'
          return { nome: dado.nome, categoria: dado.categoria || 'não especificada' } as Aluno;
        });
      })
    );
  }

  deleteAluno(nome: string): Observable<void> {
    const url = `${this.apiUrl}/${nome}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.delete<void>(url, { headers });
  }
}
