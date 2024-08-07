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
