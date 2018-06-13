import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService, ExcelService } from '../../_services';
import { Snack } from "../../_constants/snackbaroptions";


@Component({
  selector: 'area-report',
  templateUrl: './area-report.component.html',
  styleUrls: ['./area-report.component.css']
})
export class AreaReportComponent implements OnInit {
  id: number;
  currentToken: string;
  totalarea: number;
  bookedAreas: Array<any>;
  totalBooths: number;
  totalariaprice: number;
  name: string = "Ivan";
  selectedOrder: any;

  displayedColumns = ['id', 'areatype', 'areasqm', 'boothtype', 'boothsqm', 'total', 'date', 'edit', 'delete'];
  excelColumns = {
    // 'id': 'id',
    'areatype': 'Area type',
    'areasqm': 'Area sqm',
    'boothtype': 'Booth type',
    'boothsqm': 'Booth sqm',
    'total': 'Total price',
    'date': 'Date',
    'edit': 'Edit',
    'delete': 'Delete'
  };
  dataSource = new MatTableDataSource(this.bookedAreas);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) areaSort: MatSort;

  @Input() companyName: string;

  constructor(private route: ActivatedRoute, private adminService: AdminService, public dialog: MatDialog, private excelService: ExcelService, private snackBar: MatSnackBar) {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.currentToken = localStorage.getItem('currentToken');
    this.totalarea = 0;
    this.bookedAreas = [];
    this.totalBooths = 0;
    this.totalariaprice = 0;
  }

  ngOnInit() {
    this.getBookedAreas();
  }

  reset(){
    this.totalarea = 0;
    this.bookedAreas = [];
    this.totalBooths = 0;
    this.totalariaprice = 0;
  }
  getBookedAreas(){

    this.adminService.getCompanyReport(this.id, this.currentToken)
      .subscribe(result => {
        if(result.success){
          result.data.forEach(el => {
            if(el.Booth == null){
              let bookedArea = {
                id: el.AreaOrder.id,
                areatype: el.AreaOrder.place_type,
                areasqm: el.AreaOrder.area,
                boothtype: el.AreaOrder.priceName,
                boothsqm: el.AreaOrder.area,
                total: el.AreaOrder.price,
                date: el.AreaOrder.updated_at
              }
              this.totalarea += +el.AreaOrder.area;
              this.totalBooths += +el.AreaOrder.area;
              this.totalariaprice += +el.AreaOrder.price;

              this.bookedAreas.push(bookedArea);
            } else {
              let areaPrice = +el.AreaOrder.price;
              let bootPrice = +el.Booth.price;
              let bookedArea = {
                  id: el.AreaOrder.id,
                  areatype: el.AreaOrder.place_type,
                  areasqm: el.AreaOrder.area,
                  boothtype: el.Booth.name,
                  boothsqm: el.Booth.area_sqm,
                  total: areaPrice+bootPrice,
                  date: el.AreaOrder.updated_at
                }
                this.totalarea += +el.AreaOrder.area;
                this.totalBooths += +el.Booth.area_sqm;
                this.totalariaprice += +areaPrice+bootPrice;

              this.bookedAreas.push(bookedArea);
            }
          });
          this.dataSource = new MatTableDataSource(this.bookedAreas);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.areaSort;
        }
      })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  exportToExcel() {
    this.excelService.exportAsExcelFile(this.bookedAreas, 'Booked_Areas_and_Booths_' + this.companyName, this.excelColumns);
  }

  openDialog(id: number): void {
    console.log(id);
    this.selectedOrder = this.bookedAreas.find(x => x.id == id);
    let dialogRef = this.dialog.open(ModalAreaReport, {
      width: '500px',
      data: this.selectedOrder
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        console.log(result.success);
        if(result.success){
          this.selectedOrder.boothsqm = this.selectedOrder.areasqm;
          this.adminService.postUpdateArea(this.selectedOrder.id, this.selectedOrder.areasqm, this.selectedOrder.total, this.currentToken)
          .subscribe(result => {
            console.log(result);
            if(result.success){
              this.snackBar.open("Area was updated successfully!", null, Snack.OPTIONS);
            }
            else {
              this.snackBar.open("Error!", null, Snack.OPTIONS);
            }
          })
        } else {
          this.reset();
          this.getBookedAreas();
        }
      });
    }


  deleteArea(id) {
    console.log(id);
    this.adminService.getDeleteArea(id, this.currentToken)
        .subscribe(result => {
          if (result.success) {
            this.reset();
            this.getBookedAreas();
            this.snackBar.open("Area was deleted successfully!", null, Snack.OPTIONS);
          }
          else {
            this.snackBar.open(result.error.error[0], null, Snack.OPTIONS);
          }
    });
  }
}

@Component({
  selector: 'modal-area-report',
  templateUrl: 'modal-area-report.html',
  styleUrls: ['./modal-area-report.css']
})
export class ModalAreaReport {

  constructor(
    public dialogRef: MatDialogRef<ModalAreaReport>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close({success: false, data: {}});
  }
}