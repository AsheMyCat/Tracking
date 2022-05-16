import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth, private firestore: AngularFirestore) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.afAuth.signOut();
}

imgCollection: Array<object> = [
  {
    image: './assets/1.png',
    thumbImage: 'https://loremflickr.com/g/1200/800/paris',
    alt: 'Image 1',
    title: 'Image 1'
  }, {
    image: 'https://loremflickr.com/600/400/brazil,rio',
    thumbImage: 'https://loremflickr.com/1200/800/brazil,rio',
    title: 'Image 2',
    alt: 'Image 2'
  }, {
    image: 'https://loremflickr.com/600/400/paris,girl/all',
    thumbImage: 'https://loremflickr.com/1200/800/brazil,rio',
    title: 'Image 3',
    alt: 'Image 3'
  }, {
    image: 'https://loremflickr.com/600/400/brazil,rio',
    thumbImage: 'https://loremflickr.com/1200/800/brazil,rio',
    title: 'Image 4',
    alt: 'Image 4'
  }, {
    image: 'https://loremflickr.com/600/400/paris,girl/all',
    thumbImage: 'https://loremflickr.com/1200/800/paris,girl/all',
    title: 'Image 5',
    alt: 'Image 5'
  }, {
    image: 'https://loremflickr.com/600/400/brazil,rio',
    thumbImage: 'https://loremflickr.com/1200/800/brazil,rio',
    title: 'Image 6',
    alt: 'Image 6'
  },{
    image: 'https://loremflickr.com/600/400/brazil,rio',
    thumbImage: 'https://loremflickr.com/1200/800/brazil,rio',
    title: 'Image 7',
    alt: 'Image 7'
  },{
    image: 'https://loremflickr.com/600/400/paris,girl/all',
    thumbImage: 'https://loremflickr.com/1200/800/brazil,rio',
    title: 'Image 8',
    alt: 'Image 8'
  },
];

}
