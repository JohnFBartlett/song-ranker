import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaybackWindowComponent } from './playback-window.component';

describe('PlaybackWindowComponent', () => {
  let component: PlaybackWindowComponent;
  let fixture: ComponentFixture<PlaybackWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaybackWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaybackWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
