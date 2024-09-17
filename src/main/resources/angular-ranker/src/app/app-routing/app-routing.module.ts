import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { CreateCategoryComponent } from '../pages/create-category/create-category.component';
import { RankPageComponent } from '../pages/rank-page/rank-page.component';
import { RankResultsComponent } from '../pages/rank-results/rank-results.component';
import { CategorySummaryComponent } from '../pages/category-summary/category-summary.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', component: DashboardComponent },
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
