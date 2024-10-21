import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalpitesComponent } from './palpites.component';

describe('PalpitesComponent', () => {
  let component: PalpitesComponent;
  let fixture: ComponentFixture<PalpitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PalpitesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalpitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
