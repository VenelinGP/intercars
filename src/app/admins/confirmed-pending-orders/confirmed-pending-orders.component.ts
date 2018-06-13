import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService, ExcelService, AuthenticationService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Snack } from '../../_constants/snackbaroptions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmed-pending-orders',
  templateUrl: './confirmed-pending-orders.component.html',
  styleUrls: ['./confirmed-pending-orders.component.css']
})
export class ConfirmedPendingOrdersComponent implements OnInit {
  currentToken: string;
  orders: Array<any>;
  totalconfirmed: number;
  totalpending: number;
  totalorders: number;

  displayedColumns = ['id', 'name', 'pending', 'confirmed'];
  excelColumns = { 
        // 'id': 'id',
        'name': 'Company Name',
        'pending': 'Pending Orders',
        'confirmed': 'Confirmed Orders' 
      };
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor( private adminServices: AdminService, private authenticationService: AuthenticationService, private router: Router, private snackBar: MatSnackBar, private excelService: ExcelService ) {
    this.currentToken = localStorage.getItem('currentToken');
    this.orders =[];
    this.totalconfirmed = 0;
    this.totalpending = 0;
    this.totalorders = 0;
  }

  ngOnInit() {
    this.getConfirmedPendingOrders();
  }

  getConfirmedPendingOrders(){
    this.adminServices.getAllCompaniesReport(this.currentToken)
    .subscribe(result => {
      if(result.success){
        result.data[0].forEach(el => {
          if(el.sumForPending > 0 || el.sumForConfirmed > 0){

          let orderCompany = {
            id: el.id,
            name: el.name,
            pending: el.sumForPending,
            confirmed: el.sumForConfirmed,
           }
           this.totalconfirmed += +orderCompany.confirmed;
           this.totalpending += +orderCompany.pending;
           this.orders.push(orderCompany);
          }
        });
        this.totalorders += this.totalconfirmed + this.totalpending;

        this.dataSource = new MatTableDataSource(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }
      console.log(result);
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
    this.excelService.exportAsExcelFile(this.orders, 'Confirmed_and_Pending_orders_',this.excelColumns);
  }
}
