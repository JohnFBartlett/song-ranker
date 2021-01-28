import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroesComponent } from '../heroes/heroes.component';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CreateCategoryComponent } from '../create-category/create-category.component';
import { RankPageComponent } from '../rank-page/rank-page.component';
import { RankResultsComponent } from '../rank-results/rank-results.component';
import { CategorySummaryComponent } from '../category-summary/category-summary.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', component: DashboardComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'summary/:id', component: CategorySummaryComponent },
  { path: 'rank/:id', component: RankPageComponent },
  { path: 'results/:id', component: RankResultsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'create', component: CreateCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
