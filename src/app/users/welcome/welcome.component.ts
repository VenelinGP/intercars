import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService, ValidationService, AuthenticationService } from "../../_services/index";
import { MatSnackBar } from "@angular/material";
import { Company } from "../../_models/index";
import { Snack } from '../../_constants/snackbaroptions';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  currentToken: string;
  currentCompany: Company;

  constructor(
    private router: Router, 
    private userService: UserService, 
    private authenticationService: AuthenticationService,
    private validator: ValidationService,
    private snackBar: MatSnackBar) { 
      this.currentToken = localStorage.getItem('currentToken');

      this.currentCompany = {
        name: "",
        address: "",
        postcode: "",
        country: "",
        city: "",
        EIK: "",
        invoice_address: "",
        is_click: false,
        VAT: "",
        paymentMethod: "",
        comment: ""
      }

      this.loadUserProfile()

    }

  ngOnInit() {
  }
  loadUserProfile(){
    this.userService.getProfile(this.currentToken)
    .subscribe(result => {
        if(result.success){
          if(result.data.company_id == null){
            this.router.navigate(['/users/profile']);
          } else {
            this.currentCompany = {
              id: result.company.id,
              name: result.company.name,
              address: result.company.address,
              postcode: result.company.postcode,
              country: result.company.country,
              city: result.company.city,
              EIK: result.company.EIK,
              invoice_address: result.company.invoice_address,
              is_click: result.company.is_click,
              VAT: result.company.VAT,
              paymentMethod: result.company.paymentMethod,
              comment: result.company.comment
            }
            if(this.validator.checkCompanyDetails(this.currentCompany) == false){
              this.router.navigate(['/users/profile']);
            }
          }
        } else {
          this.router.navigate(['/login']);
        }
    },
    error => {
      if ( error.message == "Token has expired" ) {
        this.authenticationService.logout();
        this.snackBar.open("Your session has expired!",null, Snack.OPTIONS)
        this.router.navigate(["/login"]);
      }
    })
  }
}
