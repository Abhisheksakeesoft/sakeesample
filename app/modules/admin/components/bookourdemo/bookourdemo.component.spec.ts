import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookourdemoComponent } from './bookourdemo.component';

describe('BookourdemoComponent', () => {
  let component: BookourdemoComponent;
  let fixture: ComponentFixture<BookourdemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookourdemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookourdemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
