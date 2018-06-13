import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatSnackBar} from '@angular/material';
import { UserService, AuthenticationService } from "../../_services/index";
import { Router } from "@angular/router";
import { Snack } from '../../_constants/snackbaroptions';

@Component({
  selector: 'app-rep-advert-services',
  templateUrl: './rep-advert-services.component.html',
  styleUrls: ['./rep-advert-services.component.css']
})
export class RepAdvertServicesComponent implements OnInit {
currentToken: string;
totalprice: number;
bookedAdvertising = [];
answers = {
  want_presentation: "",
  want_translator:""
}
want_audio: string;
displayedColumns = ['title', 'options', 'price', 'qty', 'total', 'date', 'type'];
dataSource = new MatTableDataSource(this.bookedAdvertising);

@ViewChild(MatSort) sort: MatSort;
  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.currentToken = localStorage.getItem('currentToken');
    this.totalprice = 0;
    this.want_audio = "No";
   }

  ngOnInit() {
    this.getCondirmedAdvertising();
    this.getProfile();
  }

  getCondirmedAdvertising(){
    this.userService.getAdvertising(this.currentToken)
      .subscribe(result => {
        // console.log(11, result);
        if(result.data.ServiceOrder != null){
          result.data.ServiceOrder.forEach(a => {
            if(a.qty > 0 && a.service_id < 48){
              let adv = {
                title: a.service_name,
                options: a.options,
                price: a.service_price,
                qty: a.qty,
                unit: a.service_unit,
                total: +a.service_price,
                date: a.created_at,
                type: 'pending'
              }
              this.totalprice += adv.total;
              this.bookedAdvertising.push(adv);
              // console.log(this.bookedAdvertising);
            }
          })
        }
        this.userService.getConfirmedAdvertising(this.currentToken)
        .subscribe(result => {
          // console.log(12, result.data.OrderAds);
          if(result.data.OrderAds != null){
            result.data.OrderAds.forEach(order =>{
              order.ServiceOrder.forEach(a =>{
                  if(+a.qty > 0 && a.service_id < 48){
                    let adv = {
                      title: a.service_name,
                      options: a.options,
                      price: a.service_price,
                      qty: a.qty,
                      unit: a.service_unit,
                      total: +a.price,
                      date: a.created_at,
                      type: 'confirmed'
                    }
                    this.totalprice += adv.total;
                    this.bookedAdvertising.push(adv);
                    // console.log(this.bookedAdvertising);
                  }
              });
            })
          }
          this.dataSource = new MatTableDataSource(this.bookedAdvertising);
          this.dataSource.sort = this.sort;
      })
    }, error => {
      if ( error.message == "Token has expired" ) {
        this.authenticationService.logout();
        this.snackBar.open("Your session has expired!",null, Snack.OPTIONS)
        this.router.navigate(["/login"]);
      }
    })
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getProfile(){
    this.userService.getProfile(this.currentToken)
      .subscribe(result => {;
        this.answers = {
          want_presentation: result.company.want_presentation || 'No',
          want_translator: result.company.want_translator || 'No'
        }
        // console.log(this.answers);
      })
      this.userService.getAudio(this.currentToken)
        .subscribe(result => {
          // console.log(result);
          this.want_audio = result.data || 'No';
        })
  }
}
