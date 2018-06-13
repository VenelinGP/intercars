import { Injectable } from "@angular/core";
import { JwtHelper } from "angular2-jwt";

@Injectable()
export class AuthService {

  constructor() { }
  public getToken(): string {
    return localStorage.getItem("currentToken");
  }

  public isAuthenticated(): boolean {
    const helper = new JwtHelper();
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    return helper.isTokenExpired(token);
  }
}
