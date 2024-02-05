import { Component } from '@angular/core';

@Component({
  selector: 'app-add-new-items',
  templateUrl: './add-new-items.component.html',
  styleUrls: ['./add-new-items.component.css']
})
export class AddNewItemsComponent {
  newItem: { item: string, amountSpent: number } = { item: '', amountSpent: 0 };
}
