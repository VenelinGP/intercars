import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AdminService, AuthenticationService } from "../../_services/index";
import { UserData, User, Company } from "../../_models/index";
import { MatSnackBar } from "@angular/material";
import { Snack } from '../../_constants/snackbaroptions';

@Component({
  selector: 'app-exhibitor-details',
  templateUrl: './exhibitor-details.component.html',
  styleUrls: ['./exhibitor-details.component.css']
})
export class ExhibitorDetailsComponent implements OnInit {
  companies: CompanyLoad[];

  currentToken: string;
  currentRole: string;
	exhibitor: any;
  id: number;
  roleValue: string;
  oldRoleValue: string;
  oldCompanyId: number;
  newCompanyId: number;

  roles = [
    {value: '3', viewValue: 'Authorized Exhibitor'},
    {value: '4', viewValue: 'Exhibitor'},
  ]

  // companies = [
  //   {value: 'Invoice', viewValue: 'Invoice'},
  //   {value: 'Compensation', viewValue: 'Compensation /credit memo/'},
  // ]
  constructor(private router: Router, private route: ActivatedRoute, private adminService: AdminService, private authenticationService: AuthenticationService, private snackBar: MatSnackBar) { 
    this.currentToken = localStorage.getItem('currentToken');
    this.currentRole = localStorage.getItem('currentRole');
    this.oldCompanyId = 0;
    this.companies = [];
    this.exhibitor = {
        company_id: null,
        company_name: "",
        id: 0,
        name: "",
        email: "",
        phone:"",
        position: "",
        roleId: 0,
        created_at: "",
        updated_at: ""
      }
  }
  ngOnInit() {
    this.loadCompanies()
    this.loadUserData();
    this.id = +this.route.snapshot.paramMap.get('id');
  }

  loadCompanies(){
    this.adminService.getCompanies(this.currentToken)
    .subscribe(result => {
      result.data.forEach(element =>{
        let company: CompanyLoad = {
          id: element.id,
          name: element.name,
        }
        this.companies.push(company);
      });
    },
      error => {
        this.snackBar.open(error.message, null, Snack.OPTIONS);
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
      });
  }
  loadUserData(){
    this.adminService.getExhibitors(this.currentToken)
      .subscribe( result =>{
              result.data.forEach(element => {
                  if(+element.id == this.id){
                      this.exhibitor = {
                          id: +element.id,
                          company_id: element.company_id,
                          company_name: element.company_name,
                          name: element.name,
                          email: element.email,
                          phone: element.phone,
                          position: element.position,
                          roleId: element.role_id,
                          created_at: element.created_at,
                          updated_at: element.updated_at
                      }
                      if(this.exhibitor.roleId == 3){
                        this.roleValue = '3';
                      } else {
                        this.roleValue = '4';
                      }
                      this.oldRoleValue = this.roleValue; 
                      this.oldCompanyId = this.exhibitor.company_id;
                      this.newCompanyId = this.exhibitor.company_id;
                  }
              })
      })
  }
  save(company_id, fullname, email, phone, position, roleValue){
if(company_id == null && roleValue == "3"){
  if(this.currentRole == "1"){
    this.exhibitor = {
        id: this.id,
        company_id: this.oldCompanyId,
        name: fullname,
        email: email,
        role_id: roleValue,
        phone: phone,
        position: position,
      }
      this.adminService.editAdminsUsers(this.exhibitor, this.currentToken)
        .subscribe(result => {
          if(result.success){
            this.snackBar.open("Exhibitor is updated!", null, Snack.OPTIONS);
            this.loadUserData();
          } else {
            this.snackBar.open(result.error.email, null, Snack.OPTIONS);
            this.loadUserData();
          }
        })
  }

} else if(this.oldCompanyId == null && company_id > 0 && roleValue == '3'){
  this.exhibitor = {
    id: this.id,
    company_id: company_id,
    name: fullname,
    password: "",
    email: email,
    role_id: +roleValue,
    phone: phone,
    position: position,
  }
  this.adminService.linkToCompany(this.exhibitor.id, company_id, this.exhibitor.role_id, this.currentToken)
    .subscribe(result => {
      if(result.success){
        this.snackBar.open("Exhibitor is added to company!", null, Snack.OPTIONS);
        this.loadUserData();
      } 
    }, error => {
        this.snackBar.open(error.error.error[0], null, Snack.OPTIONS);
        this.loadUserData();
    })

} else if (this.oldCompanyId == company_id && this.oldRoleValue == roleValue){
  if(this.currentRole == "1"){
    this.exhibitor = {
        id: this.id,
        company_id: this.oldCompanyId,
        name: fullname,
        email: email,
        role_id: roleValue,
        phone: phone,
        position: position,
      }
      this.adminService.editAdminsUsers(this.exhibitor, this.currentToken)
        .subscribe(result => {
          if(result.success){
            this.snackBar.open("Exhibitor is updated!", null, Snack.OPTIONS);
            this.loadUserData();
          } else {
            this.snackBar.open(result.error.email, null, Snack.OPTIONS);
            this.loadUserData();
          }
        })
  }
} else if (company_id == null && roleValue == '4'){
    this.snackBar.open("Exhibitor should be Authorized Exhibitor!", null, Snack.OPTIONS);
} else if ( this.oldCompanyId == company_id && this.oldRoleValue == '4' && roleValue == '3' ){
  if(this.currentRole == '1' ){
    this.adminService.changeExhibitor(this.id, this.currentToken)
      .subscribe(result => {
        if(result.success){
          this.snackBar.open("Exhibitor changed to Autorazied Exhibitor", null, Snack.OPTIONS);
          this.loadUserData();       
        } else { 
          this.snackBar.open(result.error, null, Snack.OPTIONS);
          this.loadUserData();
        }
      })
  }
} else if( this.oldCompanyId == company_id && this.oldRoleValue == '3' && roleValue == '4') {
    this.snackBar.open("Autorazied Exhibitor cannot change to Exhibitor", null, Snack.OPTIONS);
    this.loadUserData();
    }
  }
}
export class CompanyLoad {
  id: number;
  name: string;
}