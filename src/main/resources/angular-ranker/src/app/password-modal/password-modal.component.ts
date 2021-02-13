import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RankSession } from '../models/rankSession';
import { HeroService } from '../services/hero.service';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.css'],
})
export class PasswordModalComponent implements OnInit {
  @Input() rankSession: RankSession | undefined;
  submittedPassword = '';

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
}
