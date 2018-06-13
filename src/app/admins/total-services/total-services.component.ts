import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService, ExcelService, AuthenticationService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Snack } from '../../_constants/snackbaroptions';
import { Router } from '@angular/router';

@Component({
  selector: 'total-services',
  templateUrl: './total-services.component.html',
  styleUrls: ['./total-services.component.css']
})
export class TotalServicesComponent implements OnInit {
  currentToken: string;
  services: Array<any>;
  displayedColumns = ['options', 'id', 'name', 'pc', 'price'];
  excelColumns = {
    // 'id': 'id',
    'name': 'Option Name',
    'options': 'Options',
    'qty': 'Pc',
    'price': 'Price'
  };
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private adminService: AdminService, private authenticationService: AuthenticationService, private router: Router, private snackBar: MatSnackBar, private excelService: ExcelService) {
    this.currentToken = localStorage.getItem('currentToken');
    this.services = [];
  }

  ngOnInit() {
    this.loadAllServices();
  }
  loadAllServices(){
    this.adminService.getAllAdditionalReports(this.currentToken)
      .subscribe(result => {
        if(result.success){
          this.services = result.data.filter(x => x.qty > 0);
          console.log(this.services);
          this.dataSource = new MatTableDataSource(this.services);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        }
        // TODO else
      },
      error => {
        this.snackBar.open(error.message, null, Snack.OPTIONS);
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  exportToExcel() {
    this.excelService.exportAsExcelFile(this.services, 'Additional_Services_Report_', this.excelColumns);
  }
}
