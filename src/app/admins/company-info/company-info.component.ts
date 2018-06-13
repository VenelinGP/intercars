import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { BookedAreas, Company } from '../../_models';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent implements OnInit {
  id: number;
  currentToken: string;
  want_presentation: string;
  want_translator: string;
  want_audio: string;

  full_file: string;
  full_magazine_info: string;
  half_file: string;
  half_magazine_info: string;

  bookedAreas: BookedAreas[];
  selected: number;
  company: Company;
  invoice_address: Array<any>;
  users: Array<any>;
  plates: Array<any>;
  logos: Array<any>;
  files: Array<any>;
  filePath: string;



  displayedColumns = ['name', 'position', 'role_id', 'email'];
  dataSource: MatTableDataSource<any>;

  constructor(private route: ActivatedRoute, private adminService: AdminService) { 
    this.currentToken = localStorage.getItem('currentToken');
    this.id = +this.route.snapshot.paramMap.get('id');
    this.want_presentation = "No";
    this.want_translator = "No";
    this.want_audio = "No";
    this.company = {
      name: '',
      address: '',
      postcode: '',
      city: '',
      country: '',
      EIK: '',
      invoice_address: '',
      paymentMethod: '',
      comment: ''
    };
    this.users = [];
    this.plates = [];
    this.bookedAreas = [];
    this.selected = 0;
    this.logos = [];
    this.files = [];
    this.filePath = null;
    this.invoice_address = [];

    this.full_file = null;
    this.full_magazine_info = null;
    this.half_file = null;
    this.half_magazine_info = null;
  
   }

  ngOnInit() {
    this.getInfoCompany();
  }

  getInfoCompany(){
    this.adminService.getCompanyInfoReport(this.id, this.currentToken)
      .subscribe(result => {
        this.company = result.data[0];
        console.log(this.company);
        this.users = result.data[0].users;
        if(this.company.invoice_address != null){
          this.invoice_address = this.company.invoice_address.split('\n');
        }
        this.dataSource = new MatTableDataSource(this.users);

        this.plates = result.data[0].plates;
        this.want_presentation = ( result.data[0].want_presentation == 'yes' ? "Yes": "No" );
        this.want_translator = (result.data[0].want_translator == 'yes' ? "Yes": "No" );
        this.want_audio = (result.data[0].want_audio == 'yes' ? "Yes": "No" );
        if(result.data[0].logos.length > 0){
          this.filePath = result.data[0].logos[0].uploadsFilesPath;
        }
        
        let index = 0;
        if( this.filePath != null){
          index = this.filePath.length + 1;
        }
        if( result.data[0].full_file != null){
          this.full_file = result.data[0].full_file.substr(index);
        }
          this.full_magazine_info = result.data[0].full_magazine_info;
        if( result.data[0].half_file != null){
          this.half_file = null || result.data[0].half_file.substr(index);
        }  
          this.half_magazine_info = result.data[0].half_magazine_info;
          this.logos = result.data[0].logos;

          let i = 0;
          this.logos.forEach( element =>{
            let booked: BookedAreas = {
              id: element.id,
              value: i.toString(),
              viewValue: element.areaName,
              services: null
            }
            i++;
            this.bookedAreas.push(booked);
          }) 
      })
  }

  show(){
    this.getLogoFilesForCurrentArea();
  }

  
  getLogoFilesForCurrentArea(){
    this.files = this.logos[this.selected].uploadsFiles;
  }
}
