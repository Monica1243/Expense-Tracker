import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditAmountComponent } from '../edit-amount/edit-amount.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  @Output() editedAmount: EventEmitter<number> = new EventEmitter<number>();

  constructor(public matDialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.matDialog.open(EditAmountComponent, {
      width: '400px',
      // data: { enteredAmount: this.enteredAmount } // Pass data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result returned from the dialog
        this.editedAmount.emit(result);
      }
    });
  }

  // enteredAmount: number = 0; // Initialize with default value

}
