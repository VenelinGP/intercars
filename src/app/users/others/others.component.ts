import { Component, OnInit } from '@angular/core';
import { UserService, AuthenticationService, SharedService } from "../../_services/index";
import { BookedAreas } from "../../_models/index";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { Snack } from '../../_constants/snackbaroptions'

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.css']
})
export class OthersComponent implements OnInit {
  currentToken: string;
  logo: File;
  formData:FormData;
  logos;
  files = [];
  selected = 0;
  want_presentation: string = 'no';
  want_translator: string = 'no';
  want_audio: string = 'no';
  textValue: string;
  public bookedAreas: BookedAreas[];

  isNotEmpty: boolean;

  constructor(private userService: UserService,
    private authenticationService: AuthenticationService,

    private sharedService: SharedService,
    private router: Router,
  private snackBar: MatSnackBar) {
    this.currentToken = localStorage.getItem('currentToken');
    this.bookedAreas = [];
    this.logos = [];
    this.files = [];
    this.isNotEmpty = true;
    this.textValue = "";
   }

  ngOnInit() {
    this.getAllAreaAndBooths();
    this.getOthers();
    this.getNames();
  }
  openInput(){
    // your can use ElementRef for this later
    document.getElementById("fileInput").click();
  }

  getAllAreaAndBooths(){
    this.userService.getAreaBooth(this.currentToken)
      .subscribe(result => {
        let i = 0;
        if(result.data != null){
          this.sharedService.emitChange(true);
        } else {
          this.sharedService.emitChange(false);
        }
        if(result.data){
            this.selected = result.data[0].AreaOrder.id;
            result.data.forEach(element => {
              //this.services = [];
              if(element.ServiceOrder != null){
                if(element.OrderServ.status == 'pending'){
                  //this.services = element.ServiceOrder;

                  if(element.Booth){
                  let booked: BookedAreas = {
                    id: i,
                    value: element.AreaOrder.id,
                    viewValue: element.Booth.name,
                    services: null//this.services
                  }
                  this.bookedAreas.push(booked);
                  i++;
                  } else {
                  //this.services = [];
                  //this.services = element.ServiceOrder;
                  let booked: BookedAreas = {
                    id: i,
                    value:  element.AreaOrder.id,
                    viewValue: element.AreaOrder.priceName,
                    services: null//this.services
                  }
                  i++;
                  this.bookedAreas.push(booked);
                  }
                }
              }
            });
          }
        // this.selected = this.bookedAreas[0].id;
        this.getLogoFilesForCurrentArea();
      },
      error => {
        if ( error.message == "Token has expired" ) {
          this.authenticationService.logout();
          this.snackBar.open("Your session has expired!",null, Snack.OPTIONS)
          this.router.navigate(["/login"]);
        }
      })
  }

  getOthers(){
    this.userService.getProfile(this.currentToken)
      .subscribe(result => {
        this.want_presentation = result.company.want_presentation;
        this.want_translator = result.company.want_translator;
        this.want_audio = result.company.want_audio;
      })
  }
  fileChange(files: File[]) {
    if (files.length > 0) {
      this.formData = new FormData();
      this.formData.append('area_id', this.selected.toString());
      this.isNotEmpty = true;
      for (let index = 0; index < files.length; index++) {
        let file = files[index];
        this.formData.append('files['+index+']', file, file.name);
        this.logos.push(file);
      }
     }
  }

  getLogoFilesForCurrentArea(){
        this.files = [];
        this.userService.getFiles(this.selected, this.currentToken)
          .subscribe(result => {
            let path = result.path;
            let that = this;
            // console.log(this.files);
            // console.log(result.data);
            if(result.data.Uploads) {
              // console.log(this.files);
              result.data.Uploads.forEach(function(el){
                // console.log(that.files);
                that.files.push({'name':el.name,'link':path+'/'+el.name });
                // console.log(this);
             })
            } else {
              // console.log(result);
              // this.snackBar.open(result.error, null, Snack.OPTIONS);
            }
            // console.log(result);
        })
  }

  show(){
    // console.log(this.selected);
    this.getLogoFilesForCurrentArea();
    // alert('Get all logo files list + set currentArea_id to selected booth');
  }

   upload() {
     this.userService.addFiles(this.formData, this.currentToken)
      .subscribe(result => {
        if(result.success){
          this.getLogoFilesForCurrentArea();
        } else {
          // console.log(result);
          this.snackBar.open(result.error.area_id, null, Snack.OPTIONS);
        }
      })
  }

  submit(){
    let answers = {
      "want_presentation": this.want_presentation,
      "want_translator": this.want_translator
    }
    this.userService.addPresentation(answers, this.currentToken)
      .subscribe(result =>{
        // console.log(result);
        if(result.success){
          this.snackBar.open("Your answers is submitted successfully!","", Snack.OPTIONS);
        }
      })
  }
  submitAudio(){
    let answers = {
      "want_audio": this.want_audio,
    }
    this.userService.addAudio(answers, this.currentToken)
      .subscribe(result =>{
        // console.log(result);
        if(result.success){
          this.snackBar.open("Your answers is submitted successfully!","", Snack.OPTIONS);
        }
      })
  }
  submitPlates(str: string){
    let names = str.replace(/[\t\n\r]/gm,'').split(',');
    // console.log(names);
    let plates = {
      name: names
    }
    this.userService.addPlates(plates, this.currentToken)
      .subscribe(result => {
        if(result.success){
          this.snackBar.open("Names for plates added!", null, Snack.OPTIONS)
        } else {
          this.snackBar.open("System error!", null, Snack.OPTIONS)
        }
        // console.log(result);
      });
  }
  getNames(){
    this.userService.getPlates(this.currentToken)
      .subscribe(result => {
        // console.log(result.data.Plates );
        if(result.data.Plates != null){
          let names = "";
          result.data.Plates.forEach(people =>
            names += people.name + ",\n"
          )
          this.textValue = names;
          // console.log(this.textValue);
        } else {
          this.textValue ="";
        }
      })
  }
}