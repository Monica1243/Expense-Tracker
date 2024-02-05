import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AmountComponent } from './amount/amount.component';
import { TotalAmountComponent } from './total-amount/total-amount.component';
import { EditAmountComponent } from './total-amount/edit-amount/edit-amount.component';
import { EditComponent } from './total-amount/edit/edit.component';
import { ShowLogComponent } from './amount/show-log/show-log.component';
import { EditDialogComponent } from './amount/show-log/edit-dialog/edit-dialog.component';
import { AddNewItemsComponent } from './amount/show-log/add-new-items/add-new-items.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AmountComponent,
    TotalAmountComponent,
    EditAmountComponent,
    EditComponent,
    ShowLogComponent,
    EditDialogComponent,
    AddNewItemsComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
