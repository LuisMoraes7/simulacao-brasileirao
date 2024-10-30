import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Team } from '../Team';
@Injectable({
  providedIn: 'root'
})
export class TeamsServiceService {
  private Url = 'https://luismoraes7.github.io/Testes/brazilianteams.json'
  
  // getTeams(): Observable<Team[]>{
  //   return this.http.get<Team[]>(this.Url)
  // }
  getTeams(): void{
    if(this.teamsSubject.value.length === 0){
      this.http.get<Team[]>(this.Url).subscribe({
        next: (teams: Team[]) => {
          this.teamsSubject.next(teams)
          // localStorage.setItem('teamData', JSON.stringify(teams))
        }, error: (err) => {
          console.error('ERRROOOO: ', err)
        }
      })

    }
  }
  private teamsSubject = new BehaviorSubject<Team[]>([])
  teams$ = this.teamsSubject.asObservable()

  constructor(private http: HttpClient) { 
    
   }

  setTeams(teams: Team[]){
    this.teamsSubject.next(teams)
  }

  updateTeam(updatedTeam: Team){
    const currentTeam = this.teamsSubject.value
    // console.log(currentTeam)
    const updatedTeams = currentTeam.map(team => {
      if (team.team === updatedTeam.team){
        return {...updatedTeam, updated: true}
      }
      return team
      // (team.team === updatedTeam.team ? updatedTeam : team)
    })

    this.teamsSubject.next(updatedTeams)
    setTimeout(() => {
      const resetTeams = updatedTeams.map(team => ({ ...team, updated: false}))
      this.teamsSubject.next(resetTeams)
      console.log('uepa')
    }, 1000)
    }
  
    // console.log(updatedTeam)
    // console.log(updatedTeams)


}

