import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {
  public innerWidth: any;
    email!: any;
    mailSent!: boolean;
    isProgressVisible!: boolean;
    firebaseErrorMessage!: string;

  constructor(private authService: AuthService, private router: Router, public afAuth: AngularFireAuth) {
    this.email = '';
        this.mailSent = false;
        this.isProgressVisible = false;

        this.firebaseErrorMessage = '';
   }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.afAuth.authState.subscribe(user => {               // if the user is logged in, update the form value with their email address
      if (user) {
          this.email = user.email;
      }
  });
  }


  resendVerificationEmail() {
    this.isProgressVisible = true;                          // show the progress indicator as we start the Firebase password reset process

    this.authService.resendVerificationEmail().then((result) => {
        this.isProgressVisible = false;                     // no matter what, when the auth service returns, we hide the progress indicator
        if (result == null) {                               // null is success, false means there was an error
            console.log('verification email resent...');
            this.mailSent = true;
        }
        else if (result.isValid == false) {
            console.log('verification error', result);
            this.firebaseErrorMessage = result.message;
        }
    });
}

}
