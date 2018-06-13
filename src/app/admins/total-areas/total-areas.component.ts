import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService, ExcelService, AuthenticationService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Snack } from '../../_constants/snackbaroptions';
import { Router } from '@angular/router';

@Component({
  selector: 'total-areas',
  templateUrl: './total-areas.component.html',
  styleUrls: ['./total-areas.component.css']
})
export class TotalAreasComponent implements OnInit {
  currentToken: string;
  totalarea: number;
  totalBooths: number;
  totalprice: number;
  bookedAreas: Array<any>;

  displayedColumns = ['id', 'companyname', 'areatype', 'areasqm', 'boothtype', 'boothsqm', 'total', 'date'];
  excelColumns = {
    // 'id': 'id',
    'companyname': 'Company Name',
    'areatype': 'Area Type',
    'areasqm': 'Area sqm',
    'boothtype': 'Booth Type',
    'boothsqm': 'Booth sqm',
    'total': 'Total Price',
    'date': 'Date'
  };
  dataSource = new MatTableDataSource(this.bookedAreas);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) areaSort: MatSort;

  constructor(private adminService: AdminService, private authenticationService: AuthenticationService, private router: Router, private snackBar: MatSnackBar, private excelService: ExcelService) {
    this.currentToken = localStorage.getItem('currentToken');
    this.totalarea = 0;
    this.totalBooths = 0;
    this.totalprice = 0;
    this.bookedAreas = [];
  }

  ngOnInit() {
    this.loadCompanyAreas();
  }

  loadCompanyAreas(){
    this.adminService.getAllAreaReports(this.currentToken)
      .subscribe(result => {
        if(result.success){
          console.log("1", result.data[0]);
          let areas = result.data[0];
          areas.forEach(area => {
            let bookedArea = {
              id: area.id,
              companyname: area.companyName,
              areatype: area.place_type,
              areasqm: area.area,
              boothtype: area.name,
              boothsqm: area.area,
              total: area.price,
              date: area.updated_at
            }

            this.totalarea += +area.area;
            this.totalBooths += +area.area;
            this.totalprice += +area.price;

            this.bookedAreas.push(bookedArea);
          });

          console.log(this.bookedAreas);
          this.dataSource = new MatTableDataSource(this.bookedAreas);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.areaSort;
        }
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
    this.excelService.exportAsExcelFile(this.bookedAreas, 'Exhibition Area Report', this.excelColumns);
  }
}
