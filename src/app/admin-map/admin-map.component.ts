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
  a: any;
  x: any;
  y: any;
  z: any;
  myArray: []
  getLabel: any;
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.user = null;

  }

  async ngOnInit(): Promise<void> {
    this.afAuth.authState.subscribe(user => {                                                   // grab the user object from Firebase Authorization
      if (user) {
        let emailLower = user.email.toLowerCase();
        this.user = this.afs.collection('users').doc(emailLower).valueChanges();      // get the user's doc in Cloud Firestore
      }
    });

    if (!navigator.geolocation) {
      console.log('Location is not Supported');
    }
    /*  navigator.geolocation.getCurrentPosition((position) => {
         
        const coords = position.coords;
        const lat = coords.latitude;
        const long = coords.longitude;
        const latLong = [coords.latitude, coords.longitude]; //Mag kasamang lat at long
        console.log (
           `lat: ${position.coords.latitude}, long: ${position.coords.longitude}`
        ); */

    /* let userLocationData: any = await getLocationData(this.afs);
     let filteredUserLocationData = userLocationData.filter(
       (e) => Object.keys(e).length !== 0
     );*/

    /*  setInterval(async () => {
        userLocationData = await getLocationData(this.afs);
      }, 1000);*/

    /*  const latlng = [
        filteredUserLocationData[0].Latitude,
        filteredUserLocationData[0].Longitude,
      ];*/

    let mymap = L.map('map1').setView([14.245633, 120.878566], 11);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXNoZW15Y2F0IiwiYSI6ImNrd2Roamo5a2JjN2YydXMxM3Z3bzB3MWYifQ.ggpNyCtxsflvwJaugeraxg', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);

    /*  filteredUserLocationData.forEach((e) => {
        const latLng = [e.Latitude, e.Longitude];
        const info = [e.Surname, e.Last_Name];
        this.a = info;
        L.marker(latLng)
          .addTo(mymap)
          .bindTooltip( 'this.a',
           {
            permanent: false,
            direction: 'top',
            offset: L.point(-14, -5),
          });
      });*/


    this.afs.collectionGroup('location')
      //.collection('users')
      .get()
      .toPromise()
      .then(async (querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          // doc.data() is never undefined for query doc snapshots
          const read: any = doc.data();
          const email = doc.id;

          //console.log("res", read)
          if (read.Latitude && read.Longitude) {
            const geojsonPoint2: geojson.Point = {
              type: 'Point',
              coordinates: [read.Latitude, read.Longitude],
            };
            console.log("geo", geojsonPoint2)

            L.geoJSON(geojsonPoint2).addTo(mymap);

            //Thank You so much!!!


            //fetch user_details
            const user_name = await this.afs.collection('users').doc(email).get().toPromise().then(async (querySnapshot) => {
              const user_details: any = querySnapshot.data();
              console.log("user_details", user_details)
              return user_details;
            });
            console.log("a", user_name.First_Name + " " + user_name.Surname)
            const user_time = await this.afs.collection('users').doc(email).collection('location').doc(email)
            .get().toPromise().then(async (querySnapshot) => {
              const user_time: any = querySnapshot.data();
              console.log("user_time", user_time)
              return user_time;
            });

            if (user_name) {
              let marker2 = L.marker(geojsonPoint2.coordinates).addTo(mymap);
              marker2.bindPopup(
                "User: " + user_name.First_Name + " " + user_name.Surname +"<br>"+ "Time: " + user_time.TimeLog.toDate(),
                { autoClose: false })
                //.openPopup('');
            }

          }
        });
      });
    //    })

    //End of NgOnInit
  }

}
/*
const getLocationData = async (afs: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      afs
        .collectionGroup('location')
        .valueChanges()
        .subscribe((a: any) => {
          resolve(a);
        });
    } catch (e: any) {
      reject(e);
    }
  });
};*/