import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublictemplatesComponent } from './publictemplates.component';

describe('PublictemplatesComponent', () => {
  let component: PublictemplatesComponent;
  let fixture: ComponentFixture<PublictemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublictemplatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublictemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
