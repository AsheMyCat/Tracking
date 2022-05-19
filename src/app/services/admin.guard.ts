import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private afAuth: AngularFireAuth) {

  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.afAuth.onAuthStateChanged((admin) => {
          if (admin) {

            this.router.navigate(['/admin-map']); 
             /*  if (!user.emailVerified)                            // if the user hasn't verified their email, send them to that page
                  this.router.navigate(['/verify-email']);*/

              resolve(true);
          } else {
              console.log('Auth Guard: admin is not logged in');
              this.router.navigate(['/admin-map']);                   // a logged out user will always be sent to home
              resolve(false);
          }
      });
  });
  }
  
}
