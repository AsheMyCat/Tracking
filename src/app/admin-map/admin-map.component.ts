import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import * as geojson from 'geojson';
import { AuthService } from '../services/auth.service';
import { Location } from '../services/location.model'
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
  userDetails: []
  Location: Location[]
  
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private authService: AuthService) {
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

  /*   let userLocationData: any = await getLocationData(this.afs);
     let filteredUserLocationData = userLocationData.filter(
       (e) => Object.keys(e).length !== 0
     );

      setInterval(async () => {
        userLocationData = await getLocationData(this.afs);
      }, 1000);

      const latlng = [
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
    setInterval(L.map, 5000);
    
     // setInterval(mymap, 1000);
     /* filteredUserLocationData.forEach((e) => {
        const latLng = [e.Latitude, e.Longitude];
      //  const info = [e.Surname, e.Last_Name];
      //  this.a = info;
        L.marker(latLng)
          .addTo(mymap)
          .bindTooltip( '',
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
           // alert('A user wants to be tracked!')
            L.geoJSON(geojsonPoint2).addTo(mymap);
            setInterval(L.geoJSON, 1000);

            //fetch user_details
            const user_name = await this.afs.collection('users').doc(email).get().toPromise().then(async (querySnapshot) => {
              const user_details: any = querySnapshot.data();
              console.log("user_details", user_details)
              return user_details;
            });
            
            //console.log("a", user_name.First_Name + " " + user_name.Surname)
            const user_time = await this.afs.collection('users').doc(email).collection('location').doc(email)
            .get().toPromise().then(async (querySnapshot) => {
              const user_time: any = querySnapshot.data();
              console.log("user_time", user_time)
              return user_time;
            });

            setInterval(L.marker, 5000);
            if (user_name) {
              let marker2 = L.marker(geojsonPoint2.coordinates).addTo(mymap);
              marker2.bindPopup(
                "User: " + user_name.First_Name + " " + user_name.Surname +"<br>"+ "Time: " + user_time.TimeLog.toDate() 
                + "<br>",
                { autoClose: false })
                .openPopup('');
            }

          }
        });
      });
    //    })


    this.authService.getUserLocation().subscribe(res => {
      this.Location = res.map ( e => {
        return{
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as Location;
      })
    }); console.log("loation", Location)
   
    //End of NgOnInit

  }

  onclick(){
      this.afAuth.authState.subscribe(user => {
        console.log('Deleting Confirmed Tracked Users', user);
  
        if (user) {
            let emailLower = user.email.toLowerCase();
             this.afs
            .collection('users')
            .doc(emailLower)
            .collection('location').doc(emailLower)
            .delete();
        }
      });
    }

  userLoc(){
    this.afs.collectionGroup('location').snapshotChanges()
    }
  

}


/*const getLocationData = async (afs: any) => {

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