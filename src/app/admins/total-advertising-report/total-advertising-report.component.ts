import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService, ExcelService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-total-advertising-report',
  templateUrl: './total-advertising-report.component.html',
  styleUrls: ['./total-advertising-report.component.css']
})
export class TotalAdvertisingReportComponent implements OnInit {
  id: number;
  options: string;
  currentToken: string;
  advertisingname: string;
  advertisings:Array<any>;
  totalqty: number;

  displayedColumns = ['id', 'companyname', 'pc', 'price'];
  excelColumns = {
   // 'id': 'id',
    'companyname': 'Company name',
    'qty': 'Pc',
    'price': 'Price'
  };
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor( private route: ActivatedRoute, private adminService: AdminService, private excelService: ExcelService) {
    this.route.params.subscribe(params => {
      console.log(params);
      this.id = params.id;
      this.options = params.options;
      this.currentToken = localStorage.getItem('currentToken');
      this.advertisings = [];
      this.totalqty = 0;
    })
  }
  ngOnInit() {
    this.getAdvertisingById();
  }


  private getAdvertisingById() {
    this.adminService.getServiceAndAdvertising(this.id, this.options, this.currentToken)
      .subscribe(result => {
        console.log(1, result);
        if(result.success){
          this.advertisingname = result.data[0].name;
        }
        result.data.forEach(s => {
          let service = {
            id: s.id,
            companyname: s.companyName,
            qty: s.qty,
            price: s.price
          }
          this.totalqty += +s.qty;
          this.advertisings.push(service);
        });
        this.dataSource = new MatTableDataSource(this.advertisings);
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
    this.excelService.exportAsExcelFile(this.advertisings, 'Аdvertisings_'+this.advertisingname, this.excelColumns);
  }
}
