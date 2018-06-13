import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService, ExcelService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-total-service-report',
  templateUrl: './total-service-report.component.html',
  styleUrls: ['./total-service-report.component.css']
})
export class TotalServiceReportComponent implements OnInit {
  id: number;
  options: string;
  currentToken: string;
  servicename: string;
  services:Array<any>;
  totalqty: number;

  displayedColumns = ['id', 'companyname', 'area', 'pc', 'price'];
  excelColumns = {
    // 'id': 'id',
    'companyname': 'Company Name',
    'area': 'Area sqm',
    'qty': 'Pc',
    'price': 'Price'
  };
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor( private route: ActivatedRoute, private adminService: AdminService, private excelService: ExcelService ) {
    this.route.params.subscribe(params => {
      console.log(params);
      this.id = params.id;
      this.options = params.options;
      this.currentToken = localStorage.getItem('currentToken');
      this.services = [];
      this.totalqty = 0;
    })
  }

  ngOnInit() {
    this.getServicesById();
  }


  private getServicesById() {
    this.adminService.getServiceAndAdvertising(this.id, this.options, this.currentToken)
      .subscribe(result => {
        console.log(1, result);
        if(result.success){
          this.servicename = result.data[0].name;
        }
        result.data.forEach(s => {
          let service = {
            id: s.id,
            companyname: s.companyName,
            area: s.areaName,
            qty: s.qty,
            price: s.price
          }
          this.totalqty += +s.qty;
          this.services.push(service);
        });
        this.dataSource = new MatTableDataSource(this.services);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  exportToExcel() {
    this.excelService.exportAsExcelFile(this.services, 'Services_' + this.servicename, this.excelColumns);
  }
}
