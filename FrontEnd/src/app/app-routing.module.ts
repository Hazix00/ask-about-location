import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/keykloak-guard';
import { HomePageComponent } from './pages/home/home.component';
import { QuestionPageComponent } from './pages/question/question.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path : 'home', component: HomePageComponent, canActivate: [AuthGuard]},
  {path : 'favorite-questions', component: HomePageComponent, canActivate: [AuthGuard]},
  {path : 'question', component: QuestionPageComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
