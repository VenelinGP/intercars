import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {CdkTableModule} from '@angular/cdk/table';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';


import { AppRoutingModule } from './app-routing.module';

import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { ShowColumnDirective } from './_directives/showcolumn.directive';
// import { EqualValidator } from "./_directives/equal-validator.directive";
import { JwtInterceptorProvider, ErrorInterceptorProvider } from './_helpers/index';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import {
  AuthenticationService,
  ExcelService,
  SendService,
  UserService,
  SnackBarComponent,
  AdminService,
  ValidationService,
  SharedService } from './_services/index';


import { AppComponent } from './app.component';
import { HomeComponent } from "./home/index";
import { LoginComponent } from './login/index';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { RecoveryComponent } from './recovery/recovery.component';

import {
  AdminsComponent,
  ModalAddAdmin,
  AdministratorsComponent,
  AdminDetailsComponent,
  ExhibitorsComponent,
  ModalAddExhibitor,
  ExhibitorDetailsComponent,
  CompaniesComponent,
  ModalAddCompany,
  CompanyDetailsComponent,
  SessionsComponent,
  CompaniesreportComponent,
  CompanyInfoComponent,
  CompanyReportComponent,
  AreaReportComponent,
  ServiceReportComponent,
  ModalAreaReport,
  AdvertReportComponent,
  TotalordersComponent,
  ConfirmedPendingOrdersComponent,
  TotalAreasComponent,
  TotalServicesComponent,
  TotalAdvertComponent,
  TotalServiceReportComponent,
  TotalAdvertisingReportComponent} from './admins/index';

import {
  AdvertisingComponent,
  ModalAdvService,
  ModalAdvertisingQuestion,
  DetailsComponent,
  ModalAnswer,
  ManagementComponent,
  ModalAddUser,
  ServicesComponent,
  ModalService,
  ModalServiceQuestion,
  UsersComponent,
  UserDetailsComponent,
  ProfileComponent,
  OthersComponent,
  OrdersComponent,
  ModalOrderDialog,
  ModalOrderInfo,
  WelcomeComponent,
  RepExhibitionAreaComponent,
  RepAdditServicesComponent,
  RepAdvertServicesComponent,
  CurrentStatusComponent} from "./users/index";

  import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatGridListModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule} from '@angular/material';
import { TokenInterceptor } from './_services/token.interceptor';
import { AuthService } from './_services/auth.service';

    @NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    HomeComponent,
    SignUpComponent,
    SendEmailComponent,
    ProfileComponent,
    OthersComponent,
    OrdersComponent,
    ModalOrderDialog,
    ModalOrderInfo,
    UsersComponent,
    UserDetailsComponent,
    DetailsComponent,
    ModalAnswer,
    ManagementComponent,
    ModalAddUser,
    ExhibitorDetailsComponent,
    ModalAddExhibitor,
    ServicesComponent,
    ModalService,
    ModalServiceQuestion,
    SnackBarComponent,
    AdminsComponent,
    ExhibitorsComponent,
    AdministratorsComponent,
    AdminDetailsComponent,
    ModalAddAdmin,
    CompaniesComponent,
    ModalAddCompany,
    SessionsComponent,
    CompaniesreportComponent,
    TotalordersComponent,
    ConfirmedPendingOrdersComponent,
    UserDetailsComponent,
    CompanyDetailsComponent,
    WelcomeComponent,
    ShowColumnDirective,
    RecoveryComponent,
    AdvertisingComponent,
    ModalAdvService,
    ModalAdvertisingQuestion,
    RepExhibitionAreaComponent,
    RepAdditServicesComponent,
    RepAdvertServicesComponent,
    CurrentStatusComponent,
    CompanyReportComponent,
    AreaReportComponent,
    ServiceReportComponent,
    ModalAreaReport,
    AdvertReportComponent,
    TotalAreasComponent,
    TotalServicesComponent,
    TotalAdvertComponent,
    TotalServiceReportComponent,
    TotalAdvertisingReportComponent,
    CompanyInfoComponent
    // EqualValidator
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatGridListModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule
    ],
    entryComponents: [
      ModalAddAdmin,
      ModalAnswer,
      ModalAddUser,
      ModalAddExhibitor,
      ModalAddCompany,
      ModalAreaReport,
      ModalOrderDialog,
      ModalOrderInfo,
      ModalService,
      ModalServiceQuestion,
      ModalAdvService,
      ModalAdvertisingQuestion],
  providers: [
    AuthGuard,
    AuthService,
    AuthenticationService,
    ExcelService,
    SendService,
    UserService,
    AdminService,
    JwtInterceptorProvider,
    ErrorInterceptorProvider,
    SharedService,
    ValidationService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
