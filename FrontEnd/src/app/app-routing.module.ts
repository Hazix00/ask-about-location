import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/keykloak-guard';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path : 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path : 'favorite-questions', component: HomeComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
