import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatRadioChange } from "@angular/material/radio";
import { UserService, SharedService } from "../../_services/index";
import { PriceData, BoothData, BoothOptionsData } from "../../_models/index";
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Snack } from "../../_constants/snackbaroptions";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.css"]
})
export class OrdersComponent implements OnInit {
  currentToken: string;
  currentRole: string;
  isCoExhibitor: boolean;

  isVAT: boolean;
  isBuyAreaBtn: boolean;
  isStandartBoothsBtn: boolean;
  selectedArea: PriceData;
  selectedBooth: PriceData;
  selectedDefaultBooth: BoothData;
  area: number;
  area_booth_create: number;
  // area_booth_montage: number;
  total_area_price: number;
  total_booth_price: number;
  area_prices: PriceData[];
  booths_prices: PriceData[];
  booths: BoothData[];
  booth_options: BoothOptionsData[];
  booth_options_checked: BoothOptionsData[];
  checked: boolean;
  public selected: string;
  public bookedAreas: Array<any>;
  public color_id: number;
  public floor_id: number;
  colors = [
    { value: "option1", viewValue: "../../../assets/images/1.jpg" },
    { value: "option2", viewValue: "../../../assets/images/2.jpg" },
    { value: "option3", viewValue: "../../../assets/images/3.jpg" },
    { value: "option4", viewValue: "../../../assets/images/4.jpg" },
    { value: "option5", viewValue: "../../../assets/images/5.jpg" },
    { value: "option6", viewValue: "../../../assets/images/6.jpg" }
  ];
  floorColor = new FormControl("option1");
  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.currentToken = localStorage.getItem("currentToken");
    this.currentRole = localStorage.getItem("currentRole");
    this.isCoExhibitor = false;

    this.isVAT = true; //localStorage.getItem('VAT');

    this.area = 0;
    this.area_booth_create = 0;

    this.total_booth_price = 0;
    this.total_area_price = 0;

    this.area_prices = [];
    this.booths_prices = [];
    this.booths = [];
    this.booth_options = [];
    this.booth_options_checked = [];
    this.checked = true;
  }

  ngOnInit() {
    if (+this.currentRole > 3) {
      this.isCoExhibitor = true;
    }
    this.getAllAreaAndBooths();
    this.getItems();
  }

  getItems() {
    this.userService.getAreaPrices(this.currentToken).subscribe(result => {
      result.data.forEach(element => {
        let area = {
          id: element.id,
          name: element.name,
          title: element.title,
          description: element.description,
          price: element.price,
          img: element.img,
          options: element.options,
          type: element.type
        };
        this.area_prices.unshift(area);
      });
      this.selectedArea = this.area_prices[0];
    });
    // get booths prices
    this.userService.getBoothPrices(this.currentToken).subscribe(result => {
      result.data.forEach(element => {
        let data = {
          id: element.id,
          name: element.name,
          title: element.title,
          price: element.price
        };
        this.booths_prices.push(data);
      });

      this.selectedBooth = this.booths_prices[0];
    });

    // get default booths prices
    this.userService.getDefaultBooths(this.currentToken).subscribe(result => {
      result.data.forEach(element => {
        let el = {
          id: element.id,
          name: element.name,
          description: element.description,
          price: element.price,
          options: element.options,
          img: element.img
        };
        this.booths.push(el);
      });
      this.selectedDefaultBooth = this.booths[0];
      this.booth_options = this.booths[0].options;
      this.booth_options.forEach(item => {
        this.booth_options_checked.push({
          id: item.id,
          qty: item.qty,
          options: item.options,
          want: !!item.want
        });
      });
    });
  }

  addBooth() {
    if (this.isStandartBoothsBtn) {
      this.userService
        .addReadyBooth( +this.selectedDefaultBooth.id, "pending", this.currentToken )
        .subscribe(result => {
          if (result.success == true) {
            let area_id = result.data.AreaOrder.id;
            let color = '6.jpg';
            this.booth_options_checked.find(e => +e.id == 20).options = color;
            // console.log("Options: ",this.booth_options_checked);
            this.userService
              .addDefaultBoothOptions( { area_id: area_id, default: this.booth_options_checked },  this.currentToken )
              .subscribe(result => {
                this.reset();
                this.getAllAreaAndBooths();
                this.snackBar.open(
                  "Booth was confirmed successfully!",
                  null,
                  Snack.OPTIONS
                );
              }),
              error => {
                let errors = Object.values(error).join();
                this.snackBar.open("Errors: " + errors, null, Snack.OPTIONS);
              };
          }
        });
    } else {
      if(this.selectedArea.name == 'area_price_with_SA'){
        this.area = 4;
      }
      this.userService
        .addCustomBooth(
          this.area,
          this.selectedArea.name,
          "confirmed",
          this.selectedBooth.name,
          this.getBoothArea(),
          "confirmed",
          this.currentToken
        )
        .subscribe(result => {
          if (result.success == true) {
            this.reset();
            this.getAllAreaAndBooths();
            this.snackBar.open(
              "Booth was confirmed successfully!",
              null,
              Snack.OPTIONS
            );
          } else {
            let errors = Object.values(result.error).join();
            this.snackBar.open("Errors: " + errors, null, Snack.OPTIONS);
          }
        });
    }
  }
  getAllAreaAndBooths() {
    this.bookedAreas = [];
    this.userService.getAreaBooth(this.currentToken).subscribe(result => {
      if (result.data != null) {
        this.sharedService.emitChange(true);
        result.data.forEach(el => {
          if (el.Booth == null) {
            let bookedArea = {
              areaOrder: el.AreaOrder.area,
              areaName: el.AreaOrder.priceName,
              areaPrice: el.AreaOrder.price,
              boothArea: undefined,
              boothName: undefined,
              price: undefined,
              booth: false
            };
            this.bookedAreas.push(bookedArea);
          } else {
            let bookedArea = {
              areaOrder: el.AreaOrder.area,
              areaName: el.AreaOrder.priceName,
              areaPrice: +el.AreaOrder.price,
              boothArea: el.Booth.area_sqm,
              boothName: el.Booth.name,
              price: +el.Booth.price,
              booth: true
            };
            this.bookedAreas.push(bookedArea);
          }
        });
        this.selected = this.bookedAreas[0].value;
      }
    });
    if (this.bookedAreas.length == 0) {
      this.sharedService.emitChange(false);
    } else {
      this.sharedService.emitChange(true);
    }
  }

  reset() {
    this.area = 0;
    this.area_booth_create = 0;
    // this.area_booth_montage = 0;
    this.selectedArea = this.area_prices[0];
    this.selectedBooth = this.booths_prices[0];
    this.selectedDefaultBooth = this.booths[0];
    this.booth_options = this.booths[0].options;
    this.isBuyAreaBtn = false;
    this.isStandartBoothsBtn = false;
  }
  btnChange(event) {
    if (event == 1) {
      this.isBuyAreaBtn = true;
      this.isStandartBoothsBtn = false;
    }
    if (event == 2) {
      this.isBuyAreaBtn = false;
      this.isStandartBoothsBtn = true;
    }
  }
  boothCheck(item) {
    this.selectedBooth = item;
  }
  optionCheck(key, item, qty) {
    this.booth_options_checked[key].want = !this.booth_options_checked[key]
      .want;
  }

  onKeyChair(qty) {
    this.booth_options_checked[2].qty = qty;
  }
  radioChange(event: MatRadioChange) {
    if (event.value == 1) {
      this.isBuyAreaBtn = true;
      this.isStandartBoothsBtn = false;
    }
    if (event.value == 2) {
      this.isBuyAreaBtn = false;
      this.isStandartBoothsBtn = true;
    }
  }

  // TODO Remove
  areaChange(item) {
    //if(item.name=="area_price_with_SA")
    //  this.selectedBooth = this.booths_prices[0];
    // console.log('item',item);
    //if (this.selectedArea.id != "6") this.area = 0;
  }
  isSelectedArea(item) {
    return item.id == this.selectedArea.id;
  }

  calcAreaPrice(item) {
    if (item.id == this.selectedArea.id) {
      if (this.selectedArea.id == "6") {
        this.total_area_price = + this.selectedArea.price;
      } else {
        // if (this.area < 30) {
        //   this.total_area_price = +this.selectedArea.price * 30;
        // }
        // else
          this.total_area_price = +this.selectedArea.price * this.area;
      }
      return this.total_area_price;
    }
  }
  isSelectedBooth(item) {
    return item.id == this.selectedBooth.id;
  }
  calcBoothPrice(item) {
    if (this.selectedBooth) {
      if (item.name == "booth_create" || item.name == "booth_montage") {
        this.total_booth_price =  +this.selectedBooth.price * this.area_booth_create;
      }
      if (item.name == "booth_self") {
        this.total_booth_price = 0;
      }
      return this.total_booth_price;
    }
    return 0;
  }
  // TODO Remove
  getBoothArea() {
    //if (this.selectedBooth.name == "booth_create" || this.selectedBooth.name == "booth_montage" || this.selectedBooth.name == "booth_self")
    return this.area; //area_booth_create;
    //return 30;
  }

  calcTotal() {
    if (this.isStandartBoothsBtn) return this.selectedDefaultBooth.price;
    else return this.total_area_price + this.total_booth_price;
  }


  //TODO Remove
  onKey(event) {
    // this.area = +event.target.value ;
  }
  get areaPricesGet() {
    return this.area_prices;
  }

  onFocus(id): void {
    let service = this.area_prices.find(x => x.id === id);
    let dialogRef = this.dialog.open(ModalOrderInfo, {
      width: "450px",
      data: service
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log("The dialog was closed");
    });
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(ModalOrderDialog, {
      width: "450px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addBooth();
        // this.snackBar.open("Order was created!")
      }
    });
  }
}


@Component({
  selector: 'modal-order-dialog',
  templateUrl: 'modal-order-dialog.html',
  styleUrls: ['./modal-order-dialog.css']
})
export class ModalOrderDialog {

  constructor(
    public dialogRef: MatDialogRef<ModalOrderDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}


@Component({
  selector: 'modal-order-info',
  templateUrl: 'modal-order-info.html',
  styleUrls: ['./modal-order-info.css']
})
export class ModalOrderInfo {

  constructor(
    public dialogRef: MatDialogRef<ModalOrderInfo>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
