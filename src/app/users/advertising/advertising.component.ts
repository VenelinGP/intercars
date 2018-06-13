import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';

import { UserService, SharedService } from "../../_services/index";
import { BookedAreas, Services } from "../../_models/index";

import { Snack } from '../../_constants/snackbaroptions'


@Component({
  selector: "app-advertising",
  templateUrl: "./advertising.component.html",
  styleUrls: ["./advertising.component.css"]
})
export class AdvertisingComponent implements OnInit {
  currentToken = localStorage.getItem("currentToken");
  currentRole = localStorage.getItem("currentRole");
  public services: Services[];
  public selectedServices: Services[];
  public sеrvicesInfo;
  private addons;
  private fg_full_id: number;
  private fg_half_id: number;

  private cl;
  cloth_hostess: string;
  cloth_model: string;
  public textValueFull: string;
  public textValueHalf: string;
  isShowFull: boolean;
  isShowHalf: boolean;
  isHostessShow: boolean;
  isModelShow: boolean;
  public total: number;
  private formData: FormData;
  private formDataFull: FormData;
  private formDataHalf: FormData;
  private isNotEmpty: boolean;
  public files: File[];
  public fileName: File[];
  public uploaded: string;
  public uploaded_full: string;
  public uploaded_half: string;
  public uploaded_name_full: string;
  public uploaded_name_half: string;

  selected = 0;
  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.services = [];
    this.fg_full_id = 45;
    this.fg_half_id = 46;
    this.sеrvicesInfo = [];
    this.selectedServices = [];
    this.total = 0;
    this.cloth_hostess = "";
    this.cloth_model = "";
    this.textValueFull = "";
    this.formData = new FormData();
    this.files = [];
    this.uploaded = "";
    this.uploaded_full = "";
    this.uploaded_half = "";
    this.uploaded_name_full = "";
    this.uploaded_name_half = "";
    this.isNotEmpty = false;
    this.fileName = [];
  }

  ngOnInit() {
    this.getAllAdvertising();
    this.getServices();
    this.getUploads();
    //this.getTest();
  }
  // show(){
  //   this.services = [];
  //   this.selectService();
  // }

  getTest(){
    this.userService.getPendingMagazineInfo(this.currentToken)
      .subscribe(result =>{
        // console.log("getPending: ", result);
      })
      this.userService.getConfirmedMagazineInfo(this.currentToken)
      .subscribe(result =>{
        // console.log("getConfirmd: ", result);
      })
  }
  onKey(id, service_id, qty) {
    if ( +this.services.find(el => el.service_id == this.fg_full_id).qty == 0) {
      this.isShowFull = false;
    } else {
      this.isShowFull = true;
    }

    if(+this.services.find(el => el.service_id == this.fg_half_id).qty == 0){
      this.isShowHalf = false;
    } else {
      this.isShowHalf = true;
    }

    if (+this.services.find(el => el.service_id == 43).qty == 0) {
      this.isHostessShow = false;
    } else {
      this.isHostessShow = true;
    }
    if (+this.services.find(el => el.service_id == 44).qty == 0) {
      this.isModelShow = false;
    } else {
      this.isModelShow = true;
    }

    this.services.find(x => x.id === id).qty = qty;
    this.selectService();
  }

  onFocus(id): void {
    let service = this.sеrvicesInfo.filter(function (item) {
      return item.id == id;
    });
    let dialogRef = this.dialog.open(ModalAdvService, {
      width: "450px",
      data: service[0]
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(ModalAdvertisingQuestion, {
      width: "450px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirm();
        //this.snackBar.open("Order was created!")
      }
    });
  }

  save() {
    if (+this.services.find(s => s.service_id == 43).qty > 0) {
      this.services.find(s => s.service_id == 43).options = this.cloth_hostess;
    }
    if (+this.services.find(s => s.service_id == 44).qty > 0) {
      this.services.find(s => s.service_id == 44).options = this.cloth_model;
    }
    let currentServices = {
      addon: this.services,
      "full_magazine_info": this.textValueFull,
      "half_magazine_info": this.textValueHalf
    };
    // console.log(currentServices);
    this.userService
      .addAdvertising(currentServices, this.currentToken)
      .subscribe(result => {
        // console.log(result);
        if (result.success) {
          this.snackBar.open( "Advertising saved successfully", null, Snack.OPTIONS);
        }
      });
  }

  confirm() {
    if (+this.services.find(s => s.service_id == 43).qty > 0) {
      this.services.find(s => s.service_id == 43).options = this.cloth_hostess;
    }
    if (+this.services.find(s => s.service_id == 44).qty > 0) {
      this.services.find(s => s.service_id == 44).options = this.cloth_model;
    }

    let services = {
      addon: this.services,
      "full_magazine_info": this.textValueFull,
      "half_magazine_info": this.textValueHalf
    };
    this.userService.addAdvertising(services, this.currentToken)
      .subscribe(result => {
        if (result.success) {
          let confirmation = { status: "confirmed" };
          this.userService
            .confirmAdvertising(confirmation, this.currentToken)
            .subscribe(result => {
              if (result.success) {
                this.snackBar.open( "Confirmed successfully", null, Snack.OPTIONS);
                this.getAllAdvertising();
              }
            });
        }
      });
  }
  getAllAdvertising() {
    this.userService.getAreaBooth(this.currentToken).subscribe(result => {
      if (result.data != null) {
        this.sharedService.emitChange(true);
      } else {
        this.sharedService.emitChange(false);
      }
    });
    this.userService.getAdvertising(this.currentToken).subscribe(result => {
      console.log(result);
      this.services = result.data.ServiceOrder; // return data with qty.
      console.log(this.services);
      if (+this.services.find(s => s.service_id == 43).qty > 0) {
        this.isHostessShow = true;
        this.cloth_hostess = this.services.find(s => s.service_id == 43).options;
      } else {
        this.isHostessShow = false;
      }
      if (+this.services.find(s => s.service_id == 44).qty > 0) {
        this.isModelShow = true;
        this.cloth_model = this.services.find(s => s.service_id == 44).options;
      } else {
        this.isModelShow = false;
      }
      this.fg_full_id = this.services.find( x => x.service_name.substring(0, 17) == "Fair guide - Full").service_id;
      this.textValueFull = result.full_magazine_info;
      this.fg_half_id = this.services.find( x => x.service_name.substring(0, 16) == "Fair guide - 1/2" ).service_id;
      this.textValueHalf = result.half_magazine_info;
      // console.log(this.textValueFull, this.textValueHalf);
      if (  +this.services.find(el => el.service_id == this.fg_full_id).qty == 0 ) {
        this.isShowFull = false;
      } else {
        this.isShowFull = true;
      }
      if ( +this.services.find(el => el.service_id == this.fg_half_id).qty == 0 ) {
        this.isShowHalf = false;
      } else {
        this.isShowHalf = true;
      }
      this.selectService();
    });
  }

  getUploads() {
    this.userService.getMagazineFile(this.currentToken).subscribe(result => {
      if (result.success) {
        let files = result.data;
        let lastslashindex = 0;
        this.uploaded_full = result.data.full_file; // return data with qty.
        if(this.uploaded_full != null){
          lastslashindex = this.uploaded_full.lastIndexOf('/');
          this.uploaded_name_full = this.uploaded_full.substring(lastslashindex  + 1);
        }


        this.uploaded_half = result.data.half_file; // return data with qty.
        if(this.uploaded_half != null){
          lastslashindex = this.uploaded_full.lastIndexOf('/');
          this.uploaded_name_half = this.uploaded_half.substring(lastslashindex  + 1);
        }
      }
    });
  }

  getServices() {
    this.userService.getServices(this.currentToken).subscribe(result => {
      this.sеrvicesInfo = result.data.filter(ads => ads.type == "ads");
    });
  }

  selectService() {
    this.selectedServices = [];
    this.total = 0;
    this.services.forEach(el => {
      this.selectedServices = this.services.filter(el => +el.qty > 0);
      console.log(this.selectedServices);
      this.total += +el.qty * +el.service_price;
    });
  }

  fileChange(files: File[]) {
    this.formDataFull = new FormData();
    this.formDataHalf = new FormData();
    this.fileName = [];
    if (files.length > 0) {
      this.formDataFull.append("type", "full_file");
      this.formDataHalf.append("type", "half_file");
      this.isNotEmpty = true;
      let file = files[0];
      this.fileName.push(file);
      this.formDataFull.append("file", file, file.name);
      this.formDataHalf.append("file", file, file.name);
    }
  }

  openInput() {
    // your can use ElementRef for this later
    document.getElementById("fileInput").click();
  }

  upload(id: number) {
    if(id == this.fg_full_id){
      this.formData = this.formDataFull;
    } else if( id == this.fg_half_id) {
      this.formData = this.formDataHalf
    }

    this.userService
      .addMagazineFile(this.formData, this.currentToken)
      .subscribe(result => {
        if (result.success) {
          this.fileName = [];
          this.isNotEmpty = false;
          this.snackBar.open("File is uploaded!", "", Snack.OPTIONS);
        } else {
          this.snackBar.open("System Error!", "", Snack.OPTIONS);
        }
        this.userService
          .getMagazineFile(this.currentToken)
          .subscribe(result => {
            // console.log(result);
          });
        this.getUploads();
      });
  }
}

@Component({
  selector: 'modal-adv-service',
  templateUrl: 'modal-adv-service.html',
  styleUrls: ['./modal-adv-service.css']
})
export class ModalAdvService {

  constructor(
    public dialogRef: MatDialogRef<ModalAdvService>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
@Component({
  selector: 'modal-advertising-question',
  templateUrl: 'modal-advertising-question.html',
  styleUrls: ['./modal-advertising-question.css']
})
export class ModalAdvertisingQuestion {

  constructor(
    public dialogRef: MatDialogRef<ModalAdvertisingQuestion>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
      this.dialogRef.close(false);
    }

    onYesClick(): void {
      this.dialogRef.close(true);
    }

}
