import { Component, Input } from '@angular/core';
import { Team } from '../../Team';
import { RoundsServiceService } from '../../services/rounds-service.service';
import { Rodada } from '../../Rodada';
@Component({
  selector: 'app-palpites',
  standalone: true,
  imports: [],
  templateUrl: './palpites.component.html',
  styleUrl: './palpites.component.css'
})
export class PalpitesComponent {
  @Input() teams!: Team[]
  rounds!: Rodada[]
  constructor(private RoundService: RoundsServiceService) {
    this.getRounds()
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
