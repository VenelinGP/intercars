import { Component, Input, ChangeDetectorRef, } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent {

  isLogged: boolean = true;
  currentRole: string;
  isMasterAdmin: boolean;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher ) {
    this.currentRole = localStorage.getItem('currentRole');
    if(this.currentRole == "1"){
      this.isMasterAdmin = true;
    }
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    }

     ngOnDestroy(): void {
      this.mobileQuery.removeListener(this._mobileQueryListener);
    }

}
