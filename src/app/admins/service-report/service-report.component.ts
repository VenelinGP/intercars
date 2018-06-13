import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService, ExcelService } from '../../_services';
import { Snack } from "../../_constants/snackbaroptions";

@Component({
  selector: 'service-report',
  templateUrl: './service-report.component.html',
  styleUrls: ['./service-report.component.css']
})
export class ServiceReportComponent implements OnInit {
  id: number;
  currentToken: string;
  services: Array<any>;
  fiteredServ: Array<any>;
  areas: Array<any>;
  bookedAreaService: Array<any>;
  boockedServices: Array<any>;
  free_services: Array<any>;
  add_services: Array<any>;
  pending_servces: Array<any>;
  currentColor: string;
  totalAllServices: number;
  totalAllConfServices: number;
  totalAllPendingServices: number;
  totalserviceprice: number;
  conftotalservice: number;
  pendtotalservice: number;
  selected = 0;

  displayedColumns = ['id', 'title', 'options', 'price', 'qty', 'total', 'date', 'type', 'delete'];
  excelColumns = {
    //'id':'id',
    'title': 'Title',
    'options': 'Options',
    'price': 'Price',
    'qty': 'Pc',
    'total': 'Total price',
    'date': 'Date',
    'type': 'Status',
    'delete': 'Delete'
  };
  dataSource = new MatTableDataSource(this.bookedAreaService);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  @Input() companyName: string;
  constructor(private router: Router, private route: ActivatedRoute, private adminService: AdminService, private excelService: ExcelService, private snackBar: MatSnackBar) {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.currentToken = localStorage.getItem('currentToken');
    this.services = [];
    this.areas = [];
  /// Services
    this.bookedAreaService = [];
    this.boockedServices = [];
    this.free_services = [];
    this.add_services = [];
    this.pending_servces = [];
    this.currentColor= "";
    this.totalAllServices = 0;
    this.totalAllConfServices = 0;
    this.totalAllPendingServices = 0;

    this.totalserviceprice = 0;
    this.conftotalservice = 0;
    this.pendtotalservice = 0;


  }

  ngOnInit() {
    this.getAreaName();
    this.getConfirmedAddServices();
    this.getAllServices();
  }
  getConfirmedAddServices(){
    this.adminService.getCompanyConfirmedServReport(this.id, this.currentToken)
      .subscribe( result => {
        this.boockedServices = result.data.OrderServ;
      })
  }

  reset(){
    this.services = [];
    this.areas = [];
    this.bookedAreaService = [];
    this.boockedServices = [];
    this.free_services = [];
    this.add_services = [];
    this.pending_servces = [];
    this.currentColor = "";
    this.totalAllServices = 0;
    this.totalAllConfServices = 0;
    this.totalAllPendingServices = 0;

    this.totalserviceprice = 0;
    this.conftotalservice = 0;
    this.pendtotalservice = 0;
  }

  getAllServices(){
    this.bookedAreaService = [];
    this.boockedServices = [];
    this.adminService.getCompanyReport(this.id, this.currentToken)
    .subscribe( result => {
      if(result.data != null){
        // console.log(result.data);
        result.data.forEach(el => {
          if(el.Booth == null){
            this.free_services = [];
            this.add_services = [];
            this.pending_servces = [];
            this.pending_servces = el.ServiceOrder.filter(el => el.qty > 0);
            // console.log("1 -", this.pending_servces);
            if(this.free_services.length > 0){
              this.free_services.forEach(s => {
                // console.log(1, s);
                if(s.want){
                  let serv = {
                    id: el.AreaOrder.id,
                    s_id: s.id,
                    title: s.name,
                    options: s.options,
                    price: "free",
                    qty: s.qty,
                    total: "free",
                    date: el.AreaOrder.created_at,
                    type: "confirmed"
                  }
                  this.bookedAreaService.push(serv)
                }
              })
            }
            if(this.add_services.length > 0){
              this.add_services.forEach(s => {
                // console.log(2, s);

                if(s.name !='color'){
                  let serv = {
                    id: el.AreaOrder.id,
                    s_id: s.id,
                    title: s.name,
                    options: s.options,
                    price: 0,
                    qty: s.qty,
                    total: +s.price,
                    date: el.AreaOrder.created_at,
                    type: "confirmed"
                  }
                  this.conftotalservice += serv.total;
                  this.totalserviceprice += serv.total;
                  this.bookedAreaService.push(serv);
                }
              })
            }
            if(this.pending_servces.length > 0){
              this.pending_servces.forEach(s => {
                // console.log(3, s);
                  let serv = {
                    id: el.AreaOrder.id,
                    s_id: s.id,
                    title: s.service_name,
                    options: s.options,
                    price: s.service_price,
                    qty: s.qty,
                    total: +s.service_price*s.qty,
                    date: s.created_at,
                    type: "pending"
                }
                this.pendtotalservice += serv.total;
                this.totalserviceprice += serv.total;
                this.bookedAreaService.push(serv);

              })
            }
          } else {
            this.free_services = [];
            this.add_services = [];
            this.pending_servces = [];
            this.pending_servces = el.ServiceOrder.filter(el => el.qty > 0);

            if(el.Booth.options){
              this.free_services = el.Booth.options;
              if(this.free_services.length > 0){
                // console.log(this.free_services);
                this.free_services.forEach(s => {
                  // console.log(4, s);
                  if(s.want){
                    let serv = {
                      id: el.AreaOrder.id,
                      s_id: s.id,
                      title: s.name,
                      options: s.options,
                      price: "free",
                      qty: s.qty,
                      unit: s.service_unit,
                      total: "free",
                      date: el.AreaOrder.created_at,
                      type: "confirmed"

                    }
                    this.bookedAreaService.push(serv)
                  }
                  if(s.name == 'color'){
                    this.currentColor = '../../../assets/images/'+s.qty+'.jpg';
                    // console.log(this.currentColor);
                  }

                })
              }
            }
            if(this.boockedServices != null){
              this.boockedServices.forEach(area => {
                  if(area.area_id == el.AreaOrder.id){
                    this.add_services = area.ServiceOrders;
                    if(this.add_services.length > 0){
                      this.add_services.forEach(s => {
                        // console.log(5, s);
                          let serv = {
                            id: el.AreaOrder.id,
                            s_id: s.id,
                            title: s.service_name,
                            options: s.options,
                            price: s.service_price,
                            qty: s.qty,
                            unit: s.service_unit,
                            total: +s.price,
                            date: s.created_at,
                            type: "confirmed"
                          }
                          this.conftotalservice += serv.total;
                          this.totalserviceprice += serv.total;
                          this.bookedAreaService.push(serv)
                      })
                    }
                  }
                })

            }
            if(this.pending_servces.length > 0){
              this.pending_servces.forEach(s => {
                // console.log(6, s);
                  let serv = {
                    id: el.AreaOrder.id,
                    s_id: s.id,
                    title: s.service_name,
                    options: s.options,
                    price: s.service_price,
                    qty: s.qty,
                    total: +s.service_price*s.qty,
                    date: s.created_at,
                    type: "pending"
                  }
                  this.pendtotalservice += serv.total;
                  this.totalserviceprice += serv.total;
                  this.bookedAreaService.push(serv);

              })
            }

            let areaPrice = +el.AreaOrder.price;
            let bootPrice = +el.Booth.price;
          }
        })
        // console.log("B:", this.bookedAreas);
        this.totalAllServices = this.totalserviceprice;
        this.totalAllPendingServices = this.pendtotalservice;
        this.totalAllConfServices = this.conftotalservice;
        this.dataSource = new MatTableDataSource(this.bookedAreaService);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  show(){
    this.fiteredServ = [];
    this.pendtotalservice = 0;
    this.conftotalservice = 0;
    this.totalserviceprice = 0;
    if(this.selected == 0){
      if(this.areas.length == 2){
        this.selected = 1;
      }
      // console.log(this.selected);
      // console.log(this.areas.length);
      this.dataSource = new MatTableDataSource(this.bookedAreaService);
      this.dataSource.sort = this.sort;
      this.totalserviceprice = this.totalAllServices;
      this.pendtotalservice = this.totalAllPendingServices;
      this.conftotalservice = this.totalAllConfServices;
  } else {
    // console.log(this.selected);
      this.bookedAreaService.forEach(el =>{
        if(el.id == this.selected){
          this.fiteredServ.push(el);
          console.log("Ele:", el);
          if(el.total != "free"){
            if(el.type == "confirmed"){
              this.conftotalservice += el.total;
            }
            if(el.type == "pending"){
              this.pendtotalservice += el.total;
            }
            this.totalserviceprice += el.total;
          }
        }
      })
      this.dataSource = new MatTableDataSource(this.fiteredServ);
      this.dataSource.sort = this.sort;
    }
  }

  getAreaName(){
    let area = {
      id: 0,
      viewValue: "All Services"
    }
    this.areas.push(area);
    this.selected = 0;
    this.adminService.getCompanyReport(this.id, this.currentToken)
      .subscribe(result => {
        result.data.forEach(el => {
          if(el.Booth == null){
            area = {
              id: el.AreaOrder.id,
              viewValue: el.AreaOrder.priceName
            }
            this.areas.push(area);
          } else {
            area = {
              id: el.AreaOrder.id,
              viewValue: el.Booth.name
            }
            this.areas.push(area);
          }
        })
        // console.log("Areas[]: ",this.areas);
      })
  }

  exportToExcel() {
    this.excelService.exportAsExcelFile(this.bookedAreaService, 'Booked_Additional_Services_'+ this.companyName, this.excelColumns);
  }

  deleteService(id){
    this.adminService.getDeleteAds(id, this.currentToken)
      .subscribe(result => {
        // console.log(result);
        if (result.success) {
          this.reset();
          this.getAreaName();
          this.getConfirmedAddServices();
          this.getAllServices()
          this.snackBar.open("Item was deleted successfully!", null, Snack.OPTIONS);
        }
        else {
          this.snackBar.open(result.error.error[0], null, Snack.OPTIONS);
        }
      });
  }

}
