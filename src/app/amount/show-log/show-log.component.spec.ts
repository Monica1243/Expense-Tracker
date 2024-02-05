import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLogComponent } from './show-log.component';

describe('ShowLogComponent', () => {
  let component: ShowLogComponent;
  let fixture: ComponentFixture<ShowLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowLogComponent]
    });
    fixture = TestBed.createComponent(ShowLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
