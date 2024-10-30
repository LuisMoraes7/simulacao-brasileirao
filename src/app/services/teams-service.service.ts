import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Team } from '../Team';
@Injectable({
  providedIn: 'root'
})
export class TeamsServiceService {
  private Url = 'https://luismoraes7.github.io/Testes/brazilianteams.json'

  // ? faz a requisição HTTP.
  getTeams(): void{
    if(this.teamsSubject.value.length === 0){
      this.http.get<Team[]>(this.Url).subscribe({
        next: (teams: Team[]) => {
          this.teamsSubject.next(teams)
        }, error: (err) => {
          console.error('Ocorreu um erro na requisição: ', err)
        }
      })

    }
  }
  //! cria um valor internamente e o transmite para todos os componentes ao ser atualizado.
  private teamsSubject = new BehaviorSubject<Team[]>([])

  //* o codigo externo observa este valor.
  teams$ = this.teamsSubject.asObservable()

  constructor(private http: HttpClient) { }

  //! atribui os times à variável.
  setTeams(teams: Team[]){
    this.teamsSubject.next(teams)
  }

  updateTeam(updatedTeam: Team){
    const currentTeam = this.teamsSubject.value

    // ! função básica para quando um time sofrer atualização, imediatamente seja atribuído uma propriedade "updated" para ele.
    const updatedTeams = currentTeam.map(team => {
      if (team.team === updatedTeam.team){
        return {...updatedTeam, updated: true}
      }
      return team
    })

    // ! o novo array com os times com update é repassado para o array original.
    this.teamsSubject.next(updatedTeams)
    // ! Atribui um tempo para negar a propriedade updated. Isso será usado para criar uma animação momentanea quando o usuário mudar a situação de um time na tabela geral.
    setTimeout(() => {
      const resetTeams = updatedTeams.map(team => ({ ...team, updated: false}))
      this.teamsSubject.next(resetTeams)
    }, 1000)
    }


}

