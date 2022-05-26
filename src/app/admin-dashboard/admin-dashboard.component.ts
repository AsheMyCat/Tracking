import { Component, OnInit} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import {  Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../services/user.model';
import { Location } from '../services/location.model'


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  user: Observable<any>; 
  User: User[];
  Location: Location[]
  filterTerm!: string;
  locationCollection:any;
  locationInfo:any;
  locC:any;
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private authService: AuthService) { 
    this.user = null;
  }
  ngOnInit(): void {
    
    this.afAuth.authState.subscribe(user => {                                                   // grab the user object from Firebase Authorization
      if (user) {
          let emailLower = user.email.toLowerCase();
          this.user = this.afs.collection('users').doc(emailLower).valueChanges();      // get the user's doc in Cloud Firestore
      }
  });

  this.authService.getUserList().subscribe(res => {
    this.User = res.map ( e => {
      return{
        id: e.payload.doc.id,
        ...e.payload.doc.data() as {}
      } as User;
    })
  });

  this.authService.getUserLocation().subscribe(res => {
    this.Location = res.map ( e => {
      return{
        id: e.payload.doc.id,
        ...e.payload.doc.data() as {}
      } as Location;
    })
  });
  
  //End of NgOninit
  }

  delete(email): void {
    
    let emailLower = this.afs.firestore.doc('Email_Lower')
        this.afs.collection('users').doc('Email_Lower').delete().then(() => {
        console.log('top-level doc deleted');
    }).catch((error) => {
        console.error('error deleting doc', emailLower);
    });

}

del(email){
  this.authService.deleteUser(email);
}



}
