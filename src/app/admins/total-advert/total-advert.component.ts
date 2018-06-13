import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService, ExcelService, AuthenticationService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Snack } from '../../_constants/snackbaroptions';
import { Router } from '@angular/router';

@Component({
  selector: 'total-advert',
  templateUrl: './total-advert.component.html',
  styleUrls: ['./total-advert.component.css']
})
export class TotalAdvertComponent implements OnInit {
  currentToken: string;
  advertising: Array<any>;
  displayedColumns = ['id', 'name', 'pc', 'price'];
  excelColumns = {
    //'id': 'Order',
    'name': 'Service Name',
    'qty': 'Pc',
    'price': 'Price'
  };
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private adminService: AdminService, private authenticationService: AuthenticationService, private router: Router, private snackBar: MatSnackBar, private excelService: ExcelService) {
    this.currentToken = localStorage.getItem('currentToken');
    this.advertising = [];
  }

  ngOnInit() {
    this.loadAllAdvertising();
  }
  loadAllAdvertising(){
    this.adminService.getAllAdvertisingReports(this.currentToken)
      .subscribe(result => {
        if(result.success){
          this.advertising = result.data.filter(x => x.qty > 0);
          console.log(this.advertising);
          this.dataSource = new MatTableDataSource(this.advertising);
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
    this.excelService.exportAsExcelFile(this.advertising, 'Advertising_Services_Report_',this.excelColumns);
  }
}
