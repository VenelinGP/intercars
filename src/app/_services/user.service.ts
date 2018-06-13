import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { appConfig } from '../app.config';
import { ResProfile, ResRole,  User, ResUsers } from '../_models/index';
import { Company } from "../_models/company";

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getProfile(token: string) {
    let tokenValue = "Bearer " + token;
    let httpOptions = { 
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue })
    };
    return this.http.get<any>( appConfig.apiUrl + "/api/profile/get", httpOptions );
  }

  getRoles(token: string) {
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: tokenValue
      })
    };
    return this.http.get<ResRole>(
      appConfig.apiUrl + "/api/roles/get",
      httpOptions
    );
  }

  getCompanyAllusers(token: string) {
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: tokenValue
      })
    };
    return this.http.get<ResUsers>(
      appConfig.apiUrl + "/api/company/allusers",
      httpOptions
    );
  }

  createCompany(company: Company, token: string) {
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.post<any>( appConfig.apiUrl + "/api/company/create", company, httpOptions);
  }

  editCompany(company: Company, token: string) {
    let tokenValue = "Bearer " + token;
    let httpOptions = { 
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue })
    };
    return this.http.post<ResProfile>( appConfig.apiUrl + "/api/company/edit", company, httpOptions );
  }

  updateCurrentUser(user: User, token: string) {
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: tokenValue
      })
    };
    return this.http.put<ResProfile>(
      appConfig.apiUrl + "/api/profile/update",
      user,
      httpOptions
    );
  }

  addUser(user: User, token: string) {
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.post<any>( appConfig.apiUrl + "/api/profile/createuser", user, httpOptions);
  }

  editUser(user: User, token: string) {
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: tokenValue
      })
    };
    return this.http.post<ResProfile>(
      appConfig.apiUrl + "/api/profile/edituser",
      user,
      httpOptions
    );
  }

  blockUser(id: number, token: string) {
    let tokenValue = "Bearer " + token;
    // console.log(id);
    let httpOptions = { 
      headers: new HttpHeaders({"Content-Type": "application/json",Accept: "application/json", Authorization: tokenValue})
    };
    // admindeleteuser  
    return this.http.post<ResProfile>( appConfig.apiUrl + "/api/profile/blockuser", { id }, httpOptions );
  }
  unblockUser(id: number, token: string) {
    let tokenValue = "Bearer " + token;
    // console.log(id);
    let httpOptions = { 
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    // admindeleteuser  
    return this.http.post<ResProfile>( appConfig.apiUrl + "/api/profile/unblockuser", { id }, httpOptions );
  }

  changeExhibitor(id: number, token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = { 
      headers: new HttpHeaders({"Content-Type": "application/json",Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.post<any>( appConfig.apiUrl + "/api/profile/changeexhibitor", { id }, httpOptions );
  }

  passwordRecovery(email: string){
    let httpOptions = { 
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json"})
    };
    return this.http.post<any>( appConfig.apiUrl + "/api/user/reset", { email }, httpOptions );
  }

  getDefaultBooths(token: string) {
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
    return this.http.get<any>(appConfig.apiUrl + "/api/booths-defaults/get", httpOptions);
  }

  getBoothPrices(token: string) {
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: tokenValue
      })
    };
    return this.http.get<any>(appConfig.apiUrl + "/api/price-booth/get", httpOptions);
  }

  getAreaPrices(token: string) {
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue })
    };
    return this.http.get<any>(appConfig.apiUrl + "/api/price-area/get", httpOptions);
  }
  addCustomBooth(area:number, type_area:string, 
                status:string, booth_type:string, 
                booth_area_sqm:number, boothorder_status:string,
                token: string) {
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: tokenValue
      })
    };
    return this.http.post<any>(
      appConfig.apiUrl + "/api/area-custom/create",
      {
        area,
        type_area,
        status,
        booth_type,
        booth_area_sqm,
        boothorder_status
      },
      httpOptions
    );
  }

  addReadyBooth(booth_id:number, boothorder_status:string, 
              token: string) {
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: tokenValue
      })
    };
    return this.http.post<any>(
      appConfig.apiUrl + "/api/area-default/create",
      {
        booth_id,
        boothorder_status
      },
      httpOptions
    );
  }
  addDefaultBoothOptions(bootOptionsData: any, token:string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.post<any>( appConfig.apiUrl + "/api/service/store", bootOptionsData,  httpOptions );
   }
  getServices(token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.get<any>( appConfig.apiUrl + "/api/service/get", httpOptions );
  }
  getAreaBooth(token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.get<any>( appConfig.apiUrl + "/api/area/get", httpOptions );
  }
  addAreaBooth(services, token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.post<any>( appConfig.apiUrl + "/api/service/store", services, httpOptions );
  }

  confirmServces(confirmation, token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.post<any>( appConfig.apiUrl + "/api/area/status", confirmation, httpOptions );
  }

  getAdvertising(token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.get<any>( appConfig.apiUrl + "/api/service/getalladv", httpOptions );
  }

  addAdvertising(confirmation, token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.post<any>( appConfig.apiUrl + "/api/service/advstore", confirmation, httpOptions );
  }
  confirmAdvertising(confirmation, token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.post<any>( appConfig.apiUrl + "/api/adv/status", confirmation, httpOptions );
  }

  getConfirmedAdvertising(token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.get<any>( appConfig.apiUrl + "/api/service/adv/confirmed", httpOptions );
  }

  getAdditonalServices(token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.get<any>( appConfig.apiUrl + "/api/orderserv/allconfirmed", httpOptions );
  }

  addFiles(files, token: string){
    // const formData: FormData = new FormData();
    // formData.append('area_id','10');
    // formData.append('files[0]', file, file.name);

    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "dataType":"JSON", Authorization: tokenValue})
    };
      return this.http.post<any>( appConfig.apiUrl + "/api/upload/post", files, httpOptions );
  }


  getFiles(area_id, token: string){

    let options = {area_id: area_id};

    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "dataType":"JSON", Authorization: tokenValue})
    };
      return this.http.post<any>( appConfig.apiUrl + "/api/upload/getbyareaid", options, httpOptions );
  }

  
// return this.httpClient
// .post(endpoint, formData, { headers: yourHeadersConfig })
// .map(() => { return true; })
// .catch((e) => this.handleError(e));
// взимането на файловете е по следният начин:
  // POST до: http://api.expo-icbg.com/api/upload/getbyareaid
  // {
  //   "area_id": 2
  // }
  // и ти извежда всички файлове с въпросното area_id

  setMagazineInfo(info, token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.post<any>( appConfig.apiUrl + "/api/company/magazineinfo", info, httpOptions );
  }
  
  // GET http://api.expo-icbg.com/api/service/adv/getcommentpending - връща текущият коментар... за pending ads order
  getPendingMagazineInfo(token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.get<any>( appConfig.apiUrl + "/api/service/adv/getcommentpending",  httpOptions );
  }

  // GET http://api.expo-icbg.com/api/service/adv/getcommentsconfirmed - връща потвърдените коментари... (ако искаш тук мога да връщам само тези който имат коментар понеже в момента връща всички макар и да са Null)...
  getConfirmedMagazineInfo(token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.get<any>( appConfig.apiUrl + "/api/service/adv/getcommentsconfirmed",  httpOptions );
  }
  addMagazineFile(fileData, token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "dataType":"JSON", Authorization: tokenValue})
    };
      return this.http.post<any>( appConfig.apiUrl + "/api/upload/postmagazinefile", fileData, httpOptions );
  }
  getMagazineFile(token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.get<any>( appConfig.apiUrl + "/api/upload/magazinfileget", httpOptions );
  }
  addPresentation(answers, token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.post<any>(appConfig.apiUrl + "/api/company/presentation", answers, httpOptions);
  }
  addAudio(answers, token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.post<any>(appConfig.apiUrl + "/api/company/postwantaudio", answers, httpOptions);
  }
  getAudio(token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.get<any>( appConfig.apiUrl + "/api/company/getwantaudio", httpOptions );
  }

  addPlates(plates, token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.post<any>(appConfig.apiUrl + "/api/plates/post", plates, httpOptions);
  }
  getPlates(token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.get<any>( appConfig.apiUrl + "/api/plates/index", httpOptions );
  }

  getNotifications(token: string){
    let tokenValue = "Bearer " + token;
    let httpOptions = {
      headers: new HttpHeaders({"Content-Type": "application/json", Accept: "application/json", Authorization: tokenValue})
    };
      return this.http.get<any>( appConfig.apiUrl + "/api/session/store", httpOptions );
  }
}
