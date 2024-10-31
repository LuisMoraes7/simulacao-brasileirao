import { Component, NgModule, ViewChild } from '@angular/core';
import { PalpitesComponent } from "../palpites/palpites.component";
import { TeamsServiceService } from '../../services/teams-service.service';
import { Team } from '../../Team';
import { NgStyle, NgClass } from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-tabela',
  standalone: true,
  imports: [PalpitesComponent, NgStyle, MatTableModule, MatSort, NgClass, MatIconModule],
  templateUrl: './tabela.component.html',
  styleUrl: './tabela.component.css'
})
export class TabelaComponent {
  
 sortedTeams: Team[] = []
 round_value = 32

 //! Aumenta o valor de round_value
increaseButton(){
  if (this.round_value < 38){
    this.round_value += 1
  }
}
//! Diminui o valor de round_value
decreaseButton(){
  if (this.round_value > 32){
    this.round_value -= 1
  }
}

  // ao iniciar o componente, faça a requisição do array de times.
  ngOnInit(): void{
    this.teamService.getTeams()
    this.teamService.teams$.subscribe((teams: Team[])=> {
      this.getTeams(teams)
    })
  }
  //* serve para eventualmente ordenar os times na TABELA.
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private teamService: TeamsServiceService){}

  
  getTeams(teams: Team[]): void{
    //* ordena os times com base na lógica de posições no campeonato brasileiro NO ARRAY.

    this.sortedTeams = teams.sort((a, b) => {
      if (b.points === a.points){
        if (b.vitorias === a.vitorias){
          return b.saldo - a.saldo
        }
        return b.vitorias - a.vitorias
      }
      return b.points - a.points
      
    })

    //* para cada time adicione um index. Isso eventualmente servirá para atualizar as posições de um time quando o usuário movimentar a tabela.
    this.sortedTeams.forEach((team, index) => {
      team.index = index + 1
    })

    // divide os dados para duas tabelas, uma dos times de 1 a 10 e outra com times de 11 a 20.
    this.dataSourceTop10.data = this.sortedTeams.slice(0, 10)
    this.dataSourceBottom10.data = this.sortedTeams.slice(10, 20)

    //ordena a tabela
    this.dataSourceTop10.sort = this.sort
    this.dataSourceBottom10.sort = this.sort
  }

  //colunas da tabela  
  displayedColumns: string[] = ['number', 'P', 'J', 'V', 'SG', 'GP']
  
  //cria uma tabela para cada array
  dataSourceTop10 = new MatTableDataSource<Team>([])
  dataSourceBottom10 = new MatTableDataSource<Team>([])
  
  //analisa a posição de um time e atribui uma cor especifica ao seu index.
  getColor(num?: number): string{
    
    if (num != null) {
      if (num <= 4){
        return 'blue'
      } else if (num == 5 || num == 6){
        return 'rgb(24, 255, 236)'
      } else if (num >= 7 && num <= 12){
        return 'rgb(34, 247, 27)'
      } else if (num >= 13 && num <= 16){
        return 'gray'
      } else{
        return 'red'
      }
    } else{
      return 'white'
    }
    }

    //! ao ser atualizado, componente vai ter o fundo verde.
    getBackColor(updated: boolean){
      if (updated == true) {
        return 'rgb(0, 255, 34)'
      } else{
        return undefined
      }
    }

    //! função para reforçar visualmente que a partir da última rodada a seta direita fica irrelevante e na primeira rodada a seta esquerda também.
    getArrowColor(currentArrow: string, currentRound: number): string{
      if (currentRound == 32 && currentArrow == 'back'){
        return 'gray'
      } else if (currentRound == 38 && currentArrow == 'forward'){
        return 'gray'
      } else{
        return ''
      }
    }
}
