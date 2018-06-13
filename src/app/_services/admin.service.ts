import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { appConfig } from "../app.config";
import { ResProfile, ResRole,  User, ResUsers } from "../_models/index";
import { Company } from "../_models/company";

@Injectable()
export class AdminService {
  constructor(public http: HttpClient) {}

  getProfile(token: string) {
    const tokenValue = "Bearer " + token;
    // , Authorization: tokenValue
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json"})
    };
    return this.http.get<any>( appConfig.apiUrl + "/api/profile/get", httpOptions );
  }

  getExhibitors(token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json"})
    };
    return this.http.get<any>(appConfig.apiUrl + "/api/users/get/users", httpOptions );
  }

  getAdmins(token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.get<any>( appConfig.apiUrl + "/api/users/get/admins", httpOptions );
  }

  addAdmin(admin: User, token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.post<any>(appConfig.apiUrl + "/api/register", admin, httpOptions);
  }

  editAdminsUsers(person: User, token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.put<any>(appConfig.apiUrl + "/api/users/" + person.id + "/edit", person, httpOptions);
  }

  linkToCompany(id, company_id, role_id, token) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    // return this.http.post<any>(appConfig.apiUrl + "/api/user/changeusercompanyandrole", {user, company_id: company_id}, httpOptions);
    return this.http.post<any>(appConfig.apiUrl + "/api/user/changeusercompanyandrole", {id, company_id, role_id}, httpOptions);
  }

  changeRole(id: number, token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.post<any>(appConfig.apiUrl + "/api/profile/changeexhibitor", { id }, httpOptions);
  }

  changeExhibitor(id: number, token: string) {
    // console.log(id);
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.post<any>(appConfig.apiUrl + "/api/user/changeexhibitor", { id }, httpOptions);
  }
  blockUser(id: number, token: string) {
    const tokenValue = "Bearer " + token;
    // console.log(id);
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.post<ResProfile>( appConfig.apiUrl + "/api/profile/adminblockuser", { id }, httpOptions );
  }

  unblockUser(id: number, token: string) {
    const tokenValue = "Bearer " + token;
    // console.log(id);
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.post<ResProfile>( appConfig.apiUrl + "/api/profile/adminunblockuser", { id }, httpOptions );
  }

  getCompanies(token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json"})
    };
    return this.http.get<any>( appConfig.apiUrl + "/api/company/get", httpOptions );
  }

  // POST - /company/admincreate
  addCompany(company: any, token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.post<any>( appConfig.apiUrl + "/api/company/admincreate", company, httpOptions );
  }

  editCompany(company: Company, token: string) {
    const tokenValue = "Bearer " + token;
    // console.log("Token: ",tokenValue);
    // console.log(company);
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.put<any>( appConfig.apiUrl + "/api/company/" + company.id + "/edit", company, httpOptions );
  }
  getAllCompaniesReport(token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.get<any>( appConfig.apiUrl + "/api/admin/allcompanyandreportsforpendingandconfirmed", httpOptions );
  }


  /// here
  getCompanyReport(id: number, token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.get<any>( appConfig.apiUrl + "/api/admin/area/get/" + id, httpOptions );
  }

  getCompanyAdvertisingReport(id: number, token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.get<any>( appConfig.apiUrl + "/api/admin/service/getalladv/" + id, httpOptions );
  }

  getCompanyConfirmedAdvertisingReport(id: number, token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.get<any>( appConfig.apiUrl + "/api/admin/service/adv/confirmed/" + id, httpOptions );
  }
  getCompanyConfirmedServReport(id: number, token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.get<any>( appConfig.apiUrl + "/api/admin/orderserv/allconfirmed/" + id, httpOptions );
  }

/// here
  getCompanyInfo(token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.get<any>( appConfig.apiUrl + "/api/admin/companiesinfo", httpOptions );
  }
  getCompanyInfoReport(id: number, token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.get<any>( appConfig.apiUrl + "/api/admin/companyinfobyid/" + id, httpOptions );
  }
  getAllAreaReports(token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.get<any>( appConfig.apiUrl + "/api/admin/areareports", httpOptions );
  }
  getAllAdditionalReports(token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.get<any>( appConfig.apiUrl + "/api/admin/additionalreports", httpOptions );
  }
  getAllAdvertisingReports(token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.get<any>( appConfig.apiUrl + "/api/admin/advertisingreports", httpOptions );
  }
  getServiceAndAdvertising(id: number, options: string, token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.get<any>( appConfig.apiUrl + "/api/admin/service/serviceinfo/" + id + "/" + options, httpOptions );
  }
  getSessions(token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.get<any>(appConfig.apiUrl + "/api/session/get", httpOptions);
  }

  //delete area from admin panel
  getDeleteArea(id: number, token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue })
    };
    return this.http.get<any>(appConfig.apiUrl + "/api/admin/area/delete/" + id, httpOptions);
  }
  postUpdateArea(id: number, area: number, price: number, token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue })
    };
    return this.http.post<any>(appConfig.apiUrl + "/api/admin/area/modify", {id, area, price}, httpOptions);
    // return this.http.post<any>(appConfig.apiUrl + "/api/admin/area/update/" + id, {id, area, price}, httpOptions);
  }
  //delete  from admin panel
  getDeleteAds(id: number, token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue })
    };
    return this.http.get<any>(appConfig.apiUrl + "/api/admin/service/delete/ads/" + id, httpOptions);
  }
  getDeleteServices(id:number, token: string) {
    const tokenValue = "Bearer " + token;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue })
    };
    return this.http.get<any>(appConfig.apiUrl + "/api/admin/service/delete/eq/"+id, httpOptions);
  }
}
