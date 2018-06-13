import { Component,OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService, SendService } from "../../_services/index";
import { User } from "../../_models/index";
import { MatSnackBar } from "@angular/material";
import { UserData } from "../../_models/index";
import { Router } from "@angular/router";
import { Snack } from "../../_constants/snackbaroptions";


@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {
  user: User;
  addUser: User;
  autorizedPerson: User;
  users: UserData[];
  isExhibitor: boolean;
  currentToken: string;
  currentRole: string;
  displayedColumns = ['id', 'name', 'email', 'phone', 'position', 'role', 'edit', 'block'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // public dialog: MatDialog,
  constructor(
    private sendService: SendService,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) {
      this.currentToken = localStorage.getItem('currentToken');
      this.currentRole = localStorage.getItem('currentRole');
  }

  ngOnInit() {
    if(+this.currentRole == 3){
      this.isExhibitor = true;
    }
    this.getCompanyUsers();
  }

  getCompanyUsers(){
    this.users = [];
    this.userService.getCompanyAllusers(this.currentToken)
    .subscribe( result =>{
      result.data.forEach(element => {
      let operator = {
          id: element.id,
          name: element.name,
          is_block: element.is_block,
          email: element.email,
          phone: element.phone,
          position: element.position,
          rolename: element.rolename
        }
        this.users.push(operator);
      })
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  private loadUserProfile() {
    this.userService.getProfile(this.currentToken)
      .subscribe(result => {
        this.user = {
          name: result.data.name,
          password: "",
          email: result.data.email,
          phone: result.data.phone,
          position: result.data.position,
          role_id: result.data.role_id,
          company_id: result.data.company_id
        }
        return this.user;
      },
      error =>{
        this.snackBar.open(error, null, Snack.OPTIONS)
          // console.log(error);
    });
  }

  block(id){
    this.userService.blockUser(+id, this.currentToken)
      .subscribe(result=>{
        // console.log(result);
        this.getCompanyUsers();
      });
  }

  unblock(id){
    this.userService.unblockUser(+id, this.currentToken)
      .subscribe(result=>{
        // console.log(result);
        this.getCompanyUsers();
      });
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(ModalAddUser, {
      width: '450px',
      data: {data: this.addUser}
    });

    dialogRef.afterClosed().subscribe(data => {
      //TODO Invite
      // console.log('The dialog was closed');
      this.autorizedPerson = {
        name: data.name,
        email: data.email,
        password: "",
        phone: data.phone,
        position: data.position
      }
      // console.log(this.autorizedPerson);

      this.userService.addUser(this.autorizedPerson, this.currentToken)
        .subscribe(result=>{
          // console.log(result);
            if(result.success == true){
              this.getCompanyUsers();
              this.snackBar.open("User: "+this.autorizedPerson.name+" is added!", null, Snack.OPTIONS);
            } else {
              this.snackBar.open(result.error.email, null, Snack.OPTIONS);
            }
        })


    //   this.sendService.send(this.autorizedPerson)
    //   .subscribe(
    //       data => {
    //         if(data.success){
    //             this.snackBar.open("Email send to: "+ this.autorizedPerson.email, '', {duration: 3000});
    //             this.router.navigate(['/login']);
    //         } else {
    //             this.snackBar.open(data.error.email, "Error", {duration: 5000});
    //         }
    //     },
    //     error => {
    //         this.snackBar.open(error.error, "Error", {duration: 5000});
    //     });
    // }

      })
    }
}

@Component({
  selector: 'modal-add-user',
  templateUrl: 'modal-add-user.html',
  styleUrls: ['./modal-add-user.css']
})
export class ModalAddUser {

  constructor(
    public dialogRef: MatDialogRef<ModalAddUser>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
