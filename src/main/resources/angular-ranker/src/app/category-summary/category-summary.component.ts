import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../data/models/category';
import { RankSession } from '../data/models/rankSession';
import { RequestPasswordModalComponent } from '../request-password-modal/request-password-modal.component';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-category-summary',
  templateUrl: './category-summary.component.html',
  styleUrls: ['./category-summary.component.scss'],
})
export class CategorySummaryComponent implements OnInit {
  category: Category = {
    name: 'Loading Category...',
    options: [],
  };
  rankSessions: RankSession[] = [];
  form = new FormGroup({
    rankerName: new FormControl(''),
    algorithm: new FormControl('advanced'),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backendService: BackendService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.backendService.getCategory(+id).subscribe((category) => {
        this.category = category;
        this.getRankSessions();
      });
    }
  }

  toggleOptions(): void {
    let panel = document.getElementById('accordion-panel');
    let button = document.getElementById('accordion-button')!;
    if (panel) {
      if (panel.clientHeight) {
        panel.style.height = '0';
        button.textContent = 'View Options \u002B';
      } else {
        let wrapper = document.querySelector('.measuringWrapper')!;
        panel.style.height = wrapper.clientHeight + 20 + 'px';
        button.textContent = 'Hide Options \u2212';
      }
    }
  }

  tryContinueSession(rankSession: RankSession) {
    const modalRef = this.modalService.open(RequestPasswordModalComponent);
    modalRef.componentInstance.correctPassword = rankSession.password;
    modalRef.result.then((result) => {
      if (result == 'correct') {
        this.rankCategory(rankSession.id);
      }
    });
  }

  tryDeleteSession(rankSession: RankSession) {
    if (rankSession.password) {
      const modalRef = this.modalService.open(RequestPasswordModalComponent);
      modalRef.componentInstance.correctPassword = rankSession.password;
      modalRef.result.then((result) => {
        if (result == 'correct') {
          this.deleteRankSession(rankSession);
        }
      });
    } else {
      this.deleteRankSession(rankSession);
    }
  }

  async deleteRankSession(rankSession: RankSession) {
    await this.backendService.deleteRankSession(rankSession.id!).toPromise();
    window.location.reload();
  }

  getRankSessions(): void {
    console.log(
      `getting rank sessions for category with id ${this.category.id}`
    );
    this.backendService
      .getRankSessionsForCategory(this.category.id!)
      .subscribe((rankSessions) => {
        this.rankSessions = rankSessions;
      });
  }

  rankCategory(rankSessionId: number | null = null): void {
    console.log(`Ranker name: ${this.form.controls.rankerName.value}`);
    this.router.navigate([`/rank/${this.category.id}`], {
      queryParams: {
        ranker: this.form.controls.rankerName.value,
        algorithm: this.form.controls.algorithm.value,
        rankSessionId: rankSessionId,
      },
    });
  }

  goToRankSession(rankSession: RankSession): void {
    this.router.navigate([`/results/${rankSession.id}`]);
  }
}
