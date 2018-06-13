import { Component, OnInit } from '@angular/core';
import { SendService } from "../_services/index";
import { Router, ActivatedRoute } from '@angular/router';

import { MatRadioChange, MatSnackBar } from '@angular/material';

import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

import { AutorizedPerson, SignupPerson } from "../_models/index";
import { Snack } from "../_constants/snackbaroptions";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public autorizedPerson: AutorizedPerson;
  public signupPerson: SignupPerson;
  private currentAnswer: string;
  public isYes: boolean;
  public isNo:boolean;

  public isNotMatch;
  public password: string;
  public confirmPassword: string;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sendService: SendService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.signupPerson = {
      name: "",
      email: "",
      password: "",
      cpassword:"",
      phone: "",
    }
    this.currentAnswer = "Yes";
    this.isYes = true;
    this.isNo = false;
    this.password = '1212';
    this.confirmPassword = '';
  }
  answers = [
    'Yes',
    'No'
  ];
  radioChange(event: MatRadioChange) {
    if(event.value == "Yes"){
      this.isYes = true;
      this.isNo = false;
    } else {
      this.isYes = false;
      this.isNo = true;
    }
    this.isNotMatch = true;
  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  getPassword(event){
    this.password = event;
  }
  getConfirmPassword(event){
    this.confirmPassword = event;
    if(this.password != this.confirmPassword ){
      this.isNotMatch = true;
    } else {
      this.isNotMatch = false;
    }
  }

  signup(fullname:string, email:string, password:string, cpassword:string, phone:string){

    if(!this.isNotMatch){

    this.signupPerson = {
        name: fullname,
        email: email,
        password: password,
        cpassword: cpassword,
        phone: phone
      }
      this.sendService.signup(this.signupPerson)
        .subscribe(data => {
            if(data){
              if(data.success == undefined ){
                this.router.navigate(["/home"]);
              }else if(data.success == false){
                // console.log(data);
                if(data.error.name){
                  this.snackBar.open(data.error.name,null, Snack.OPTIONS);
                } else {
                  // console.log(data.error.email);

                  if(data.error.email){
                    this.snackBar.open(data.error.email, null, Snack.OPTIONS);
                  } else {
                    // console.log(data.error.password);
                    if(data.error.password){
                      this.snackBar.open(data.error.password, null, Snack.OPTIONS);
                    } else {
                      this.snackBar.open(data.error.error, null, Snack.OPTIONS);
                    }
                  }
                }
            }
          }
        },
        error => {
          this.snackBar.open(error.error, "5", Snack.OPTIONS);
        });
    } else {
      this.snackBar.open("The passwords do not match!", null, Snack.OPTIONS);
    }

 }

  send(fullname: string, email: string){
    if(fullname.length < 3){
      this.snackBar.open("The Name can't be less than 3 characters!",null, Snack.OPTIONS);
    }
    if(email.length < 3){
      this.snackBar.open("The E-mail can't be less than 3 characters!",null, Snack.OPTIONS);
    }
    if(fullname.length >= 3 && email.length >= 3){
    this.autorizedPerson = {
      name: fullname,
      email: email,
      new: true
    }
    this.sendService.send(this.autorizedPerson)
    .subscribe(
        data => {
          if(data.success){
              this.snackBar.open("E-mail sent to: "+ this.autorizedPerson.email, null, Snack.OPTIONS);
              this.router.navigate(['/login']);
          } else {
              this.snackBar.open(data.error.email, null, Snack.OPTIONS);
          }
      },
      error => {
          this.snackBar.open(error.error, null, Snack.OPTIONS);
      });
    }
  }
}
