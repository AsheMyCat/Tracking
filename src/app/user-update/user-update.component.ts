import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  userUpdateForm: FormGroup;
  userRef:any;
  constructor(public formBuilder: FormBuilder, private authService: AuthService, private router: Router, private afAuth: AngularFireAuth, private act: ActivatedRoute) { 
    this.userUpdateForm = this.formBuilder.group({
      Surname: [''],
      First_Name: [''],
      Middle_Name: [''],
      Suffix: [''],
      Age: [''],
      Birthday: [''],
      Birthplace: [''],
      Address: [''],
      Contact_Number: [''],
      Religion: [''],
      Sex: [''],
      Civil_Status: [''],
      Type_of_Disability: [''],
      Cause_of_Disability: [''],
    })
  }

  ngOnInit(): void {
    const id = this.act.snapshot.paramMap.get('id');
    this.authService.getUserDoc(id).subscribe(res => {
      this.userRef = res;
      this.userUpdateForm = this.formBuilder.group({
      Surname: [this.userRef.Surname],
      First_Name: [this.userRef.First_Name],
      Middle_Name: [this.userRef.Middle_Name],
      Suffix: [this.userRef.Suffix],
      Age: [this.userRef.Age],
      Birthday: [this.userRef.Birthday],
      Birthplace: [this.userRef.Birthplace],
      Address: [this.userRef.Address],
      Contact_Number: [this.userRef.Contact_Number],
      Religion: [this.userRef.Religion],
      Sex: [this.userRef.Sex],
      Civil_Status: [this.userRef.Civil_Status],
      Type_of_Disability: [this.userRef.Type_of_Disability],
      Cause_of_Disability: [this.userRef.Cause_of_Disability],
      })
    })


  }
  onSubmit(){
    const id = this.act.snapshot.paramMap.get('id');
    this.authService.updateUser(this.userUpdateForm.value, id);
    this.router.navigate(['/admin']);
  }
}
