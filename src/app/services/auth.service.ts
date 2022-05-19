import { AnimationDriver } from '@angular/animations/browser';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { __values } from 'tslib';
import { User } from './user.model';

declare const L: any;

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user!: Observable<any>;
    admin!:Observable<any>
    userLoggedIn: boolean;      // other components can check on this variable for the login status of the user
    adminLoggedIn: boolean;
    array = [];
    constructor(private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
        this.userLoggedIn = false;
        this.user = null;

        this.afAuth.onAuthStateChanged((user) => {              // set up a subscription to always know the login status of the user
            if (user) {
                this.userLoggedIn = true;
            } else {
                this.userLoggedIn = false;
            }
        });

        this.adminLoggedIn = false;
        this.admin = null;

        this.afAuth.onAuthStateChanged((admin) => {              // set up a subscription to always know the login status of the user
            if (admin) {
                this.adminLoggedIn = true;
            } else {
                this.adminLoggedIn = false;
            }
        });
    }

    userList: Observable<any>;

    //USER LOGIN, SIGNUP

    get timestamp() {
        const d = new Date();
        return d;
      }

    loginUser(email: string, password: string): Promise<any> {
        return this.afAuth.signInWithEmailAndPassword(email, password)
            .then(() => {
                
                console.log('Auth Service: loginUser: success');
                 this.router.navigate(['/login']);
            })
            .catch(error => {
                console.log('Auth Service: login error...');
                console.log('error code', error.code);
                console.log('error', error);
                if (error.code)
                    return { isValid: false, message: error.message };
            });
    }

    signupUser(user: any): Promise<any> {
        return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
            .then((result) => {
                let emailLower = user.email.toLowerCase();
                const timestamp = this.timestamp;
                this.afs.doc('/users/' + emailLower)                        // on a successful signup, create a document in 'users' collection with the new user's info
                    .set({
                        accountType: 'endUser',
                        Surname: user.Surname,
                        First_Name: user.First_Name,
                        Middle_Name: user.Middle_Name,
                        Suffix: user.Suffix,
                        Age: user.Age,
                        Birthday: user.Birthday, 
                        Birthplace: user.Birthplace,
                        Address: user.Address,
                        Contact_Number: user.Contact_Number,
                        Religion: user.Religion,
                        Sex: user.Sex,
                        Civil_Status: user.Civil_Status,
                        Type_of_Disability: user.Type_of_Disability,
                        Cause_of_Disability: user.Cause_of_Disability,
                        email: user.email,
                        password: user.password,
                        createdAt: timestamp,
                        Email_Lower: emailLower
                    });

                    result.user.sendEmailVerification();                    // immediately send the user a verification email
            })
            .catch(error => {
                console.log('Auth Service: signup error', error);
                if (error.code)
                    return { isValid: false, message: error.message };
            });
    }


    resetPassword(email: string): Promise<any> {
        return this.afAuth.sendPasswordResetEmail(email)
            .then(() => {
                console.log('Auth Service: reset password success');
                // this.router.navigate(['/amount']);
            })
            .catch(error => {
                console.log('Auth Service: reset password error...');
                console.log(error.code);
                console.log(error)
                if (error.code)
                    return error;
            });
    }

    async resendVerificationEmail() {                         // verification email is sent in the Sign Up function, but if you need to resend, call this function
        return (await this.afAuth.currentUser).sendEmailVerification()
            .then(() => {
                 this.router.navigate(['home']);
            })
            .catch(error => {
                console.log('Auth Service: sendVerificationEmail error...');
                console.log('error code', error.code);
                console.log('error', error);
                if (error.code)
                    return error;
            });
    }

    logoutUser(): Promise<void> {
        return this.afAuth.signOut()
            .then(() => {
                this.router.navigate(['/home']);                    // when we log the user out, navigate them to home
            })
            .catch(error => {
                console.log('Auth Service: logout error...');
                console.log('error code', error.code);
                console.log('error', error);
                if (error.code)
                    return error;
            });
    }

    setUserInfo(payload: object) {
        console.log('Auth Service: saving user info...');
        this.afs.collection('users')
            .add(payload).then(function (res) {
                console.log("Auth Service: setUserInfo response...")
                console.log(res);
            })
    }

    getCurrentUser() {
        return this.afAuth.currentUser;                                 // returns user object for logged-in users, otherwise returns null 
    }

    //ADMIN SIGNUP

    loginAdmin(email: string, password: string): Promise<any> {
        return this.afAuth.signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('Auth Service: loginAdmin: success');
                // this.router.navigate(['/dashboard']);
            })
            .catch(error => {
                console.log('Auth Service: login error...');
                console.log('error code', error.code);
                console.log('error', error);
                if (error.code)
                    return { isValid: false, message: error.message };
            });
    }

    signupAdmin(user: any): Promise<any> {
        return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
            .then((result) => {
                let emailLower = user.email.toLowerCase();
                const timestamp = this.timestamp;
                this.afs.doc('/users/' + emailLower)                        // on a successful signup, create a document in 'users' collection with the new user's info
                    .set({
                        accountType: 'Admin',
                        Surname: user.Surname,
                        First_Name: user.First_Name,
                        Middle_Name: user.Middle_Name,
                        Suffix: user.Suffix,
                        Age: user.Age,
                        Birthday: user.Birthday, 
                        Birthplace: user.Birthplace,
                        Address: user.Address,
                        Contact_Number: user.Contact_Number,
                        Religion: user.Religion,
                        Sex: user.Sex,
                        Civil_Status: user.Civil_Status,
                        Type_of_Disability: user.Type_of_Disability,
                        Cause_of_Disability: user.Cause_of_Disability,
                        email: user.email,
                        password: user.password,
                        createdAt: timestamp,
                        Email_Lower: emailLower
                       
                    });

                    result.user.sendEmailVerification();                    // immediately send the user a verification email
            })
            .catch(error => {
                console.log('Auth Service: signup error', error);
                if (error.code)
                    return { isValid: false, message: error.message };
            });
    }

    logoutAdmin(): Promise<void> {
        return this.afAuth.signOut()
            .then(() => {
                this.router.navigate(['/home']);                    // when we log the user out, navigate them to home
            })
            .catch(error => {
                console.log('Auth Service: logout error...');
                console.log('error code', error.code);
                console.log('error', error);
                if (error.code)
                    return error;
            });
    }

    setAdminInfo(payload: object) {
        console.log('Auth Service: saving admin info...');
        this.afs.collection('admin')
            .add(payload).then(function (res) {
                console.log("Auth Service: setAdminInfo response...")
                console.log(res);
            })
    }
//CRUD METHODS
    getUser(){
        this.userList = this.afs.collection('users').snapshotChanges()
        return this.userList;
    }

    getUserDoc(id){
        return this.afs
        .collection('users')
        .doc(id)
        .valueChanges()
    }

    getUserList() {
        return this.afs
          .collection("users")
          .snapshotChanges()
      }

    deleteUser(email){
        let user = this.afs.collection('users', ref => ref.where('Email_Lower', '==', email));
        user.get().forEach(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
        });
        // this.afAuth.authState.subscribe(user => {
        //     if (user) {
        //         let emailLower = user.email.toLowerCase();
        //         this.afs.firestore.collection('users').doc(emailLower).delete();
        //     }
    //})
    }

    updateUser(user: User, email){
        let users = this.afs.collection('users', ref => ref.where('Email_Lower', '==', email));
        users.get().forEach(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.update({ 
       
       /* return this.afs
        .collection("users")
        .doc(Email_Lower)*/
       // .update({
        Surname: user.Surname,
        First_Name: user.First_Name,
        Middle_Name: user.Middle_Name,
        Suffix: user.Suffix,
        Age: user.Age,
        Birthday: user.Birthday,
        Birthplace: user.Birthplace,
        Address: user.Address,
        Contact_Number: user.Contact_Number,
        Religion: user.Religion,
        Sex: user.Sex,
        Civil_Status: user.Civil_Status,
        Type_of_Disability: user.Type_of_Disability,
        Cause_of_Disability: user.Cause_of_Disability
        })
    });
});
    }
    
}
