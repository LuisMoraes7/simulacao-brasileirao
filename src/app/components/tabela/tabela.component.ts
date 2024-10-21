import { Component, NgModule, ViewChild } from '@angular/core';
import { PalpitesComponent } from "../palpites/palpites.component";
import { TeamsServiceService } from '../../services/teams-service.service';
import { Team } from '../../Team';
import { NgStyle } from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-tabela',
  standalone: true,
  imports: [PalpitesComponent, NgStyle, MatTableModule, MatSort],
  templateUrl: './tabela.component.html',
  styleUrl: './tabela.component.css'
})
export class TabelaComponent {
 
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private teamService: TeamsServiceService){
    this.getTeams()
  }
  getTeams(): void{
    this.teamService.getTeams().subscribe({
      next: (teams: Team[]) => {
        this.dataSource.data = teams.sort((a, b) => a.index - b.index)
        this.dataSource.sort = this.sort
        console.log(this.dataSource)
      }, error: (err) => {
        console.error('Errooo: ', err)
      }
    })
  }


  displayedColumns: string[] = ['number', 'P', 'J', 'V', 'SG', 'GP']
  dataSource = new MatTableDataSource<Team>([])

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
}
