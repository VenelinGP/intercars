import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatSnackBar} from '@angular/material';
import { UserService, AuthenticationService } from "../../_services/index";
import { Router } from "@angular/router";
import { Snack } from '../../_constants/snackbaroptions';

@Component({
  selector: 'app-rep-exhibition-area',
  templateUrl: './rep-exhibition-area.component.html',
  styleUrls: ['./rep-exhibition-area.component.css']
})
export class RepExhibitionAreaComponent implements OnInit {
  currentToken: string;
  totalarea:number;
  totalBooths:number;
  totalprice: number;

  bookedAreas = [];
  displayedColumns = ['id', 'areatype', 'areasqm', 'boothtype', 'boothsqm', 'total', 'date'];
  dataSource = new MatTableDataSource(this.bookedAreas);

  @ViewChild(MatSort) sort: MatSort;
  constructor(private userService: UserService, private authenticationService: AuthenticationService, private router: Router, private snackBar: MatSnackBar ) {
    this.currentToken = localStorage.getItem('currentToken');
    this.totalarea = 0;
    this.totalBooths = 0;
    this.totalprice = 0;
  
  }

  ngOnInit() {
    this.getAllAreaAndBooths();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  getAllAreaAndBooths(){
    this.bookedAreas = [];
    this.userService.getAreaBooth(this.currentToken)
    .subscribe( result => {
      // console.log(result.data);
      if(result.data != null){
        let i = 1;
        result.data.forEach(el => {
          if(el.Booth == null){
            let bookedArea = {
              id: i,
              areatype: el.AreaOrder.place_type,
              areasqm: el.AreaOrder.area,
              boothtype: el.AreaOrder.priceName,
              boothsqm: el.AreaOrder.area,
              total: el.AreaOrder.price,
              date: el.AreaOrder.updated_at              
            }
            this.totalarea += +el.AreaOrder.area;
            this.totalBooths += +el.AreaOrder.area;
            this.totalprice += +el.AreaOrder.price;
        
            this.bookedAreas.push(bookedArea);
            i++;
          } else {
            let areaPrice = +el.AreaOrder.price;
            let bootPrice = +el.Booth.price;
            let bookedArea = {
              id: i,
              areatype: el.AreaOrder.place_type,
              areasqm: el.AreaOrder.area,
              boothtype: el.Booth.name,
              boothsqm: el.Booth.area_sqm,
              total: areaPrice+bootPrice,
              date: el.AreaOrder.updated_at
          }
              this.totalarea += +el.AreaOrder.area;
              this.totalBooths += +el.Booth.area_sqm;
              this.totalprice += +areaPrice+bootPrice;
      
            this.bookedAreas.push(bookedArea);
            i++;
          }
        })
        // console.log(this.bookedAreas);
        this.dataSource = new MatTableDataSource(this.bookedAreas);
        this.dataSource.sort = this.sort;
  
      }
    },
    error => {
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
}
