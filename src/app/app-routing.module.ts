import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { TrackComponent } from './track/track.component';
import { AboutComponent } from './about/about.component';
import { HotlinesComponent } from './hotlines/hotlines.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { SignupAdminComponent } from './signup-admin/signup-admin.component';
import { AuthGuard } from './services/auth.guard';
import { AdminMapComponent } from './admin-map/admin-map.component';
import { UserMapComponent } from './user-map/user-map.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { DisasterComponent } from './disaster/disaster.component';
import { EarthComponent } from './earth/earth.component';
import { StormComponent } from './storm/storm.component';
import { AdminGuard } from './services/admin.guard';


const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [] },
  { path: 'user-info', component: UserDashboardComponent, canActivate: [] },
  { path: 'forgot-password', component: ForgotPassComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'verify-email', component: EmailVerificationComponent },
  { path: 'gps', component: TrackComponent },
  { path: 'hotlines', component: HotlinesComponent },
  { path: 'about', component: AboutComponent },
  { path: 'nav', component: NavbarComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'signup-admin', component: SignupAdminComponent },
  { path: 'admin-map', component: AdminMapComponent, canActivate:[] },
  { path: 'user-map', component: UserMapComponent, canActivate:[] },
  { path: 'user-update', component: UserUpdateComponent },
  { path: 'fire', component: DisasterComponent },
  { path: 'earth', component: EarthComponent },
  { path: 'storm', component: StormComponent },
  { path: '**', component: HomeComponent },        

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
