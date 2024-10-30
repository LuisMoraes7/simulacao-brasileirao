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
 round_value = 31
 
increaseButton(){
  if (this.round_value < 38){
    this.round_value += 1
  }
}

decreaseButton(){
  if (this.round_value > 31){
    this.round_value -= 1
  }
}

  ngOnInit(): void{
    this.teamService.getTeams()
    this.teamService.teams$.subscribe((teams: Team[])=> {
      this.getTeams(teams)
    })
  }
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private teamService: TeamsServiceService){
      // this.teamService.teams$.subscribe((teams: Team[]) => {
      //   this.getTeams()
      // })
  }

  
  getTeams(teams: Team[]): void{

    this.sortedTeams = teams.sort((a, b) => {
      if (b.points === a.points){
        if (b.saldo === a.saldo){
          return b.vitorias - a.vitorias
        }
        return b.saldo - a.saldo
        
      }
      return b.points - a.points
      
    })
    this.sortedTeams.forEach((team, index) => {
      team.index = index + 1
    })
    this.dataSourceTop10.data = this.sortedTeams.slice(0, 10)
    this.dataSourceBottom10.data = this.sortedTeams.slice(10, 20)
    this.dataSourceTop10.sort = this.sort
    this.dataSourceBottom10.sort = this.sort
  }

  
  displayedColumns: string[] = ['number', 'P', 'J', 'V', 'SG', 'GP']
  
  dataSourceTop10 = new MatTableDataSource<Team>([])
  dataSourceBottom10 = new MatTableDataSource<Team>([])
  
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

    getBackColor(updated: boolean){
      if (updated == true) {
        return 'green'
      } else{
        return undefined
      }
    }
}
