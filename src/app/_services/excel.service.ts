import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string, titles: any): void {
    let titlekeys = Object.keys(titles);
    let jsonkeys = Object.keys(json[0]);
    console.log(titlekeys);
    console.log(jsonkeys);
    if (json[0][titlekeys[0]] !== Object.values(titles)[0])
      json.unshift(titles);
    for (var i = 0; i < json.length; i++) {
      jsonkeys.forEach(key => {
        if (!titlekeys.includes(key))
          delete json[i][key];
      });
    }

    let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, {skipHeader: true} );
    let workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    let excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
