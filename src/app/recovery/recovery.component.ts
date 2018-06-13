import { Component } from '@angular/core';
import { UserService } from "../_services/index";
import { MatSnackBar } from "@angular/material";
import { Snack } from '../_constants/snackbaroptions';
import { Router } from "@angular/router";

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent  {
  constructor(private userService: UserService, private router: Router, private snackBar: MatSnackBar) { }
  recovery(email: string){
    this.userService.passwordRecovery(email)
      .subscribe(result =>{
        // console.log(result);
        if( result.success == true ) {
          this.snackBar.open("New password was send to email: " + email, null, Snack.OPTIONS )
          this.router.navigate(['/login']);
        } else {
          this.snackBar.open(result.error.email, null, Snack.OPTIONS );
        }
      })
  }
}
