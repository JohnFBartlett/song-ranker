import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RankPageComponent } from './rank-page/rank-page.component';
import { RankResultsComponent } from './rank-results/rank-results.component';
import { ArraySortByPipe } from './pipes/SortBy';
import { AutosizeModule } from 'ngx-autosize';
import { CategorySummaryComponent } from './category-summary/category-summary.component';
import { ArraySortByReversePipe } from './pipes/SortByReverse';
import { PlaybackWindowComponent } from './playback-window/playback-window.component';
import { SafePipe } from './pipes/Safe';
import { PasswordModalComponent } from './password-modal/password-modal.component';
import { RequestPasswordModalComponent } from './request-password-modal/request-password-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreateCategoryComponent,
    RankPageComponent,
    RankResultsComponent,
    ArraySortByPipe,
    ArraySortByReversePipe,
    SafePipe,
    CategorySummaryComponent,
    PlaybackWindowComponent,
    PasswordModalComponent,
    RequestPasswordModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AutosizeModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
