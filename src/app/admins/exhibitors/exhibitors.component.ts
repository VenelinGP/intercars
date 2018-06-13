import { Component, ViewChild, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AdminService, SendService, UserService, AuthenticationService } from "../../_services/index";
import { UserData, User, AutorizedPerson } from "../../_models/index";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";
import { Snack } from "../../_constants/snackbaroptions";

@Component({
  selector: "app-exhibitors",
  templateUrl: "./exhibitors.component.html",
  styleUrls: ["./exhibitors.component.css"]
})
export class ExhibitorsComponent{
  addExhibitor: User;
  public autorizedPerson: AutorizedPerson;

  users: UserData[];
  currentToken: string;
  // "created_at", "updated_at", 
  displayedColumns = ["id", "company", "name", "email", "role", "edit", "block", "is_block"];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private sendService: SendService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar ) {
    this.currentToken = localStorage.getItem("currentToken");
    this.users = [];
  }

  ngOnInit(){
    this.getExhibitors();
  }
getExhibitors(){
  this.users = [];
  this.adminService.getExhibitors(this.currentToken)
    .subscribe(result => {
      result.data.forEach(user =>{
        let rolename = (+user.role_id == 3? 'Authorized Exhibitor': 'Exhibitor');
        let exhibitor: UserData = {
          id: user.id,
          company_name: user.company_name,
          name: user.name,
          email: user.email,
          is_block: user.is_block,
          position: user.position,
          rolename: rolename,
          created_at: user.created_at,
          updated_at: user.updated_at,
        }
        this.users.push(exhibitor);
      });
      this.dataSource = new MatTableDataSource<UserData>(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    error => {
      this.snackBar.open(error.message, null, Snack.OPTIONS);
      this.authenticationService.logout();
      this.router.navigate(["/login"]);
    });

}

  block(id){
    this.adminService.blockUser(+id, this.currentToken)
      .subscribe(result=>{
        // console.log(result);
        this.getExhibitors();
      });
  }

  unblock(id){
    this.adminService.unblockUser(+id, this.currentToken)
      .subscribe(result=>{
        // console.log(result);
        this.getExhibitors();
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(ModalAddExhibitor, {
      width: '450px',
      data: {data: this.addExhibitor}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.addExhibitor = {
        name: result.name || "",
        email: result.email || "",
      }
      this.invite(this.addExhibitor)
    })
  }

  invite(exhibitor){
    // console.log(exhibitor);
    if(exhibitor.name.length < 3){
      this.snackBar.open("The Name can't be less than 3 characters!", null, Snack.OPTIONS);
    } else {
      if(exhibitor.email.length < 3){
        this.snackBar.open("The Email can't be less than 3 characters!", null, Snack.OPTIONS);
      }
    }
    if(exhibitor.name.length >= 3 && exhibitor.email.length >= 3){
    this.autorizedPerson = {
      name: exhibitor.name,
      email: exhibitor.email,
      new: true
    }
    this.sendService.send(this.autorizedPerson)
    .subscribe(
        data => {
          // console.log("Invite: ", data);
          if(data.success){
              this.snackBar.open("Email sent to: "+ this.autorizedPerson.email, null, Snack.OPTIONS);
          } else {
              this.snackBar.open(data.error.email, null, Snack.OPTIONS);
          }
      },
      error => {
          this.snackBar.open(error.error, null, Snack.OPTIONS);
      });
    }
  }

}

@Component({
  selector: 'modal-add-exhibitor',
  templateUrl: 'modal-add-exhibitor.html',
  styleUrls: ['./modal-add-exhibitor.css']
})
export class ModalAddExhibitor {

  constructor(
    public dialogRef: MatDialogRef<ModalAddExhibitor>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}