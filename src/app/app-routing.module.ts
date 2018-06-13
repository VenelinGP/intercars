import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_guards/index';
import { HomeComponent,  } from './home/index';
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SendEmailComponent } from "./send-email/send-email.component";
import { LoginComponent } from "./login/index";
import {
  UsersComponent,
  ProfileComponent,
  DetailsComponent,
  ManagementComponent,
  OrdersComponent,
  ServicesComponent,
  AdvertisingComponent,
  OthersComponent,
  UserDetailsComponent,
  WelcomeComponent,
  RepExhibitionAreaComponent,
  RepAdditServicesComponent,
  RepAdvertServicesComponent,
  CurrentStatusComponent } from "./users/index";
import {
  AdminsComponent,
  ExhibitorsComponent,
  ExhibitorDetailsComponent,
  AdministratorsComponent,
  AdminDetailsComponent,
  CompaniesComponent,
  SessionsComponent,
  CompanyReportComponent,
  CompaniesreportComponent,
  CompanyInfoComponent,
  ConfirmedPendingOrdersComponent,
  CompanyDetailsComponent,
  TotalAreasComponent,
  TotalAdvertComponent,
  TotalServicesComponent,
  TotalServiceReportComponent,
  TotalAdvertisingReportComponent } from "./admins/index";

import { RecoveryComponent } from "./recovery/recovery.component";

const routes: Routes = [

  { path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'users', component: UsersComponent,
    children: [
      { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: 'details', component: DetailsComponent, canActivate: [AuthGuard] },
      { path: 'management', component: ManagementComponent, canActivate: [AuthGuard] },
      { path: 'management/:id', component: UserDetailsComponent, canActivate: [AuthGuard] },
      { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
      { path: 'services', component: ServicesComponent, canActivate: [AuthGuard] },
      { path: 'advertising', component: AdvertisingComponent, canActivate: [AuthGuard] },
      { path: 'others', component: OthersComponent, canActivate: [AuthGuard] },
      { path: 'reporders', component: RepExhibitionAreaComponent, canActivate: [AuthGuard] },
      { path: 'repservices', component: RepAdditServicesComponent, canActivate: [AuthGuard] },
      { path: 'repadvertising', component: RepAdvertServicesComponent, canActivate: [AuthGuard] },
      { path: 'status', component: CurrentStatusComponent, canActivate: [AuthGuard] },

    ],
    canActivate: [AuthGuard] },

    { path: 'admins', component: AdminsComponent,
    children: [
      { path: 'exhibitors', component: ExhibitorsComponent, canActivate: [AuthGuard] },
      { path: 'exhibitors/:id', component: ExhibitorDetailsComponent, canActivate: [AuthGuard] },
      { path: 'administrators', component: AdministratorsComponent, canActivate: [AuthGuard] },
      { path: 'administrators/:id', component: AdminDetailsComponent, canActivate: [AuthGuard] },
      { path: 'companies', component: CompaniesComponent, canActivate: [AuthGuard] },
      { path: 'companies/:id', component: CompanyDetailsComponent, canActivate: [AuthGuard] },
      { path: 'sessions', component: SessionsComponent, canActivate: [AuthGuard] },
      { path: 'companiesreport', component: CompaniesreportComponent, canActivate: [AuthGuard] },
      { path: 'companiesreport/:id', component: CompanyReportComponent, canActivate: [AuthGuard] },
      { path: 'companiesinfo/:id', component: CompanyInfoComponent, canActivate: [AuthGuard] },
      { path: 'orders', component: ConfirmedPendingOrdersComponent, canActivate: [AuthGuard] },
      { path: 'totalareas', component: TotalAreasComponent, canActivate: [AuthGuard] },
      { path: 'totalservices', component: TotalServicesComponent, canActivate: [AuthGuard] },
      { path: 'totaladvertising', component: TotalAdvertComponent, canActivate: [AuthGuard] },
      { path: 'servicereport', component: TotalServiceReportComponent, canActivate: [AuthGuard] },
      { path: 'advertisingreport', component: TotalAdvertisingReportComponent, canActivate: [AuthGuard] },
      
    ],
    canActivate: [AuthGuard] },

    { path: 'login', component: LoginComponent },
    { path: 'recovery', component: RecoveryComponent },
    { path: 'signup', component: SignUpComponent },
    { path: 'sendemail', component: SendEmailComponent},

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
