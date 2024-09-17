import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateCategoryComponent } from './pages/create-category/create-category.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RankPageComponent } from './pages/rank-page/rank-page.component';
import { RankResultsComponent } from './pages/rank-results/rank-results.component';
import { ArraySortByPipe } from './strategies/pipes/SortBy';
import { AutosizeModule } from 'ngx-autosize';
import { CategorySummaryComponent } from './pages/category-summary/category-summary.component';
import { ArraySortByReversePipe } from './strategies/pipes/SortByReverse';
import { PlaybackWindowComponent } from './components/playback-window/playback-window.component';
import { SafePipe } from './strategies/pipes/Safe';
import { PasswordModalComponent } from './components/password-modal/password-modal.component';
import { RequestPasswordModalComponent } from './components/request-password-modal/request-password-modal.component';
import { SiteHeaderComponent } from './components/site-header/site-header.component';

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
    SiteHeaderComponent,
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
