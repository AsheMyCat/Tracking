import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    public innerWidth: any;
    isProgressVisible: boolean;
    signupForm!: FormGroup;
    firebaseErrorMessage: string;
    
    constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth) {
        this.isProgressVisible = false;
        this.firebaseErrorMessage = 'Invalid';
    }

    ngOnInit(): void {
        this.innerWidth = window.innerWidth;
        if (this.authService.userLoggedIn) {                       // if the user's logged in, navigate them to the dashboard (NOTE: don't use afAuth.currentUser -- it's never null)
            this.router.navigate(['/dashboard']);
        }

        this.signupForm = new FormGroup({
            'Surname': new FormControl('', Validators.required),
            'First_Name': new FormControl('', Validators.required),
            'Middle_Name': new FormControl('', Validators.required),
            'Suffix': new FormControl(''),
            'Age': new FormControl('', Validators.required),
            'Birthday': new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
            'Birthplace': new FormControl('', Validators.required),
            'Address':  new FormControl('', Validators.required),
            'Contact_Number':  new FormControl ('', Validators.required),
            'Religion':  new FormControl ('', Validators.required),
            'Sex':  new FormControl ('', Validators.required),
            'Civil_Status':  new FormControl ('', Validators.required),
            'Type_of_Disability':  new FormControl ('', Validators.required),
            'Cause_of_Disability':  new FormControl ('', Validators.required),
            'email':  new FormControl ('', [Validators.required, Validators.email]),
            'password':  new FormControl ('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
        });
    }

    signup() {
        if (this.signupForm.invalid)                            // if there's an error in the form, don't submit it
            return;

        this.isProgressVisible = true;
        this.authService.signupUser(this.signupForm.value).then((result) => {
            if (result == null)                                 // null is success, false means there was an error
                this.router.navigate(['/login']);
            else if (result.isValid == false)
                this.firebaseErrorMessage = result.message;

            this.isProgressVisible = false;                     // no matter what, when the auth service returns, we hide the progress indicator
        }).catch(() => {
            this.isProgressVisible = false;
        });
    }
}
