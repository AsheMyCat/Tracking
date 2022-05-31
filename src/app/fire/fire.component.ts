import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-fire',
  templateUrl: './fire.component.html',
  styleUrls: ['./fire.component.css']
})
export class FireComponent implements AfterViewInit {

  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  dataLoaded = false;
  videoStarted = false;
  constructor() { }

  ngAfterViewInit() {

    this.videoPlayer.nativeElement.onloadeddata = (event) => {
      console.log('Video data is loaded.');
      this.dataLoaded = true;
    };

    this.videoPlayer.nativeElement.onplaying = (event) => {
      console.log('Video is no longer paused.');
      this.videoStarted = true;
    };
  }
  }