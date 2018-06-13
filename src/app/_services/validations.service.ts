import { Injectable } from '@angular/core';
import { Company } from "../_models/index";

@Injectable()
export class ValidationService {
    constructor() {
    }

    // id?: number;
    // name: string;
    // address?: string;
    // postcode?: string;
    // country: string;
    // city: string;
    // invoice_address?: string
    // EIK?: string;
    // VAT?: string;
    // is_click?: boolean;
    // paymentMethod?: string;

    checkCompanyDetails(company: Company){
        if((company.id != undefined && company.id != null) &&
            (company.name != undefined && company.name != null && company.name != '') &&
            (company.address != undefined && company.address != null && company.address != '') &&
            (company.postcode != undefined && company.postcode != null && company.postcode != '') &&
            (company.country != undefined && company.country != null && company.country != '') &&
            (company.city != undefined && company.city != null && company.city != '') &&
            (company.invoice_address != undefined && company.invoice_address != null && company.invoice_address != '') &&
            (company.EIK != undefined && company.EIK != null && company.EIK != '') &&
            (company.VAT != undefined && company.VAT != null && company.VAT != '') &&
            (company.is_click != undefined && company.is_click != null) &&
            (company.paymentMethod != undefined && company.paymentMethod != null && company.paymentMethod != '')) {
                return true
            } else {
                return false;
            }
    }
}