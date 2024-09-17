import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['../../../styles/compiled-tailwind.css', './site-header.component.css']
})
export class SiteHeaderComponent implements OnInit {

  public readonly title: string;
  public sideMenu: boolean;

  constructor() {
    this.title = 'Stuff Ranking App';
    this.sideMenu = false;
   }

  ngOnInit(): void {
  }

  toggleMenu(): void {
    this.sideMenu = !this.sideMenu;
  }

}
