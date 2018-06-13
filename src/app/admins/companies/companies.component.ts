import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AdminService, SendService, AuthenticationService } from "../../_services/index";
import { Company } from "../../_models/index";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";
import { Snack } from "../../_constants/snackbaroptions";

@Component({
  selector: "app-companies",
  templateUrl: "./companies.component.html",
  styleUrls: ["./companies.component.css"]
})
export class CompaniesComponent implements OnInit {
  addCompany: Company;
  companies: Company[];
  currentToken: string;

  displayedColumns = ["id", "name", "city", "country", "created_at", "updated_at", "edit"];
  dataSource: MatTableDataSource<Company>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private router: Router,
    private sendService: SendService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar ) {
    this.currentToken = localStorage.getItem("currentToken");
    this.companies = [];
  }

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies(){
    this.adminService.getCompanies(this.currentToken)
    .subscribe(result => {
      // console.log(result);

      result.data.forEach(element =>{
        let company: Company = {
          id: element.id,
          name: element.name,
          country: element.country,
          city: element.city,
          created_at: element.created_at,
          updated_at: element.updated_at
        }
        this.companies.push(company);
      });
      this.dataSource = new MatTableDataSource<Company>(this.companies);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
  openDialog(): void {
    let dialogRef = this.dialog.open(ModalAddCompany, {
      width: '450px',
      data: {data: this.addCompany}
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      let  newCompany = {
        name: result.name,
        VAT: result.VAT,
        EIK: result.EIK
      }
      //TODO Snackbar messages
      this.adminService.addCompany(newCompany, this.currentToken)
        .subscribe(result =>{
          // console.log(result);
          if(result.success == true){
            this.companies = [];
            this.loadCompanies();
          }
        })
    })
  }
}

@Component({
  selector: 'modal-add-company',
  templateUrl: 'modal-add-company.html',
  styleUrls: ['./modal-add-company.css']
})
export class ModalAddCompany {

  constructor(
    public dialogRef: MatDialogRef<ModalAddCompany>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

