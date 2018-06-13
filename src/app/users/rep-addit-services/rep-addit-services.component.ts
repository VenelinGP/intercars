import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatSnackBar} from '@angular/material';
import { UserService, AuthenticationService } from "../../_services/index";
import { Router } from "@angular/router";
import { Snack } from '../../_constants/snackbaroptions';

@Component({
  selector: 'app-rep-addit-services',
  templateUrl: './rep-addit-services.component.html',
  styleUrls: ['./rep-addit-services.component.css']
})
export class RepAdditServicesComponent implements OnInit {
  currentToken: string;
  // #, Title, Options, Price/pc, Pcs(Hrs), Total Price, Date
  areas: Array<any>;
  bookedAreas: Array<any>;
  fiteredServ: Array<any>;
  boockedServices: Array<any>;
  free_services: Array<any>;
  add_services: Array<any>;
  pending_servces: Array<any>;
  totalprice: number;
  totalAllServices: number;
  currentColor = '';
  displayedColumns = ['id', 'title', 'options', 'price', 'qty', 'total', 'date', 'type'];
  dataSource = new MatTableDataSource(this.bookedAreas);
  selected = 0;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService, 
    private authenticationService: AuthenticationService, 
    private router: Router, 
    private snackBar: MatSnackBar) {
    this.currentToken = localStorage.getItem('currentToken');
    this.totalprice = 0;
    this.fiteredServ = [];
    this.areas = [];
   }

  ngOnInit() {
    this.getAreaName();
    this.getConfirmedAddServices();
    this.getAllAreaAndBooths();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  
  getConfirmedAddServices(){
    this.userService.getAdditonalServices(this.currentToken)
    .subscribe( result => {
      console.log(result.data.OrderServ);
      this.boockedServices = result.data.OrderServ;
    },
    error => {
      if ( error.message == "Token has expired" ) {
        this.authenticationService.logout();
        this.snackBar.open("Your session has expired!",null, Snack.OPTIONS)
        this.router.navigate(["/login"]);
      }

    })
  }

  show(){
    this.fiteredServ = [];
    this.totalprice = 0;
    if(this.selected == 0){
      if(this.areas.length == 2){
        this.selected = 1;
      }
      // console.log(this.selected);
      // console.log(this.areas.length);
      this.dataSource = new MatTableDataSource(this.bookedAreas);
      this.dataSource.sort = this.sort;
      this.totalprice = this.totalAllServices;
  } else {
    // console.log(this.selected);
      this.bookedAreas.forEach(el =>{
        if(el.id == this.selected){
          this.fiteredServ.push(el);
          if(el.total != "free"){
            this.totalprice += el.total;
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
    this.userService.getAreaBooth(this.currentToken)
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
  getAllAreaAndBooths(){
    this.bookedAreas = [];
    this.boockedServices = [];
    this.userService.getAreaBooth(this.currentToken)
    .subscribe( result => {
      if(result.data != null){
        console.log(result.data);
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
                    title: s.name,
                    options: s.options,
                    price: "free",
                    qty: s.qty,
                    total: "free",
                    date: el.AreaOrder.created_at,
                    type: "confirmed"
                  }
                  this.bookedAreas.push(serv)
                }
              })
            }
            if(this.add_services.length > 0){
              this.add_services.forEach(s => {
                // console.log(2, s);

                if(s.name !='color'){
                  let serv = {
                    id: el.AreaOrder.id,
                    title: s.name,
                    options: s.options,
                    price: 0,
                    qty: s.qty,
                    total: +s.price,
                    date: el.AreaOrder.created_at,
                    type: "confirmed"
                  }
                  this.totalprice += serv.total;
                  this.bookedAreas.push(serv);
                }
              })
            }
            if(this.pending_servces.length > 0){
              this.pending_servces.forEach(s => {
                // console.log(3, s);
                  let serv = {
                    id: el.AreaOrder.id,
                    title: s.service_name,
                    options: s.options,
                    price: s.service_price,
                    qty: s.qty,
                    total: +s.service_price*s.qty,
                    date: s.created_at,
                    type: "pending"
                }
                  this.totalprice += serv.total;
                  this.bookedAreas.push(serv);
                
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
                      title: s.name,
                      options: s.options,
                      price: "free",
                      qty: s.qty,
                      unit: s.service_unit,
                      total: "free",
                      date: el.AreaOrder.created_at,
                      type: "confirmed"

                    }
                    this.bookedAreas.push(serv)
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
                            title: s.service_name,
                            options: s.options,
                            price: s.service_price,
                            qty: s.qty,
                            unit: s.service_unit,
                            total: +s.price,
                            date: s.created_at,
                            type: "confirmed"
                          }
                          this.totalprice += serv.total;
                          this.bookedAreas.push(serv)
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
                    title: s.service_name,
                    options: s.options,
                    price: s.service_price,
                    qty: s.qty,
                    total: +s.service_price*s.qty,
                    date: s.created_at,
                    type: "pending"
                  }
                  this.totalprice += serv.total;
                  this.bookedAreas.push(serv);
                
              })
            }

            let areaPrice = +el.AreaOrder.price;
            let bootPrice = +el.Booth.price;
          }
        })
        // console.log("B:", this.bookedAreas);
        this.totalAllServices = this.totalprice;
        this.dataSource = new MatTableDataSource(this.bookedAreas);
        this.dataSource.sort = this.sort;
      }
    })
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
