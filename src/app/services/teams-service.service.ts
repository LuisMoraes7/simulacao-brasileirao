import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Team } from '../Team';
@Injectable({
  providedIn: 'root'
})
export class TeamsServiceService {
  private Url = 'https://luismoraes7.github.io/Testes/brazilianteams.json'
  constructor(private http: HttpClient) { }

  getTeams(): Observable<Team[]>{
    return this.http.get<Team[]>(this.Url)
  }
}
