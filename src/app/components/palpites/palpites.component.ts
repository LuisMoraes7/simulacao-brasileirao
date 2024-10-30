import { Component, Input, ViewChild } from '@angular/core';
import { Team } from '../../Team';
import { RoundsServiceService } from '../../services/rounds-service.service';
import { Rodada } from '../../Rodada';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { time } from 'console';
import { TeamsServiceService } from '../../services/teams-service.service';
import { MatIconModule } from '@angular/material/icon';

interface Guess{
  time1Guess: number | null;
  time2Guess: number | null;
}
@Component({
  selector: 'app-palpites',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, MatIconModule],
  templateUrl: './palpites.component.html',
  styleUrl: './palpites.component.css'
})
export class PalpitesComponent {
  @Input() teams!: Team[]
  rounds!: Rodada[]
  @Input() round_value!: number
  

  constructor(private RoundService: RoundsServiceService, private TeamsService: TeamsServiceService) {
    this.getRounds()
  }

  numberRounds: Number[] = [31, 32, 33, 34, 35, 36, 37, 38]
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

  
  rodada(time1: Team | undefined, time2: Team | undefined, goals1: number | null, goals2: number | null, index: number){
    if (time1 != undefined && time2 != undefined && goals1 != null && goals2 != null){
      let result: string  
      if (goals1 > goals2){
        result = time1.team
      } else if (goals2 > goals1){
        result = time2.team
      } else if (this.pressedButton[index] == true){
        result = 'none'
      }else{
        result = 'Empate'
      }
      let diferenca = goals1 - goals2
      if (this.pressedButton[index] == true){
        time1.jogos -= 1
        time2.jogos -= 1
        time1.gols -= goals1
        time2.gols -= goals2
        console.log('se liga no pressedbuttaooon')
        console.log(this.pressedButton[index])
      } else{
        time1.jogos += 1
        time2.jogos += 1
        time1.gols += goals1
        time2.gols += goals2
        console.log('se liga no pressedbuttonnn')
        console.log(this.pressedButton[index])
      }
      if (result == time1.team){
        if (this.pressedButton[index] == true){
          time1.points -= 3
          time1.vitorias -= 1
        } else{
          time1.points += 3
          time1.vitorias += 1
        }
        if (diferenca < 0){
          if (this.pressedButton[index] == true){
            time1.saldo -= diferenca * -1
            time2.saldo -= diferenca
          } else{
            time1.saldo += diferenca * -1
            time2.saldo += diferenca
          }
        } else{
          if (this.pressedButton[index] == true){
            time1.saldo -= diferenca
            time2.saldo += diferenca
          } else{
            time1.saldo += diferenca
            time2.saldo -= diferenca
          }
        }
      } else if (result == time2.team){
        if (this.pressedButton[index] == true){
          time2.points -= 3
          time2.vitorias -= 1
        } else{
          time2.points += 3
          time2.vitorias += 1
        }
        if (diferenca < 0){
          if (this.pressedButton[index] == true){
            time2.saldo -= diferenca * -1
            time1.saldo -= diferenca
          } else{
            time2.saldo += diferenca * -1
            time1.saldo += diferenca
          }
        } else{
          
          if (this.pressedButton[index] == true){
            console.log('to varrendo')
            time2.saldo -= diferenca
            time2.saldo += diferenca
          } else{
            console.log('se liga no pressedbutton')
            console.log(this.pressedButton[index])
            time2.saldo += diferenca
            time1.saldo -= diferenca
          }
        }
      } else{
        if (this.pressedButton[index] == true){
          time1.points -= 1
          time2.points -= 1
        } else{
          time1.points += 1
          time2.points += 1
        }
      }
      
      // * checar aqui o valor de pressedbutton
    } else{
      
    }
    
    
  }
  
  checkSubmitGuess(index: number): void{
    // const time1Guess = this.guesses[index].time1Guess
    // const time2Guess = this.guesses[index].time2Guess
    // if (time1Guess != null && time2Guess != null){
    //   this.submitGuess(this.rounds[index].time1, this.rounds[index].time2, index)
    // }
  }
  pressedButton: boolean[] = []
  functionrandom(i: number){
    console.log('to mudando o pressbutton aqui')
    this.pressedButton[i] = !this.pressedButton[i]
    console.log('oooooo')
    console.log(this.pressedButton[i])
    const time1Guess = this.guesses[i].time1Guess
    const time2Guess = this.guesses[i].time2Guess
    if (time1Guess == null && time2Guess == null){
      time1Guess == 0;
      time2Guess == 0;
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
      this.guesses.push({ time1Guess: null, time2Guess: null});
      this.pressedButton.push(false)
    })
    }
    
    submitGuess(time1: string, time2: string, index: number){
      const time1Obj = this.traduceTeam(time1)
      const time2Obj = this.traduceTeam(time2)
      const guess1 = this.guesses[index].time1Guess
      const guess2 = this.guesses[index].time2Guess
      console.log(guess1, 'guess1')
      if (guess1 == null && guess2 == null){
        if (time1Obj && time2Obj !== undefined){
          this.rodada(time1Obj, time2Obj, 0, 0, index)
          this.TeamsService.updateTeam(time1Obj)
          this.TeamsService.updateTeam(time2Obj)
        }
      } else{
        if (time1Obj && time2Obj !== undefined){
          this.rodada(time1Obj, time2Obj, guess1, guess2, index)
          this.TeamsService.updateTeam(time1Obj)
          this.TeamsService.updateTeam(time2Obj)

      }

      }
  }
  

  getRounds(): void{
    this.RoundService.getRounds().subscribe({
      next: (rounds: Rodada[]) => {
        this.rounds = rounds.sort((a, b) => a.rodada - b.rodada)
        // console.log('to te passando os rounds ')
        // console.log(this.rounds)
      }, error: (err) => {
        console.error('Errooo: ', err)
      }
    })
  }
}
