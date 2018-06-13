import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatSnackBar} from '@angular/material';
import { UserService, AuthenticationService } from "../../_services/index";
import { Router } from "@angular/router";
import { Snack } from '../../_constants/snackbaroptions';

@Component({
  selector: "app-current-status",
  templateUrl: "./current-status.component.html",
  styleUrls: ["./current-status.component.css"]
})
export class CurrentStatusComponent implements OnInit {
  currentToken: string;
  totalAdsPrice: number;
  totalServicesPrice: number;
  totalAreaPrice: number;
  totalprice: number;
  totalServices = [];

  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.currentToken = localStorage.getItem("currentToken");
    this.totalprice = 0;
    this.totalAdsPrice = 0;
    this.totalServicesPrice = 0;
    this.totalAreaPrice = 0;
  }

  ngOnInit() {
    this.getConfirmedAdvertising();
    this.getConfirmedServices();
    this.getConfirmedAreaAndBooths();
  }

  get totalPrice(){
    return this.totalAdsPrice + this.totalServicesPrice + this.totalAreaPrice;
  }

  getConfirmedAdvertising() {
    this.userService.getConfirmedAdvertising(this.currentToken).subscribe(
      result => {
        // console.log('Ads',result.data);
        this.totalAdsPrice = 0;
        result.data.OrderAds.forEach(order => {
          order.ServiceOrder.forEach(a => {
            this.totalAdsPrice += parseFloat(a.price);
          });
        });
        // console.log(this.totalAdsPrice);
      },
      error => {
        if (error.message == "Token has expired") {
          this.authenticationService.logout();
          this.snackBar.open("Your session has expired!", null, Snack.OPTIONS);
          this.router.navigate(["/login"]);
        }
      }
    );
  }

  getConfirmedServices() {
    this.userService.getAdditonalServices(this.currentToken).subscribe(
      result => {
          // console.log("Services", result.data);
          this.totalServicesPrice = 0;
          result.data.OrderServ.forEach(order => {
            order.ServiceOrders.forEach(a => {
              this.totalServicesPrice += parseFloat(a.price);
          });
        });
      },
      error => {
        if (error.message == "Token has expired") {
          this.authenticationService.logout();
          this.snackBar.open("Your session has expired!", null, Snack.OPTIONS);
          this.router.navigate(["/login"]);
        }
      }
    );
  }

  getConfirmedAreaAndBooths() {
    this.userService.getAreaBooth(this.currentToken).subscribe(
      result => {
        // console.log('Area', result.data);
        this.totalAreaPrice = 0;
        if (result.data != null) {
          let i = 1;
          result.data.forEach(el => {
            // console.log(el);
            if (el.Booth == null) {
              this.totalAreaPrice += parseFloat(el.AreaOrder.price);
              i++;
            } else {
              let areaPrice = parseFloat(el.AreaOrder.price) || 0;
              let bootPrice = parseFloat(el.Booth.price);
              // console.log(areaPrice, bootPrice);
              this.totalAreaPrice += (areaPrice + bootPrice);
              i++;
            }
          });
        }
      },
      error => {
        if (error.message == "Token has expired") {
          this.authenticationService.logout();
          this.snackBar.open("Your session has expired!", null, Snack.OPTIONS);
          this.router.navigate(["/login"]);
        }
      }
    );
  }
}
