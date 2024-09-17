import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankResultsComponent } from './rank-results.component';

describe('RankResultsComponent', () => {
  let component: RankResultsComponent;
  let fixture: ComponentFixture<RankResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
