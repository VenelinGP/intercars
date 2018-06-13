import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../_services/index';
import { MatSnackBar } from "@angular/material";
import { Snack } from "../_constants/snackbaroptions";

import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    private matcher;
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }
  
@Component({
    moduleId: module.id,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    returnUrl: string;

    private color = 'primary';
    private mode = 'indeterminate';
    private value = 25;

    constructor( 
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private snackBar: MatSnackBar) {
         }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email
      ]);
    
    login(username: string, password: string) {
        if( !(username=="" || password == "") ){
            let user = {
                email: username,
                password: password
            }
        this.authenticationService.login(user)
            .subscribe(data => {
                    if(data.success){
                        this.router.navigate([this.returnUrl]);
                    } else {
                        this.snackBar.open(data.error.email, null, Snack.OPTIONS)
                    }
                },
                error => {
                    this.snackBar.open(error.error, null, Snack.OPTIONS)
                });
            } else{
                this.snackBar.open("Email and password is empty!", null, Snack.OPTIONS)
            }
    }
}
