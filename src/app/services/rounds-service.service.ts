import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Rodada } from '../Rodada';

@Injectable({
  providedIn: 'root'
})
export class RoundsServiceService {
  private RoundUrl = 'https://luismoraes7.github.io/Testes/rodadas.json'
  constructor(private http: HttpClient) { }

  //? faz a requisição das rodadas do campeonato.
  getRounds() : Observable<Rodada[]>{
    return this.http.get<Rodada[]>(this.RoundUrl)
  }
}
