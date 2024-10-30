import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Team } from '../Team';
@Injectable({
  providedIn: 'root'
})
export class TeamsServiceService {
  private Url = 'https://luismoraes7.github.io/Testes/brazilianteams.json'
  
  getTeams(): Observable<Team[]>{
    return this.http.get<Team[]>(this.Url)
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
    const updatedTeams = currentTeam.map(team => team.team === updatedTeam.team ? updatedTeam : team)
    this.teamsSubject.next(updatedTeams)
  }
}
