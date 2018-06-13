import { Component, OnInit } from '@angular/core';
import { User } from "../../_models/index";
import { Router, ActivatedRoute } from "@angular/router";
import { AdminService } from "../../_services/index";

@Component({
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.css']
})
export class AdminDetailsComponent implements OnInit {
	currentToken: string;
	admin: User;
    id: number;
  constructor(private router: Router, private route: ActivatedRoute, private adminService: AdminService) {
    this.currentToken = localStorage.getItem('currentToken');
    this.admin = {
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
    this.adminService.getAdmins(this.currentToken)
      .subscribe( result =>{
              result.data.forEach(element => {
                  if(+element.id == this.id){
                      this.admin = {
                          id: +element.id,
                          name: element.name,
                          email: element.email,
                          phone: element.phone,
                          position: element.position,
                      }
                      // console.log(this.admin);
                  }
              })
      })
  }

  save(fullname, email, phone, position){
    // TODO: MM da pozvoli da ne se iska parola i da se updateva phone i position

    this.admin = {
      id: this.id,
      name: fullname,
      password: "123qaz",
      email: email,
      role_id: 2,
      phone: phone,
      position: position
    }
    this.adminService.editAdminsUsers(this.admin, this.currentToken)
    .subscribe(result => {
        // console.log(result);
    })
    this.router.navigate(["/admins/administrators"]);
  }
}
