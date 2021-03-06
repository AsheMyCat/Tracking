import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';

declare const L: any;
@Component({
  selector: 'app-user-map',
  templateUrl: './user-map.component.html',
  styleUrls: ['./user-map.component.css']
})
export class UserMapComponent implements OnInit {
  latlong: any;
  b!: any;
  c!: any;
  x!: any;
  y!: any;
  ll!:any;
  wp: any;
  h:any;
  i:any;
  p:any;
  cb:any;
  constructor(private afs: AngularFirestore, public firebaseAuth: AngularFireAuth, public authService: AuthService,
    dialog: MatDialog) { }

  ngOnInit(): void {
    if (!navigator.geolocation) {
      console.log ('Location is not Supported');
    }
    navigator.geolocation.getCurrentPosition((position) => {
     
      const coords = position.coords;
      const lat = coords.latitude;
      const long = coords.longitude;
      const e =  position.coords.latitude; // Pag kuha ng Latitude
      const f = position.coords.longitude; // Pag kuha ng Longitude
      
      const latLong = [coords.latitude, coords.longitude]; //Mag kasamang lat at long
      console.log (
         `lat: ${position.coords.latitude}, long: ${position.coords.longitude}`
      ); 
       

      let mymap = L.map('map').setView(latLong, 13);
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXNoZW15Y2F0IiwiYSI6ImNrd2Roamo5a2JjN2YydXMxM3Z3bzB3MWYifQ.ggpNyCtxsflvwJaugeraxg', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
    })
      .addTo(mymap);

    this.x = e;
    this.y = f;

    this.ll = L.latLng(latLong)
     let marker = L.marker(latLong).addTo(mymap);
      marker.bindPopup("You are here").openPopup();
      
     this.latlong = this.ll;

    });
  
    this.watchPosition();
    this.x;
    this.y;

   this.latlong;

  }
  
  async addSub(){
    this.firebaseAuth.authState.subscribe(async user => {
      if (user) {
          // this.afs.collection('users').get().toPromise().then(async (querySnapshot) => {
            
          // })
          let emailLower = user.email.toLowerCase();
          const user_doc = this.afs.collection('users').doc(emailLower);
          const user_details:any = await user_doc.get().toPromise().then((querySnapshot) => {
            return querySnapshot.data()
          });
          console.log(user_details)
          this.cb = [user_details.First_Name +" " +  user_details.Surname];
          user_doc.collection('location').doc(emailLower)
          .set({
            'Name': this.cb, 
            'Email_Lower': user.email.toLowerCase(),
            'Coordinates': " " + this.latlong,
            'Latitude':  this.x,
            'Longitude':  this.y,
            'Watch Position':" " + this.wp,
            'TimeLog': this.authService.timestamp
          })
          
          let uid = this.afs.createId();
          //  this.afs
          // .collection('users')
          // .doc(emailLower)

          user_doc.collection('location').doc(emailLower)
          .collection('history')
          .doc(uid)
          .set({
            'Name': this.cb, 
            'Email_Lower': user.email.toLowerCase(),
            'Coordinates': " " + this.latlong,
            'Latitude':  this.x,
            'Longitude':  this.y,
            'Watch Position':" " + this.wp,
            'TimeLog': this.authService.timestamp
          })
      }
    });
  
    alert("You have successfully turned on your share location")
  }

  delCoordinates(){
    this.firebaseAuth.authState.subscribe(async user => {
      console.log('Deleting Current Location Works', user);

      if (user) {
          let emailLower = user.email.toLowerCase();
           this.afs
          .collection('users')
          .doc(emailLower)
          .collection('location').doc(emailLower)
          .delete();

         // let emailLower = user.email.toLowerCase();
          const user_doc = this.afs.collection('users').doc(emailLower);
          const user_details:any = await user_doc.get().toPromise().then((querySnapshot) => {
            return querySnapshot.data()
          });
          let uid = this.afs.createId();
          console.log(user_details)
          this.cb = [user_details.First_Name +" " +  user_details.Surname];
         // user_doc//.collection('users').doc(emailLower).collection('location').doc(emailLower).collection('history').doc(uid)
          this.afs.collection('users')
          .doc(emailLower)
         .collection('confirmed').doc(uid)
          .set({
            'Name': this.cb, 
            'Email_Lower': user.email.toLowerCase(),
            'Coordinates': " " + this.latlong,
            'Latitude':  this.x,
            'Longitude':  this.y,
            'Status': 'Confirmed',
            'TimeLog': this.authService.timestamp
          })
      }
    });
    alert("You have turned off your share location")
  }

  watchPosition(){
    let desLat = 0; 
    let desLon = 0;
    let id = navigator.geolocation.watchPosition(
      (position) => {
       
      console.log(
        `lat: ${position.coords.latitude}, long: ${position.coords.longitude}`
      );
      if (position.coords.latitude == desLat, position.coords.longitude == desLon){
        navigator.geolocation.clearWatch(id);
        
      }
    },(err) => {
      console.log(err);
    }, { enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    })
     this.c = this.wp;
  }


}
