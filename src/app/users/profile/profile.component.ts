import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

import { UserService, AuthenticationService, ValidationService } from "../../_services/index";

import { MatRadioChange, MatSnackBar } from '@angular/material';
import { Company } from "../../_models/index";
import { Router } from "@angular/router";
import { Snack } from "../../_constants/snackbaroptions";

// *ngIf='isNewCompany || !isCompanyIsEmpty'
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent  {
  currentToken: string;
  currentId: number;
  isCompanyIsEmpty: boolean;
  isNewCompany: boolean;
  invoiceAddress: string;
  oldCountry: string;
  oldComment: string;
  is_click: boolean;
  isAbove: boolean;
  isOther: boolean;
  paymentValue: string;
  comment: string;
  currentCompany: Company;
  countryValue: FormControl = new FormControl();

  options = [ 
    'Albania', 'Andora', 'Armenia', 'Austria',
    'Azerbaijan', 'Belarus', 'Belgium', 'Bosnia and Herzegovina',
    'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
    'Denmark', 'Estonia', 'Finland', 'France',
    'Georgia', 'Germany', 'Greece', 'Hungary',
    'Iceland', 'Ireland', 'Italy', 'Kazakhstan',
    'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania',
    'Luxembourg', 'Macedonia (FYROM)', 'Malta', 'Moldova',
    'Monaco', 'Montenegro', 'Netherlands', 'Norway',
    'Poland', 'Portugal', 'Romania', 'Russia',
    'San Marino', 'Serbia', 'Slovakia', 'Slovenia',
    'Spain', 'Sweden', 'Switzerland', 'Turkey',
    'Ukraine', 'United Kingdom (UK)', 'Vatican City (Holy See)'];

  filteredOptions: Observable<string[]>;
  payments = [
    {value: 'Invoice', viewValue: 'Invoice'},
    {value: 'Compensation', viewValue: 'Compensation upon further agreement'},
  ]

  constructor(
    private userService: UserService,
    private router: Router,
    private validator: ValidationService,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar ) { 

      this.currentToken = localStorage.getItem('currentToken');
      
      this.isCompanyIsEmpty = false;
      this.invoiceAddress = "";
      this.oldComment = "";
      this.isAbove = false;
      this.isOther = false;

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
      this.loadUserProfile();
  }

  ngOnInit() {
    // this.loadUserProfile();
    // this.countryValue.setValue(this.currentCompany.country);
    this.filteredOptions = this.countryValue.valueChanges
      .pipe(
        startWith(''),
        map(country => this.filter(country))
      );
  }

  private loadUserProfile() {
    this.userService.getProfile(this.currentToken)
        .subscribe(result => {
             if(result.data.company_id == null){
                 this.isCompanyIsEmpty = false;
                 this.isNewCompany = true;
             } else { 
               this.currentId = result.company.id;
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
                this.invoiceAddress = result.company.invoice_address;
                this.oldCountry = result.company.country;
                this.oldComment = result.company.comment;
                if(this.invoiceAddress == this.currentCompany.address){
                  this.isAbove = true;
                } else {
                  this.isOther = true;
                }
                this.is_click = result.company.is_click;
                this.paymentValue = result.company.paymentMethod;
                // console.log(this.validator.checkCompanyDetails(this.currentCompany));
                if(this.validator.checkCompanyDetails(this.currentCompany)){
                  this.isCompanyIsEmpty = true;
                }
             }
            
        },
        error =>{
            if ( error.message == "Token has expired" ) {
              this.authenticationService.logout();
              this.snackBar.open("Your session has expired!",null, Snack.OPTIONS)
              this.router.navigate(["/login"]);
            }
        });
  }

  radioChange(event: MatRadioChange,  country: string, city:string, post: string, address: string){
    if(event.value == 1){
      this.invoiceAddress = "";
      this.invoiceAddress = country+ "\n" + city+ "\n" + post+ "\n" +address;
    }
    if(event.value == 2){
      this.invoiceAddress = "";
    }
  }

  save(name, address, postcode, countryValue, city, eik, invoice_address, EIK, is_click, paymentMethod, commentValue){
// TODO Validations
    let VAT = EIK;
    let country = countryValue || this.oldCountry;
    let comment = commentValue || this.oldComment;
    if(paymentMethod == "Invoice"){
      comment = "";
    }
    let company: Company = {
      id: this.currentId,
      name,
      address,
      postcode,
      country,
      city,
      invoice_address,
      EIK,
      VAT,
      is_click,
      paymentMethod,
      comment
    }
    // TODO Show Snackbar
    if(this.isNewCompany){
      // if(this.validator.checkCompanyDetails(company))
      this.userService.createCompany(company, this.currentToken)
      .subscribe(result => {
        if(result.success){
          this.snackBar.open("The Company was created!", null, Snack.OPTIONS);
          this.router.navigate(['/users/window']);
        } else {
          this.snackBar.open(result.error.name, null, Snack.OPTIONS);
        }
      });
    } else {
      if(!this.validator.checkCompanyDetails(company)){
        this.snackBar.open('In order to proceed you should fill in all the fields!',null, Snack.OPTIONS );
      } else {
        this.userService.editCompany(company, this.currentToken)
        .subscribe(res => {
          this.userService.getProfile(this.currentToken)
            .subscribe(result => {
              this.snackBar.open("The Company was updated!", null, Snack.OPTIONS);
              this.router.navigate(['/users/window']);
        })
      })
    }
  }
}

  filter(val: string): string[] {
    return this.options.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
}
