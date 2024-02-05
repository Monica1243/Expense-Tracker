import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-amount',
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.css']
})
export class AmountComponent {
  @Input() balanceAmount !: number;

  amountSpent:number = 0;

  updateTotalAmount(event:number){
    console.log(event);
    this.amountSpent += event;
    this.balanceAmount -= this.amountSpent;
  }
}
