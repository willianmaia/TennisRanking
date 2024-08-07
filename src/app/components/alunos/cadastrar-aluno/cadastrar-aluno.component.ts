import { Component } from '@angular/core';
import { AlunosService } from '../../../services/alunos.service';
import { Aluno } from '../../../models/aluno.model';

@Component({
  selector: 'app-cadastrar-aluno',
  templateUrl: './cadastrar-aluno.component.html',
  styleUrls: ['./cadastrar-aluno.component.css']
})
export class CadastrarAlunoComponent {
  aluno: Aluno = {
    nome: '',
    categoria: ''
  };

  constructor(private alunosService: AlunosService) { }

  onSubmit(): void {
    this.alunosService.criarAluno(this.aluno).subscribe(
      (response) => {
        console.log('Aluno cadastrado com sucesso:', response);
        alert('Aluno cadastrado com sucesso');
          this.limparFormulario();
      },
      (error) => {
        console.error('Erro ao cadastrar aluno:', error);
      }
    );
  }

  limparFormulario(): void {
    this.aluno.nome = '';
    this.aluno.categoria = '';
  }
}
