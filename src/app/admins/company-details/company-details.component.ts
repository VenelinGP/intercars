import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

import { AuthenticationService, AdminService, ValidationService } from "../../_services/index";

import { MatRadioChange, MatSnackBar } from '@angular/material';
import { Company } from "../../_models/index";
import { Router, ActivatedRoute } from "@angular/router";
import { Snack } from "../../_constants/snackbaroptions";

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {

  id: number;
  currentToken: string;
  currentId: number;
  isCompanyIsEmpty: boolean;
  invoiceAddress: string;
  is_click: boolean;
  isAbove: boolean;
  isOther: boolean;
  isNewCompany: boolean;

  paymentValue: string;
  currentCompany: Company;
  oldCountry: string;
  oldComment: string;
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
    private adminService: AdminService,
    private validator: ValidationService,
    private router: Router,
    private route: ActivatedRoute,

    private authenticationService: AuthenticationService, private snackBar: MatSnackBar ) { 
      this.currentToken = localStorage.getItem('currentToken');
      this.oldCountry = '';

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
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.loadUserProfile();
    this.filteredOptions = this.countryValue.valueChanges
      .pipe(
        startWith(''),
        map(country => this.filter(country))
      );
  }

  private loadUserProfile() {
    this.adminService.getCompanies(this.currentToken)
        .subscribe(result => {
          result.data.forEach(element => {
            if(element.id === this.id){
             this.currentCompany = {
              id: element.id,
              name: element.name,
              address: element.address,
              postcode: element.postcode,
              country: element.country,
              city: element.city,
              EIK: element.EIK,
              invoice_address: element.invoice_address,
              is_click: element.is_click,
              VAT: element.VAT,
              paymentMethod: element.paymentMethod,
              comment: element.comment
             }
             this.oldCountry = element.country;
             this.invoiceAddress = element.invoice_address;
             if(this.invoiceAddress == this.currentCompany.address){
               this.isAbove = true;
             } else {
               this.isOther = true;
             }
             this.is_click = element.is_click;
             this.paymentValue = element.paymentMethod;
          }

          });
            
        },
        error =>{
            // console.log(error.message);
            if ( error.message == "Token has expired" ) {
              this.authenticationService.logout();
              this.snackBar.open("Your session has expired!", null, Snack.OPTIONS)
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
  id: this.id,
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
// console.log(123, this.currentToken);
    this.adminService.editCompany(company, this.currentToken)
      .subscribe(result => {
        if(result.success == true){
          this.snackBar.open('The company was saved successfully!', null, Snack.OPTIONS);
          this.router.navigate(['/admins/companies']);
        } else {
          this.snackBar.open('The company was saved successfully!', null, Snack.OPTIONS);
        }
      })
  }

  filter(val: string): string[] {
    return this.options.filter(option =>  option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
}
