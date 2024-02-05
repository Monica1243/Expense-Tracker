import { Component, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'total-amount',
  templateUrl: './total-amount.component.html',
  styleUrls: ['./total-amount.component.css']
})
export class TotalAmountComponent {
  @Output() updatedBalance = new EventEmitter<number>();
  
  totalAmount:number = 0;  

  getData(event:number){
    this.totalAmount = event;
    this.updatedBalance.emit(this.totalAmount);
  }
}

