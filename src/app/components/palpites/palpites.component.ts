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
  //* o sortedTeams repassado no componente anterior. Aqui são os times ordenados
  @Input() teams!: Team[]
  rounds!: Rodada[]
  //* recebe o número da rodada
  @Input() round_value!: number
  
  //? junto com o componente, já é criado as suas rodadas.
  constructor(private RoundService: RoundsServiceService, private TeamsService: TeamsServiceService) {
    this.getRounds()
  }

  //! Lógica rápida para resumir o nome dos times.
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

  //! Lógica para os resultados que o usuário passa. Análise do vencedor, perdedor ou caso de empate. Também analisa se o botão "Enviar" foi pressionado. Caso sim, ele entende que é necessário "anular" a rodada. Isso é feito por meio do index, que indica ao sistema qual rodada está sendo alterada.
  rodada(time1: Team | undefined, time2: Team | undefined, goals1: number | null, goals2: number | null, index: number){
    if (time1 != undefined && time2 != undefined && goals1 != null && goals2 != null){
      let result: string  
      if (goals1 > goals2){
        result = time1.team
      } else if (goals2 > goals1){
        result = time2.team
      } else{
        result = 'Empate'
      }
      let diferenca = goals1 - goals2
      if (this.pressedButton[index] == true){
        time1.jogos -= 1
        time2.jogos -= 1
        time1.gols -= goals1
        time2.gols -= goals2
      } else{
        time1.jogos += 1
        time2.jogos += 1
        time1.gols += goals1
        time2.gols += goals2
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
            time2.saldo -= diferenca
            time2.saldo += diferenca
          } else{
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
    }
  }
  

  pressedButton: boolean[] = []
  //? mudando o estado do pressedButton, quando o usuário apertar o botão na tela.
  changePressedButtonState(i: number){
    this.pressedButton[i] = !this.pressedButton[i]
  }
  
  //? corrige o input do usuario caso seja menor que 0 ou maior que 9.
  validateInput(event: any){
    const input = event.target as HTMLInputElement
    let value = parseInt(input.value, 10)
    if (isNaN(value)){
      input.value = '0'
    }
    if (value < 0){
      input.value = '0'
    } else if (value > 9){
      input.value = '9'
    } else {
      input.value = Math.floor(value).toString()
   }
  }
  
  //? pega o nome do time e procura no array de times, repassado pelo componente tabela. Ele retorna o objeto do time.
  traduceTeam(teamName: string){
    const traducedTeam = this.teams.find(team => team.team === teamName)
    return traducedTeam

  }

  
  guesses: Guess[] = []
  //! essencial para a aplicação, pois cada rodada é individual e precisa que o botão ao seu lado trabalhe somente sobre aquela partida. Também é sobre os palpites, chamados guesses, tornando cada input único para a partida. Isso é feito por meio do tamanho do array das rodadas.
  ngOnInit(){
    this.rounds.forEach(() => {
      this.guesses.push({ time1Guess: null, time2Guess: null});
      this.pressedButton.push(false)
    })
    }
  
  //! envia o input do usuário para a função de rodadas.
  submitGuess(time1: string, time2: string, index: number){
      const time1Obj = this.traduceTeam(time1)
      const time2Obj = this.traduceTeam(time2)
      const guess1 = this.guesses[index].time1Guess
      const guess2 = this.guesses[index].time2Guess
      //? checando se os times estão realmente sendo passados.
      if (time1Obj && time2Obj !== undefined){
        //? analisando se o usuário passa os inputs numericos.
        if (guess1 == null && guess2 == null){
          this.rodada(time1Obj, time2Obj, 0, 0, index)
          this.TeamsService.updateTeam(time1Obj)
          this.TeamsService.updateTeam(time2Obj)
        } else if(guess1 == null && guess2 != null){
          this.rodada(time1Obj, time2Obj, 0, guess2, index)
          this.TeamsService.updateTeam(time1Obj)
          this.TeamsService.updateTeam(time2Obj)
        } else if (guess1 != null && guess2 == null){
          this.rodada(time1Obj, time2Obj, guess1, 0, index)
          this.TeamsService.updateTeam(time1Obj)
          this.TeamsService.updateTeam(time2Obj)
        } else{
          this.rodada(time1Obj, time2Obj, guess1, guess2, index)
          this.TeamsService.updateTeam(time1Obj)
          this.TeamsService.updateTeam(time2Obj)
        }
      }
    }
  

  getRounds(): void{
    this.RoundService.getRounds().subscribe({
      //! ordena as rodadas por número de rodada.
      next: (rounds: Rodada[]) => {
        this.rounds = rounds.sort((a, b) => a.rodada - b.rodada)
      }, error: (err) => {
        console.error('Erro na composição das rodadas: ', err)
      }
    })
  }
}
