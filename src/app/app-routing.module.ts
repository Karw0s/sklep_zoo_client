import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { AuthGuardService } from './auth/auth-guard.service';


const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  // {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'user/details', component: UserDetailsComponent, canActivate: [AuthGuardService]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
