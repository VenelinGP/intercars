import { Component, Input, ChangeDetectorRef, Injectable } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthenticationService, UserService, ValidationService, SharedService } from "../_services/index";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { Snack } from "../_constants/snackbaroptions";
import { Observable } from 'rxjs/Rx'; 

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent { 
  currentToken: string;
  interval: any;
  isRoute: boolean;
  isHasBooths: boolean;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private validator: ValidationService,
    private changeDetectorRef: ChangeDetectorRef,
    private sharedService: SharedService,
    private snackBar: MatSnackBar,
    private router: Router,
    private media: MediaMatcher ) {

      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
      this.currentToken = localStorage.getItem('currentToken');
      sharedService.changeEmitted$.subscribe(result => {
        this.isHasBooths = result;
      });
    }
  ngOnInit() {
    this.loadUserProfile();
    let time = Date.now();
    this.userService.getNotifications(this.currentToken)
      .subscribe(result => {
        console.log(time, result);
      })
    this.interval = setInterval(() => {
      this.userService.getNotifications(this.currentToken)
        .subscribe(result => {
          time = Date.now();
          console.log(time, result);
        })
    }, 5*60*1000);

    //this.getAreaAndBoots();
    this.router.navigate['/users/orders'];
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private loadUserProfile() {
    this.userService.getProfile(this.currentToken)
        .subscribe(result => {
          if(result.data.company_id == null){
            this.isRoute = false;
          } else {
             if(this.validator.checkCompanyDetails(result.company)){
                this.isRoute = true;
             } else {
                this.isRoute = false;
             }
            }
        },
        error =>{
            if ( error.message == "Token has expired" ) {
              // console.log("TOKEN:", error.message);
              this.authenticationService.logout();
              this.snackBar.open("Your session has expired!", null, Snack.OPTIONS);
              this.router.navigate(["/login"]);
            }
        });
  }

  show(){
    this.snackBar.open("You should fill all company fields!","", Snack.OPTIONS)
  }

  
}
