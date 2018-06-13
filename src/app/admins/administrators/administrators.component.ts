import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { PageEvent } from "@angular/material";
import { UserService, AdminService, AuthenticationService } from "../../_services/index";
import { UserData, User } from "../../_models/index";
import { Snack } from "../../_constants/snackbaroptions"

import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";
import { Router } from "@angular/router";


@Component({
  selector: "app-administrators",
  templateUrl: "./administrators.component.html",
  styleUrls: ["./administrators.component.css"]
})


// TODO показване на ролята и да има възможност за блкиране и отблкиране
export class AdministratorsComponent implements OnInit {
  user: User;
  addAdmin: User;
  users: UserData[];
  currentRole: string;
  isMasterAdmin: boolean;
  currentToken: string;

  displayedColumns = ["id", "name", "email", "position", "role", "edit", 'block', 'is_block'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor( private adminService: AdminService, private authenticationService: AuthenticationService, private router: Router, public dialog: MatDialog, private snackBar: MatSnackBar ) {
    this.currentToken = localStorage.getItem("currentToken");
    this.currentRole = localStorage.getItem("currentRole");
  }

  ngOnInit() {
    if(+this.currentRole == 1){
      this.isMasterAdmin = true;
    }
    this.getAdministrators();
    //this.loadUserProfile();
  }

  getAdministrators(){
    this.users = [];
    this.adminService.getAdmins(this.currentToken)
      .subscribe(result => {
        result.data.forEach(element => {
          let operator = {
            id: element.id,
            name: element.name,
            email: element.email,
            phone: element.phone,
            position: element.position,
            rolename: element.rolenameUserData,
            is_block: element.is_block
          };
          this.users.push(operator);
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
        this.getAdministrators();
      });
  }

  unblock(id){
    this.adminService.unblockUser(+id, this.currentToken)
      .subscribe(result=>{
        // console.log(result);
        this.getAdministrators();
      });
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  private loadUserProfile() {
    this.adminService.getProfile(this.currentToken)
      .subscribe(
        result => {
          console.log(result);
          // this.user = {
          //   name: result.data.name,
          //   password: "",
          //   email: result.data.email,
          //   phone: result.data.phone,
          //   position: result.data.position,
          //   role_id: result.data.role_id
          // };
          // return this.user;
        },
        error => {
          this.snackBar.open(error, null, Snack.OPTIONS);
          console.log(error);
        }
    );
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(ModalAddAdmin, {
      width: '450px',
      data: {data: this.addAdmin}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      this.addAdmin = {
        name: result.name || "",
        email: result.email || "",
        //TODO: Mitaka да подава паролата
        password: "123qaz",
        phone: result.phone,
        position: result.position,
        role_id: 2
      }
      // console.log(this.addAdmin);
      let str:string = "";
      if(this.addAdmin.name.length < 3){
        this.snackBar.open("The Name can't be less than 3 characters!", null, Snack.OPTIONS);
      } else {
        if(this.addAdmin.email.length < 3){
          this.snackBar.open("The Email can't be less than 3 characters!", null, Snack.OPTIONS);
        } else {
          this.adminService.addAdmin(this.addAdmin, this.currentToken)
          .subscribe(result=>{
            // console.log(result);
  //TODO адекватно изкарване на съобщенията.
              if(result.success == true){
                this.snackBar.open("Administrator: "+this.addAdmin.name+" is added!", null, Snack.OPTIONS);
              } else {
                let str = result.error.name[0] || "";
                let str1 =  (result.error.email || "");
                // console.log(str);
                this.snackBar.open(str, null, Snack.OPTIONS);
                this.snackBar.open(str1, null, Snack.OPTIONS);
              }
          })
        }
      }
    });
  }
}

@Component({
  selector: 'modal-add-admin',
  templateUrl: 'modal-add-admin.html',
  styleUrls: ['./modal-add-admin.css']
})
export class ModalAddAdmin {

  constructor(
    public dialogRef: MatDialogRef<ModalAddAdmin>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}