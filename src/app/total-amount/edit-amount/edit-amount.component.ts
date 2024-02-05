import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'edit-amount',
  templateUrl: './edit-amount.component.html',
  styleUrls: ['./edit-amount.component.css']
})
export class EditAmountComponent {
  enteredAmount: number = 0;

  constructor(
    public dialogRef: MatDialogRef<EditAmountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onAddClick(): void {
    this.dialogRef.close(this.enteredAmount);
  }
}
