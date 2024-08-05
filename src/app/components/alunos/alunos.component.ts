import { Component, OnInit } from '@angular/core';
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

  constructor(private alunosService: AlunosService) { }

  ngOnInit(): void {
    this.carregarAlunos();
  }

  carregarAlunos(): void {
    this.alunosService.getAlunos().subscribe(
      (response: any) => {
        // Filtra valores nulos e garante que cada item tenha a propriedade 'nome' e 'categoria'
        this.alunos = (response || []).filter((aluno: any) => aluno && aluno.nome && aluno.categoria) as Aluno[];
      },
      (error) => {
        console.error('Erro ao carregar alunos:', error);
      }
    );
  }

  onAlunoChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const alunoNome = target.value;
    if (alunoNome) {
      this.selectedAluno = this.alunos.find(aluno => aluno.nome === alunoNome) || null;
      console.log('Aluno encontrado:', this.selectedAluno);
    }
  }
}
