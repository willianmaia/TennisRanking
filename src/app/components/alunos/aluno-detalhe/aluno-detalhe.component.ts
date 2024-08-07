import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlunosService } from '../../../services/alunos.service';

@Component({
  selector: 'app-aluno-detalhe',
  templateUrl: './aluno-detalhe.component.html',
  styleUrls: ['./aluno-detalhe.component.css']
})
export class AlunoDetalheComponent implements OnInit {
  nome: string | null = '';
  anotacao: string = '';

  constructor(private route: ActivatedRoute, private alunosService: AlunosService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.nome = params.get('nome');
      if (this.nome) {
        this.carregarAnotacao(this.nome);
      }
    });
  }

  carregarAnotacao(nome: string): void {
    this.alunosService.getAnotacaoAluno(nome).subscribe({
      next: (res) => {
        this.anotacao = res.anotacao || ''; // Se a anotação não existir, mantém em branco
      },
      error: (err) => {
        console.error('Erro ao obter anotação:', err);
        this.anotacao = ''; // Mantém em branco se houver um erro
      }
    });
  }

  salvarAnotacao(): void {
    if (this.nome) {
      this.alunosService.salvarAnotacaoAluno(this.nome, this.anotacao).subscribe(
        response => {
          console.log('Anotação salva com sucesso:', response);
          alert('Anotação salva com sucesso!');
        },
        error => {
          console.error('Erro ao salvar anotação:', error);
          alert('Erro ao salvar anotação.');
        }
      );
    }
  }
}
