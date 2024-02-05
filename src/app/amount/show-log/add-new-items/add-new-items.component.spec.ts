import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewItemsComponent } from './add-new-items.component';

describe('AddNewItemsComponent', () => {
  let component: AddNewItemsComponent;
  let fixture: ComponentFixture<AddNewItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewItemsComponent]
    });
    fixture = TestBed.createComponent(AddNewItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
