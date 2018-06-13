import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { User } from '../_models/index';
import { UserService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    userName: string;
    roleId: number;
    isMasterAdmin: boolean;
    isAdmin: boolean;
    isExhibitor: boolean;

    isOperator: boolean;
    currentUser: string;
    currentToken: string;
    currentRole: number;
    users: User[] = [];

    constructor(private userService: UserService, private router: Router) {
        this.currentUser = localStorage.getItem('currentUser');
        this.currentToken = localStorage.getItem('currentToken');
        this.currentRole = +localStorage.getItem('currentRole');
        this.isAdmin = false;
        this.isExhibitor = false;
    }

    //TODO check every 5 minutes for token expiration.
    ngOnInit() {
        this.loadUserProfile();
    }

    private loadUserProfile() {
        if(this.currentToken){
            if(this.currentRole < 3){
                this.isAdmin = true;
                this.isExhibitor = false;
                this.router.navigate(['/admins/exhibitors']);
            }
            if(this.currentRole >= 3){
                this.isAdmin = false;
                this.isExhibitor = true;
                this.router.navigate(['/users/welcome']);
            }
        }
        
    }
}