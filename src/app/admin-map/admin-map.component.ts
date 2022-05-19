import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import * as geojson from 'geojson';
declare const L: any;
@Component({
  selector: 'app-admin-map',
  templateUrl: './admin-map.component.html',
  styleUrls: ['./admin-map.component.css']
})
export class AdminMapComponent implements OnInit {
  
  user: Observable<any>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.user = null; 

  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {                                                   // grab the user object from Firebase Authorization
      if (user) {
          let emailLower = user.email.toLowerCase();
          this.user = this.afs.collection('users').doc(emailLower).valueChanges();      // get the user's doc in Cloud Firestore
      }
  });

  if (!navigator.geolocation) {
    console.log ('Location is not Supported');
  }
  navigator.geolocation.getCurrentPosition((position) => {
     
    const coords = position.coords;
    const lat = coords.latitude;
    const long = coords.longitude;
    const latLong = [coords.latitude, coords.longitude]; //Mag kasamang lat at long
    console.log (
       `lat: ${position.coords.latitude}, long: ${position.coords.longitude}`
    ); 
  
  let mymap = L.map('map1').setView(latLong, 10);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXNoZW15Y2F0IiwiYSI6ImNrd2Roamo5a2JjN2YydXMxM3Z3bzB3MWYifQ.ggpNyCtxsflvwJaugeraxg', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: 'your.mapbox.access.token'
        }).addTo(mymap);

        this.afs.collectionGroup('location')
       //.collection('users')
        .get()
        .toPromise()
        .then(async (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const read: any = doc.data(); //console.log("res", read)
            if (read.Latitude && read.Longitude) {
              const geojsonPoint2: geojson.Point = {
                type: 'Point',
                coordinates: [read.Latitude, read.Longitude],
              };
              console.log("geo", geojsonPoint2)

              L.geoJSON(geojsonPoint2).addTo(mymap);

              let marker2 = L.marker(geojsonPoint2.coordinates).addTo(mymap);
              marker2.bindPopup(doc.id, { autoClose: false }).openPopup();
            }
          });
        });
      })

  //End of NgOnInit
  }

}
