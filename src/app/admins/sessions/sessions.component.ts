import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { AdminService, AuthenticationService } from "../../_services/index";
import { User, CompanyData } from "../../_models/index";
import {
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";
import { Snack } from "../../_constants/snackbaroptions";
import { Router } from "@angular/router";

@Component({
  selector: "app-sessions",
  templateUrl: "./sessions.component.html",
  styleUrls: ["./sessions.component.css"]
})
export class SessionsComponent implements OnInit {
  user: User;
  users: Array<any>;
  currentRole: string;
  currentToken: string;

  displayedColumns = ["id", "company", 'email', "start", "end", "duration"];
  dataSource: MatTableDataSource<CompanyData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private adminService: AdminService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.currentToken = localStorage.getItem("currentToken");
    this.users = [];
  
  }

  ngOnInit() {
    this.getUserSessions()
  }

  getUserSessions(){

    this.adminService.getSessions(this.currentToken).subscribe(result => {
      console.log(result.data);
      result.data.sessions.forEach(element => {
        // console.log(element);
        let operator = {
          id: element.id,
          userid: element.user_id,
          email: element.email,
          company: element.companyName,
          start: this.convertTimestamp(element.start),
          end: this.convertTimestamp(element.end),
          duration: this.convertDuration(element.duration),
        };
        this.users.push(operator);
      });
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    error => {
      this.snackBar.open(error.message, null, Snack.OPTIONS);
      this.authenticationService.logout();
      this.router.navigate(["/login"]);
    });

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  convertTimestamp(unix_timestamp: number){
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let date = new Date(unix_timestamp*1000);
    // Day part from the timestamp
    let day = "0" + date.getDate();
    // Month part from the timestamp
    let month =  "0" + (date.getMonth()+1);
    // Year part from the timestamp
    let year = date.getFullYear();
    // Hours part from the timestamp
    let hours = "0" + date.getHours();
    // Minutes part from the timestamp
    let minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    let seconds = "0" + date.getSeconds();
    // Will display date in  15.03.2018 10:30:23 format
    return day.substr(-2) + '.' + month.substr(-2) + '.' + year + '  ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }

  convertDuration(duration){
    let min = "0" +  Math.floor(duration / 60);
    let sec = "0" + duration % 60;
    return min.substr(-2) + ':' + sec.substr(-2);
  }
}
