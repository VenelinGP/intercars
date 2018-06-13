import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../_services';

@Component({
  selector: 'app-company-report',
  templateUrl: './company-report.component.html',
  styleUrls: ['./company-report.component.css']
})
export class CompanyReportComponent implements OnInit{
  id: number;
  currentToken: string;

  public company: string;
  constructor(private router: Router, private route: ActivatedRoute, private adminService: AdminService) { 
    this.id = +this.route.snapshot.paramMap.get('id');
    this.currentToken = localStorage.getItem('currentToken');
    this.company = "";

  }
  ngOnInit(){
    this.getNameCompany();
  }
  getNameCompany(){
    this.adminService.getAllCompaniesReport(this.currentToken)
      .subscribe(result => {
        if(result.success){
          this.company = result.data[0].find(x => x.id == this.id).name;
        }
      });
  }
}
