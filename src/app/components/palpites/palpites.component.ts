import { Component, Input } from '@angular/core';
import { Team } from '../../Team';
import { RoundsServiceService } from '../../services/rounds-service.service';
import { Rodada } from '../../Rodada';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { time } from 'console';
import { TeamsServiceService } from '../../services/teams-service.service';

interface Guess{
  time1Guess: number | null;
  time2Guess: number | null;
}
@Component({
  selector: 'app-palpites',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './palpites.component.html',
  styleUrl: './palpites.component.css'
})
export class PalpitesComponent {
  @Input() teams!: Team[]
  rounds!: Rodada[]
  
  constructor(private RoundService: RoundsServiceService, private TeamsService: TeamsServiceService) {
    this.getRounds()
  }

  resumeName(name: string): string{
    if (name == "Atlético-MG"){
      return 'CAM'
    } else if (name == "Botafogo" || name == "Palmeiras" || name == "Cuiabá" || name == "Internacional" || name == "Flamengo" || name == "Corinthians" || name == "Cruzeiro" || name == "Juventude" || name == "Vasco" || name =="Bahia" || name == "Fluminense" || name == "Fortaleza" || name == "Vitória" || name == "Criciúma"){
      return name.slice(0, 3).toUpperCase();
    } else if (name == "Atlético-GO"){
      return "ACG"
    } else if(name == "São Paulo"){
      return "SAO"
    } else if(name == "Athletico-PR"){
      return "CAP"
    } else if(name == "Grêmio"){
      return "GRE"
    }
    else{
      return "RBB"
    }
  }

  
  rodada(time1: Team | undefined, time2: Team | undefined, goals1: number | null, goals2: number | null){
    if (time1 && time2 && goals1 && goals2){

      console.log(`Time 1 ante rodada: ${time1.team}, ${time1.vitorias}, ${time1.saldo}, ${time1.points}, ${time1.jogos}, ${time1.gols} com ${goals1} gols`)
      console.log(`Time 2 ante rodada: ${time2.team}, ${time2.vitorias}, ${time2.saldo}, ${time2.points}, ${time2.jogos}, ${time2.gols} com ${goals2} gols`)
      let result: string  
      if (goals1 > goals2){
        result = time1.team
      } else if (goals2 > goals1){
        result = time2.team
      } else{
        result = 'Empate'
      }
      let diferenca = goals1 - goals2
      time1.jogos += 1
      time2.jogos += 1
      time1.gols += goals1
      time2.gols += goals2
      if (result == time1.team){
        time1.points += 3
        time1.vitorias += 1
        if (diferenca < 0){
          time1.saldo += diferenca * -1
          time2.saldo += diferenca
        } else{
          time1.saldo += diferenca
          time2.saldo -= diferenca
        }
      } else if (result == time2.team){
        time2.points += 3
        time2.vitorias += 1
        if (diferenca < 0){
          time2.saldo += diferenca * -1
          time1.saldo += diferenca
        } else{
          time2.saldo += diferenca
          time1.saldo -= diferenca
        }
      } else{
        time1.points += 1
        time2.points += 1
      }
      console.log(`Time 1 pós rodada: ${time1.team}, ${time1.vitorias}, ${time1.saldo}, ${time1.points}, ${time1.jogos}, ${time1.gols} com ${goals1} gols`)
      console.log(`Time 2 pós rodada: ${time2.team}, ${time2.vitorias}, ${time2.saldo}, ${time2.points}, ${time2.jogos}, ${time2.gols} com ${goals2} gols`)
    }
    
  }
  
  
  
  validateInput(event: any, time: string){
    const input = event.target as HTMLInputElement
    let value = parseInt(input.value, 10)
    if (value < 0){
      input.value = '0'
    } else if (value > 9){
      input.value = '9'
    }
    
    
    
    
  }
  
  traduceTeam(teamName: string){
    const traducedTeam = this.teams.find(team => team.team === teamName)
    return traducedTeam

  }

  guesses: Guess[] = []

  ngOnInit(){
    this.rounds.forEach(() => {
      this.guesses.push({ time1Guess: null, time2Guess: null})})
  }

  submitGuess(time1: string, time2: string, index: number){
    const time1Obj = this.traduceTeam(time1)
    console.log(time1, time1Obj) 
    const time2Obj = this.traduceTeam(time2)
    console.log(time2, time2Obj)
    
    
    
    
    const guess1 = this.guesses[index].time1Guess
    const guess2 = this.guesses[index].time2Guess
    
    if (time1Obj && time2Obj !== undefined && guess1 !== null && guess2 !== null){
      this.rodada(time1Obj, time2Obj, guess1, guess2)
      this.TeamsService.updateTeam(time1Obj)
      this.TeamsService.updateTeam(time2Obj)

    }
    console.log(guess1)
    
    console.log(guess2)
  }
  

  getRounds(): void{
    this.RoundService.getRounds().subscribe({
      next: (rounds: Rodada[]) => {
        this.rounds = rounds.sort((a, b) => a.rodada - b.rodada)
        console.log(this.rounds)
      }, error: (err) => {
        console.error('Errooo: ', err)
      }
    })
  }
}
