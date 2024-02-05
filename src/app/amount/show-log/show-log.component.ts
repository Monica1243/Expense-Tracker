import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { AddNewItemsComponent } from './add-new-items/add-new-items.component';

export interface LogData {
  item: string;
  amountSpent: number;
}

@Component({
  selector: 'show-log',
  templateUrl: './show-log.component.html',
  styleUrls: ['./show-log.component.css']
})

export class ShowLogComponent {
  displayedColumns: string[] = ['item', 'amountSpent', 'options'];
  dataSource: LogData[] = [
  ];

  constructor(public matDialog: MatDialog) {}

  @Output() newItemEvent = new EventEmitter<number>();

  deleteItem(item: LogData) {
    //get index of the item to be deleted and delete it using the splice function and finaly call the elements using spread operator
    const index = this.dataSource.indexOf(item);
    if (index >= 0) {
      this.dataSource.splice(index, 1);
      // Reassign the dataSource to trigger refresh
      this.dataSource = [...this.dataSource];
    }
  }

  openEdit(item: LogData) : void {
    const dialogRef = this.matDialog.open(EditDialogComponent, {
      width: '30%',
      data: { item: item.item, amountSpent: item.amountSpent }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.item = result.item;
        item.amountSpent = result.amountSpent;
      }
    });
  }

  
  AddItems(){
    const dialogRef = this.matDialog.open(AddNewItemsComponent, {
      width: '30%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.dataSource.push(result);
        this.dataSource = [...this.dataSource];
        this.newItemEvent.emit(result.amountSpent);
      }
    });
  }
  
}
