import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  
  admin: Observable<any>;
  user: Observable<any>;
  
  constructor(public afAuth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) {
    this.admin = null;
    this.user = null;
   }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(admin => {                                                   // grab the user object from Firebase Authorization
      if (admin) {
          let emailLower = admin.email.toLowerCase();
          this.admin = this.firestore.collection('user').doc(emailLower).valueChanges();      // get the user's doc in Cloud Firestore
      console.log("admin",this.admin)
        }
  });

  this.afAuth.authState.subscribe(user => {                                                   // grab the user object from Firebase Authorization
    if (user) {
        let emailLower = user.email.toLowerCase();
        this.user = this.firestore.collection('users').doc(emailLower).valueChanges();      // get the user's doc in Cloud Firestore
    console.log("user",this.user)
      }
});

  }

  signOut() {
    this.afAuth.signOut();
    this.router.navigate(['/home']);
  }
  
  logout(): void {
    this.afAuth.signOut();
    this.router.navigate(['/home']); 
}


}
