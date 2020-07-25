import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { reminderDetailComponent } from './reminder-detail.component';

describe('reminderDetailComponent', () => {
  let component: reminderDetailComponent;
  let fixture: ComponentFixture<reminderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ reminderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(reminderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
