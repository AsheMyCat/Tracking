import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  user!: Observable<any>; 
  history!: Observable<any>;

  constructor(public afAuth: AngularFireAuth, private firestore: AngularFirestore) { 
    this.user = null;
    this.history = null;
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      console.log('Dashboard: user infor', user);

      if (user) {
          let emailLower = user.email.toLowerCase();
          this.user = this.firestore.collection('users').doc(emailLower).valueChanges();
      }

      
  });
  
 /* this.afAuth.authState.subscribe(history => {
    console.log('Dashboard: user history', history);

    if (history) {
      let emailLower = history.email.toLowerCase();
      this.user = this.firestore.collection('users').doc(emailLower)
      .collection('location').doc(emailLower)
      .collection('history').doc()
      .valueChanges();
    }
    
});*/
  
  }

  userHistory(): void {

    
  }

}
