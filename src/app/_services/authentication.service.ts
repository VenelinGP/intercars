import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { appConfig } from "../app.config";

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(user) {
        return this.http.post<any>(appConfig.apiUrl + "/api/login", user)
            // tslint:disable-next-line:no-shadowed-variable
            .map( user => {
                // login successful if there's a jwt token in the response
                if (user.success) {
                    const id = user.data.id;
                    const token = user.token;
                    const role = user.data.role_id;

                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem("currentUser", id);
                    localStorage.setItem("currentToken", token.substring(7));
                    localStorage.setItem("currentRole", role);
                }
                return user;
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem("currentUser");
        localStorage.removeItem("currentToken");
        localStorage.removeItem("currentRole");
    }
}
