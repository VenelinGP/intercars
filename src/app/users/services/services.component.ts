import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';

import { UserService, AuthenticationService, SharedService } from "../../_services/index";
import { BookedAreas, Services } from "../../_models/index";

import { Snack } from '../../_constants/snackbaroptions'
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  currentToken = localStorage.getItem('currentToken');
  currentRole = localStorage.getItem('currentRole');
  public bookedAreas: BookedAreas[];
  public services: Services[];
  public selectedServices: Services[];

  public sеrvicesInfo;
  public color: string;
  public color_id: number;
  public floor_id: number;
  public floor_qty: number;
  public isColorShow: boolean;
  public total: number;

  colors = [
    {value: 'option1', viewValue: '../../../assets/images/1.jpg'},
    {value: 'option2', viewValue: '../../../assets/images/2.jpg'},
    {value: 'option3', viewValue: '../../../assets/images/3.jpg'},
    {value: 'option4', viewValue: '../../../assets/images/4.jpg'},
    {value: 'option5', viewValue: '../../../assets/images/5.jpg'},
    {value: 'option6', viewValue: '../../../assets/images/6.jpg'}

  ];
  floorColor = new FormControl('option1');
  selected = 0;
  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private sharedService: SharedService,
     private router: Router,
      public dialog: MatDialog,
       private snackBar: MatSnackBar) {
    this.bookedAreas = [];
    this.services = [];
    this.selectedServices = [];
    this.total = 0;
    this.color = "1";
  }

  ngOnInit() {
    this.getServices();
    this.getAllAreaAndBooths();
  }
  show(){
    this.services = [];
    this.services = this.bookedAreas[this.selected].services;
    if(this.services.find(e => e.service_name == 'Floor covering color').options != null){
      this.floorColor = new FormControl('option'+this.services.find(e => e.service_name == 'Floor covering color').options.substr(0,1));
    } else {
      this.floorColor = new FormControl('option1');
    }
    this.selectService();
  }
  onKey(id, qty){
    if(id == this.floor_id && qty == 0){
      this.isColorShow = false;
    } else {
      this.isColorShow = true;
    }

    this.services.find(x => x.id === id).qty = qty;
    this.selectService();
  }

  onFocus(id): void{
      let service = this.sеrvicesInfo.filter(function (item) {
        return item.id == id;
      });
      let dialogRef = this.dialog.open(ModalService, {
        width: '450px',
        data: service[0]
      });

      dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed');
      });
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(ModalServiceQuestion, {
      width: '450px',
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if(result){
          this.confirm();
          //this.snackBar.open("Order was created!")
        }
    });
  }

  confirm(){
    let color = this.floorColor.value.toString().substr(6,1)+".jpg";
    this.bookedAreas[this.selected].services.find(x => x.service_name == 'Floor covering color').options = color;
    let services = {
      area_id: this.bookedAreas[this.selected].value,
      addon: this.bookedAreas[this.selected].services
    }
    this.userService.addAreaBooth(services, this.currentToken)
      .subscribe( result => {
        if(result.success){
          let confirmation = {area_id: this.bookedAreas[this.selected].value, status: "confirmed"}
          this.userService.confirmServces(confirmation, this.currentToken)
          .subscribe(result => {
            if(result.success){
              this.bookedAreas = [];
              this.services = [];
              this.selectedServices = [];
              this.total = 0;
              this.getAllAreaAndBooths();
              this.snackBar.open("Confirmed successfully", null, Snack.OPTIONS);
            }
          })
        }
      });

  }
  getAllAreaAndBooths(){
    this.userService.getAreaBooth(this.currentToken)
      .subscribe(result => {
        if(result.data != null){
          this.sharedService.emitChange(true);
        } else {
          this.sharedService.emitChange(false);
        }
        let i = 0;
        result.data.forEach(element => {
          this.services = [];
          if(element.ServiceOrder != null){
            if(element.OrderServ.status == 'pending'){

              this.services = element.ServiceOrder;
              if(element.Booth){
              let booked: BookedAreas = {
                id: i,
                value: element.AreaOrder.id,
                viewValue: element.Booth.name,
                services: this.services
              }
              this.bookedAreas.push(booked);
              i++;
              } else {
              this.services = [];
              this.services = element.ServiceOrder;
              let booked: BookedAreas = {
                id: i,
                value:  element.AreaOrder.id,
                viewValue: element.AreaOrder.priceName,
                services: this.services
              }
              i++;
              this.bookedAreas.push(booked);
              }
            }
           }
        });
        if(this.bookedAreas.length == 0){
          this.sharedService.emitChange(false);
        } else {
          this.sharedService.emitChange(true);
        }
        this.selected = this.bookedAreas[0].id;
        this.services = this.bookedAreas[0].services;

        if(this.floor_qty > 0){
          this.isColorShow = true;
        } else {
          this.isColorShow = false;
        }
        this.selectService();
      })
  }

  getServices(){
    this.userService.getServices(this.currentToken)
      .subscribe(result => {
        this.sеrvicesInfo = result.data;
        // console.log(this.sеrvicesInfo);
        this.color_id = 1;
      },
      error => {
        if ( error.message == "Token has expired" ) {
          this.authenticationService.logout();
          this.snackBar.open("Your session has expired!",null, Snack.OPTIONS)
          this.router.navigate(["/login"]);
        }
      })
  }

  selectService(){
    this.selectedServices = [];
    this.total = 0;
    this.selectedServices = this.bookedAreas[this.selected].services.filter(el=> +el.qty > 0 );
    this.selectedServices.forEach(el =>{
      this.total += (+el.qty * +el.service_price);
    })
  }
  save(){
      let color = this.floorColor.value.toString().substr(6,1)+".jpg";
      this.bookedAreas[this.selected].services.find(x => x.service_name == 'Floor covering color').options = color;
      let services = {
        area_id: this.bookedAreas[this.selected].value,
        addon: this.bookedAreas[this.selected].services
      }
      this.userService.addAreaBooth(services, this.currentToken)
        .subscribe( result => {
          if(result.success){
            this.snackBar.open("Services saved successfully", null, Snack.OPTIONS)
          }
        });
  }
  optionCheck(key, qty, item){
    this.services[key].qty = qty;
  }
}

@Component({
  selector: 'modal-service',
  templateUrl: 'modal-service.html',
  styleUrls: ['./modal-service.css']
})
export class ModalService {

  constructor(
    public dialogRef: MatDialogRef<ModalService>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'modal-service-question',
  templateUrl: 'modal-service-question.html',
  styleUrls: ['./modal-service-question.css']
})
export class ModalServiceQuestion {

  constructor(
    public dialogRef: MatDialogRef<ModalServiceQuestion>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
      this.dialogRef.close(false);
    }

    onYesClick(): void {
      this.dialogRef.close(true);
    }

}
