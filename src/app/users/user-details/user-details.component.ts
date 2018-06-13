import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { UserService, AuthenticationService } from "../../_services/index";
import { UserData, User } from "../../_models/index";
import { MatSnackBar } from "@angular/material";
import { Snack } from "../../_constants/snackbaroptions";

@Component({
	selector: 'app-user-details',
	templateUrl: './user-details.component.html',
	styleUrls: ['./user-details.component.css']
})


export class UserDetailsComponent implements OnInit {
    currentToken: string;
    currentRole: string;
    oldRole: number;
    selected = '';
	user: User;
    id: number;

	constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private snackBar: MatSnackBar) {
		this.currentToken = localStorage.getItem('currentToken');
		this.currentRole = localStorage.getItem('currentRole');
        this.user = {
            id: 0,
            name: "",
            email: "",
            phone:"",
            position: "",
          }
        }
	ngOnInit() {
        this.loadUserData();
        this.id = +this.route.snapshot.paramMap.get('id');
    }
    
    loadUserData(){
        this.userService.getCompanyAllusers(this.currentToken)
		.subscribe( result =>{
            result.data.forEach(element => {
                if(+element.id == this.id){
                    this.user = {
                        id: +element.id,
                        name: element.name,
                        email: element.email,
                        phone: element.phone,
                        position: element.position,
                        role_id: element.role_id
                    }
                }
                this.oldRole = element.role_id;
                if(+element.role_id == 3){
                    this.selected = 'co-exhibitor';
                }
        
			})
        },
        error => {
            if ( error.message == "Token has expired" ) {
                this.authenticationService.logout();
                this.snackBar.open("Your session has expired!",null, Snack.OPTIONS)
                this.router.navigate(["/login"]);
              }
        
        });
    }
    selectExh(event){
       if(event.value == 'exhibitor'){
        this.snackBar.open("You change this Exhibitor to Authorized Exhibitor. If you save this changes, You will be a Exhibitor.", null, Snack.OPTIONS);
       }
    }
    save(fullname, email, phone, position){
        if(this.selected == 'exhibitor'){
            this.userService.changeExhibitor(this.id, this.currentToken)
                .subscribe(result => {
                    this.router.navigate(['/login']);
                })
        } else {
            this.user = {
                id: this.id,
                name: fullname,
                email: email,
                phone: phone,
                position: position
            }
            this.userService.editUser(this.user, this.currentToken)
                .subscribe(result => {
                    if(result.success){
                        this.snackBar.open("User updated successfully!", null, Snack.OPTIONS)
                    } else {

                    }
                })
    
        }
    }
}

