import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService, ExcelService, AuthenticationService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Snack } from '../../_constants/snackbaroptions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-companiesreport',
  templateUrl: './companiesreport.component.html',
  styleUrls: ['./companiesreport.component.css']
})
export class CompaniesreportComponent implements OnInit {
  currentToken: string;
  companies: Array<any>;

  displayedColumns = ['id', 'name', 'company', 'email', 'exhibitorscount', 'created', 'updated'];
  excelColumns = {
    // 'id': 'id',
    'name': 'Authrised Exhibitor',
    'company': 'Company Name',
    'email': 'E-mail',
    'exhibitorscount': 'Exhibitors',
    'created': 'Date created',
    'updated': 'Date edited'
  };
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor( private adminServices: AdminService, private authenticationService: AuthenticationService, private router: Router, private snackBar: MatSnackBar, private excelService: ExcelService ) {
    this.currentToken = localStorage.getItem('currentToken');
    this.companies =[];
  }

  ngOnInit() {
    this.getCompanyInfo();
  }

  getCompanyInfo(){
    this.adminServices.getCompanyInfo(this.currentToken)
    .subscribe(result => {
      if(result.success){
        console.log(result.data);
        result.data.forEach(el => {
              let company = {
                id: el.id,
                name:  el.аuthorisedExhibitorName,
                company: el.name ,
                email: el.аuthorisedExhibitorEmail,
                exhibitorscount: el.exhibitorscount,
                created: el.created_at,
                updated: el.updated_at
               }
               this.companies.push(company);
               this.dataSource = new MatTableDataSource(this.companies);
               this.dataSource.paginator = this.paginator;
               this.dataSource.sort = this.sort;


        });
        console.log("Aut ", this.companies.length); 
      }
    },
    error => {
      this.snackBar.open(error.message, null, Snack.OPTIONS);
      this.authenticationService.logout();
      this.router.navigate(["/login"]);
    });

  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  exportToExcel() {
    this.excelService.exportAsExcelFile(this.companies, 'Companies_',this.excelColumns);
  }

}
