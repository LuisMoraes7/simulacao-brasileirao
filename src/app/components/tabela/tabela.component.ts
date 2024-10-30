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
  
 sortedTeams: Team[] = []

  ngOnInit(): void{
    const storedData = localStorage.getItem('teamData')
    if (storedData){
      this.sortedTeams = JSON.parse(storedData)
    } else{
      this.getTeams()
    }
  }
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private teamService: TeamsServiceService){
      this.teamService.teams$.subscribe((teams: Team[]) => {
        this.getTeams()
      })
  }

  
  getTeams(): void{
    this.teamService.getTeams().subscribe({
      next: (teams: Team[]) => {
        this.sortedTeams = teams.sort((a, b) => a.index - b.index)
        this.dataSourceTop10.data = this.sortedTeams.slice(0, 10)
        this.dataSourceBottom10.data = this.sortedTeams.slice(10, 20)
        this.dataSourceTop10.sort = this.sort
        this.dataSourceBottom10.sort = this.sort
        console.log(this.dataSourceTop10)
        console.log(this.dataSourceBottom10)

        // localStorage.setItem('teamData', JSON.stringify(teams))
      }, error: (err) => {
        console.error('Errooo: ', err)
      }
    })
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
}
