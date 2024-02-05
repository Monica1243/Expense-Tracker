import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent {

  editedAmount : number = 0;
  editedItem : string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.editedItem = data.editedItem;
    this.editedAmount = data.editedAmount;
  }
}
