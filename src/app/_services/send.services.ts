import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';
import { AutorizedPerson, SignupPerson } from "../_models/index";

@Injectable()
export class SendService {
    constructor(private http: HttpClient) { }

    send(person: AutorizedPerson) {

        // console.log(appConfig.apiUrl + '/api/invite/check');
        return this.http.post<any>(appConfig.apiUrl + '/api/invite/check', person)
            .map(result => {
                if (result.success) {
                    // console.log(result);
                }
                return result;
            });
    }

    signup(person: SignupPerson){
        // console.log(appConfig.apiUrl + '/api/invite/check');
        return this.http.post<any>(appConfig.apiUrl + '/api/invite/check', person)
            .map(result => {
                // console.log(result);
                // login successful if there's a jwt token in the response
                if (result.success) {
                    let id = result.user.id;
                    let token = result.token;
                    let role = result.user.role_id;
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', id);
                    localStorage.setItem('currentToken', token.substring(7));
                    localStorage.setItem('currentRole', role);
                    return result.user;
                } else {
                    return result;
                }
            });
    }
}