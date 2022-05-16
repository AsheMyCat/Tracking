import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-signup-admin',
  templateUrl: './signup-admin.component.html',
  styleUrls: ['./signup-admin.component.css']
})
export class SignupAdminComponent implements OnInit {
  public innerWidth: any;
  AdminsignupForm!: FormGroup;
  firebaseErrorMessage: string;
  isProgressVisible: boolean;

  constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth) {
    this.isProgressVisible = false;
    this.firebaseErrorMessage = 'Invalid';
   }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    if (this.authService.userLoggedIn) {                       // if the user's logged in, navigate them to the dashboard (NOTE: don't use afAuth.currentUser -- it's never null)
      this.router.navigate(['/dashboard']);
  }
  this.AdminsignupForm = new FormGroup({
      'Municipality': new FormControl('', Validators.required),
      'Office': new FormControl('', Validators.required),
      'Name': new FormControl('', Validators.required),
      'email':  new FormControl ('', [Validators.required, Validators.email]),
      'password':  new FormControl ('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
  });

} // NgOnInit

signup() {
  if (this.AdminsignupForm.invalid)                            // if there's an error in the form, don't submit it
      return;

  this.isProgressVisible = true;
  this.authService.signupAdmin(this.AdminsignupForm.value).then((result) => {
      if (result == null)                                 // null is success, false means there was an error
          this.router.navigate(['/admin']);
      else if (result.isValid == false)
          this.firebaseErrorMessage = result.message;

      this.isProgressVisible = false;                     // no matter what, when the auth service returns, we hide the progress indicator
  }).catch(() => {
      this.isProgressVisible = false;
  });
}

}
