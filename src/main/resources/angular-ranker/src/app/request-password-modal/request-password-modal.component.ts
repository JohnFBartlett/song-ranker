import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-request-password-modal',
  templateUrl: './request-password-modal.component.html',
  styleUrls: ['./request-password-modal.component.css'],
})
export class RequestPasswordModalComponent implements OnInit {
  @Input() correctPassword: string | undefined;

  @Output() passEntry: EventEmitter<string> = new EventEmitter();

  submittedPassword: string | undefined;
  state: string = 'waiting';

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  async submitPassword(): Promise<void> {
    this.state = 'checking';

    // wait 1 second
    setTimeout(() => {
      if (this.checkPassword()) {
        // Set message to "Right password!"
        this.state = 'correct';
        setTimeout(() => {
          this.passBack();
        }, 1000);
      } else {
        // Set message to "Wrong password"
        this.state = 'incorrect';
      }
    }, 1000);
  }

  checkPassword(): boolean {
    console.log(
      `comparing correct (${this.correctPassword}) with incorrect (${btoa(
        this.submittedPassword!
      )})`
    );
    if (!this.correctPassword) {
      console.log('There is no password to start with. Rejecting.');
    } else if (!this.submittedPassword) {
      console.log('No password submitted. Rejecting.');
    } else if (btoa(this.submittedPassword) == this.correctPassword) {
      console.log('Password matches!');
      return true;
    } else {
      console.log('Password does not match. Rejecting');
    }
    return false;
  }

  passBack() {
    this.activeModal.close(this.state);
  }
}
