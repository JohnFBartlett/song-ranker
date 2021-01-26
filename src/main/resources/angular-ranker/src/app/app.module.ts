import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RankPageComponent } from './rank-page/rank-page.component';
import { RankResultsComponent } from './rank-results/rank-results.component';
import { ArraySortByPipe } from './pipes/SortBy';
import { AutosizeModule } from 'ngx-autosize';
import { CategorySummaryComponent } from './category-summary/category-summary.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    DashboardComponent,
    CreateCategoryComponent,
    RankPageComponent,
    RankResultsComponent,
    ArraySortByPipe,
    CategorySummaryComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AutosizeModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}