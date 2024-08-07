import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlunosService } from '../../services/alunos.service';
import { Aluno } from '../../models/aluno.model';

@Component({
  selector: 'app-alunos',
  templateUrl: './alunos.component.html',
  styleUrls: ['./alunos.component.css']
})
export class AlunosComponent implements OnInit {
  alunos: Aluno[] = [];
  selectedAluno: Aluno | null = null;

  constructor(private alunosService: AlunosService, private router: Router) { }

  ngOnInit(): void {
    this.carregarAlunos();
  }

  carregarAlunos(): void {
    this.alunosService.getAlunos().subscribe(
      (alunos: Aluno[]) => {
        console.log('Alunos recebidos:', alunos);
        this.alunos = (alunos || []).filter(aluno => aluno !== null);
      },
      (error) => {
        console.error('Erro ao carregar alunos:', error);
      }
    );
  }

  onCategoriaChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const categoria = selectElement.value;
    if (categoria) {
      this.alunosService.getAlunoByCategoria(categoria).subscribe(
        (alunos: Aluno[]) => {
          console.log('Alunos filtrados:', alunos);
          this.alunos = alunos;
        },
        (error) => {
          console.error('Erro ao filtrar alunos:', error);
        }
      );
    } else {
      this.carregarAlunos(); // Carrega todos os alunos se nenhum filtro for selecionado
    }
  }

  onAlunoClick(aluno: Aluno): void {
    this.router.navigate(['/aluno-detalhe', aluno.nome]);
  }
}
