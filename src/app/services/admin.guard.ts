import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore) {

  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      
  return new Promise((resolve, reject) => {
      this.afAuth.onAuthStateChanged((admin) => {
        let user = this.afs.collection('users', ref => ref.where('accountType', '==', 'Admin'));
        user.get().forEach(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            const check: any = doc.data()
            if(check.accountType == 'Admin'){

              this.router.navigate(['/admin-map'])
              resolve(true);
            } else {
              console.log('Auth Guard: admin is not logged in');
              this.router.navigate(['/admin-map']);                   // a logged out user will always be sent to home
              resolve(false);
          }
              console.log("checking for admin account type" , user)
          });
      });
      });
  });
  }
  
}
