import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService, ExcelService } from '../../_services';
import { Snack } from "../../_constants/snackbaroptions";

@Component({
  selector: 'advert-report',
  templateUrl: './advert-report.component.html',
  styleUrls: ['./advert-report.component.css']
})
export class AdvertReportComponent implements OnInit {
  id: number;
  currentToken: string;

  bookedAreaAdvert: Array<any>;
  totaladvertprice: number;
  conftotaladvertising: number;
  pendtotaladvertising: number;

  displayedColumns = ['title', 'options', 'price', 'qty', 'total', 'date', 'type', 'delete'];
  excelColumns = {
    'title': 'Title',
    'options': 'Options',
    'price': 'Price/pc',
    'qty': 'Pc',
    'total': 'Total price',
    'date': 'Date',
    'type': 'Status',
    'delete': 'Delete'
  };
  dataSource = new MatTableDataSource(this.bookedAreaAdvert);


  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  @Input() companyName: string;
  constructor(private router: Router, private route: ActivatedRoute, private adminService: AdminService, public excelService: ExcelService, private snackBar: MatSnackBar) {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.currentToken = localStorage.getItem('currentToken');
    this.bookedAreaAdvert = [];
    this.totaladvertprice = 0
    this.conftotaladvertising = 0;
    this.pendtotaladvertising = 0
   }

  ngOnInit() {
    this.getAllAdvertising();
  }

  reset(){
    this.bookedAreaAdvert = [];
    this.totaladvertprice = 0
    this.conftotaladvertising = 0;
    this.pendtotaladvertising = 0
  }

  getAllAdvertising(){
    this.adminService.getCompanyAdvertisingReport(this.id, this.currentToken)
      .subscribe(result => {
        console.log(11, result);
        if(result.data.ServiceOrder != null){
          result.data.ServiceOrder.forEach(a => {
            if(a.qty > 0 && a.service_id < 48){
              let adv = {
                id: a.id,
                title: a.service_name,
                options: a.options,
                price: a.service_price,
                qty: a.qty,
                unit: a.service_unit,
                total: +a.service_price,
                date: a.created_at,
                type: 'pending'
              }
              this.pendtotaladvertising += adv.total;
              this.totaladvertprice += adv.total;
              this.bookedAreaAdvert.push(adv);
              // console.log(this.bookedAdvertising);
            }
          })
        }

        this.adminService.getCompanyConfirmedAdvertisingReport(this.id, this.currentToken)
        .subscribe(result => {
          console.log(12, result.data.OrderAds);
          if(result.data.OrderAds != null){
            result.data.OrderAds.forEach(order =>{
              order.ServiceOrder.forEach(a =>{
                  if(+a.qty > 0 && a.service_id < 48){
                    let adv = {
                      id: a.id,
                      title: a.service_name,
                      options: a.options,
                      price: a.service_price,
                      qty: a.qty,
                      unit: a.service_unit,
                      total: +a.price,
                      date: a.created_at,
                      type: 'confirmed'
                    }
                    this.conftotaladvertising += adv.total;
                    this.totaladvertprice += adv.total;
                    this.bookedAreaAdvert.push(adv);
                   console.log(this.bookedAreaAdvert);
                  }
              });
            })
          }
          this.dataSource = new MatTableDataSource(this.bookedAreaAdvert);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      })
    })
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  exportToExcel() {
    this.excelService.exportAsExcelFile(this.bookedAreaAdvert, 'Booked_Advertising_' + this.companyName, this.excelColumns);
  }

  deleteAds(id){
    console.log(id)
    this.adminService.getDeleteAds(id, this.currentToken)
    .subscribe(result => {
      // console.log(result);
      if(result.success){
        this.snackBar.open("Item was deleted successfully!", null, Snack.OPTIONS);
        this.reset()
        this.getAllAdvertising()
      }
      else {
        this.snackBar.open(result.error.error[0], null, Snack.OPTIONS);
      }
    });
  }

}
