import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from "../../_services/index";
import { User } from "../../_models/index";
import { MatSnackBar } from "@angular/material";

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Snack } from "../../_constants/snackbaroptions";


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  user: User;
  public isNotMatch;
  public password: string;
  public confirmPassword: string;
  // cpassword: string;
  currentRole: string;
  currentToken: string;
  answer: boolean;
  constructor(private userService: UserService, public dialog: MatDialog, private snackBar: MatSnackBar) { 
    this.currentToken = localStorage.getItem('currentToken');
    this.user = {
      name: "",
      password: "",
      email: "",
      phone: "",
      position: "",
      role_id: 0
    }
    this.password ="";
    this.confirmPassword="";
    this.currentRole = "";

  }

  ngOnInit() {
    this.loadUserProfile();
  }
  save(fullname, phone, position){
    if(!(fullname == undefined || fullname == "")){
      this.user.name = fullname;
    }
    if(!(phone == undefined || phone == "")){
      this.user.phone = phone;
    }
    if(!(position == undefined || position == "")){
      this.user.position = position;
    }   
    this.userService.updateCurrentUser(this.user, this.currentToken)
      .subscribe(result => {
        this.loadUserProfile();
        //TODO Error
    });
    this.snackBar.open('Profile details was updated!', null, Snack.OPTIONS)
  }

  change(password, cpassword){
    if(password == cpassword){
      if(!(password == undefined || password == "")){
        this.user.password = password;
        this.userService.updateCurrentUser(this.user, this.currentToken)
          .subscribe(result => {
            if(result.success){
              this.snackBar.open("Password changed!", null, Snack.OPTIONS);
            }
          })
      }
    } else {
      this.snackBar.open("Password does not match!", null, Snack.OPTIONS);
    }
  }

  private loadUserProfile() {
    this.userService.getProfile(this.currentToken)
        .subscribe(result => {
          this.user = {
            name: result.data.name,
            password: "",
            email: result.data.email,
            phone: result.data.phone,
            position: result.data.position,
            role_id: result.data.role_id
          }
          this.loadRole();
          return this.user;
        },
        error =>{
            // console.log(error);
        });
  }
  private loadRole(){
    this.userService.getRoles(this.currentToken)
      .subscribe(roles =>{
          roles.data.forEach(role => {
            if(role.id == this.user.role_id){
              this.currentRole = role.name;
            }
          });
      })
  }
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

  openDialog(pass: string, cpass: string): void {
    let dialogRef = this.dialog.open(ModalAnswer, {
      width: '480px',
      data: { answer: this.answer }
    });
    this.password = pass;
    this.confirmPassword = cpass;
    dialogRef.afterClosed().subscribe(result => {
      this.answer = result;
      if(result){
        this.change(this.password, this.confirmPassword);
      }    });
  }
}

@Component({
  selector: 'modal-answer',
  templateUrl: 'modal-answer.html',
  styleUrls: ['./modal-answert.css']
})
export class ModalAnswer {

  constructor(
    public dialogRef: MatDialogRef<ModalAnswer>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}