import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as XLSXStyle from 'xlsx-style';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService{

    private blob: any;

    constructor(){
/*
        this.toDataUrl( './assets/images/horroroso.jpeg', myBase64 => {
            console.log( myBase64 ); // myBase64 is the base64 string
            this.blob = myBase64;
        });*/
    }
/*
    private toDataUrl( url, callback ){

        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            const reader = new FileReader();
            reader.onloadend = () => {
                callback( reader.result );
            }
            reader.readAsDataURL( xhr.response );
        };
        xhr.open( 'GET', url );
        xhr.responseType = 'blob';
        xhr.send();
    }
*/
    public exportAsExcelFile( json: any[], excelFileName: string, type: any ): void{

        if( type.BKB == '001' ){

            const worksheet = XLSX.utils.aoa_to_sheet([
                ["ITS SERVICE LTDA"],
                ["endereço: AV LOBO JUNIOR, 01316 - SALA 301 A 302 - PENHA CIRCULAR, CEP 21020-122"],
                ["telefone: (21) 3439-6930 / e-mail: administração@itsservice.com.br"],
                ["Auto Viação Reginas"],
                [`motorista: ${ type.Motorista } | linha: ${ type.Linha } | veículo: ${ type.Veículo }`]
            ]);

            worksheet.A1.s = this.styleCells( 'A1' );
            worksheet.A2.s = this.styleCells( 'A2' );
            worksheet.A3.s = this.styleCells( 'A3' );
            worksheet.A4.s = this.styleCells( 'A4' );
            worksheet.A5.s = this.styleCells( 'A5' );

            let A1 = {s:{c:0, r:0}, e:{c:3, r:0}};
            let A2 = {s:{c:0, r:1}, e:{c:3, r:1}};
            let A3 = {s:{c:0, r:2}, e:{c:3, r:2}};
            let A4 = {s:{c:0, r:3}, e:{c:3, r:3}};
            let A5 = {s:{c:0, r:4}, e:{c:3, r:4}};

            worksheet["!merges"]=[
                A1,
                A2,
                A3,
                A4,
                A5
            ];

            let wscols = [
                {wch:50},
                {wch:10},
                {wch:10},
                {wch:20}
            ];

            worksheet['!cols'] = wscols;
            worksheet['!cellStyles']

            XLSX.utils.sheet_add_json( worksheet, json, { origin:"A6" });
            const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = XLSXStyle.write( workbook, { bookType: 'xlsx', type: 'buffer', bookSST: true });

            this.saveAsExcelFile( excelBuffer, excelFileName );

        }else if( type.BKB == '010' ){

            const worksheet = XLSX.utils.aoa_to_sheet([
                ["ITS SERVICE LTDA"],
                ["endereço: AV LOBO JUNIOR, 01316 - SALA 301 A 302 - PENHA CIRCULAR, CEP 21020-122"],
                ["telefone: (21) 3439-6930 / e-mail: administração@itsservice.com.br"],
                ["Auto Viação Reginas"],
                [""]
            ]);

            worksheet.A1.s = this.styleCells( 'A1' );
            worksheet.A2.s = this.styleCells( 'A2' );
            worksheet.A3.s = this.styleCells( 'A3' );
            worksheet.A4.s = this.styleCells( 'A4' );
            worksheet.A5.s = this.styleCells( 'A5' );

            let A1 = {s:{c:0, r:0}, e:{c:2, r:0}};
            let A2 = {s:{c:0, r:1}, e:{c:2, r:1}};
            let A3 = {s:{c:0, r:2}, e:{c:2, r:2}};
            let A4 = {s:{c:0, r:3}, e:{c:2, r:3}};
            let A5 = {s:{c:0, r:4}, e:{c:2, r:4}};

            worksheet["!merges"]=[
                A1,
                A2,
                A3,
                A4,
                A5
            ];

            let wscols = [
                {wch:35},
                {wch:30},
                {wch:20},
                //{wch:20}
            ];

            worksheet['!cols'] = wscols;
            worksheet['!cellStyles']

            XLSX.utils.sheet_add_json( worksheet, json, { origin:"A6" });
            const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = XLSXStyle.write( workbook, { bookType: 'xlsx', type: 'buffer', bookSST: true });

            this.saveAsExcelFile( excelBuffer, excelFileName );

        }else{

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet( json );
            const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = XLSXStyle.write( workbook, { bookType: 'xlsx', type: 'buffer', bookSST: true });

            this.saveAsExcelFile( excelBuffer, excelFileName );
        }
    }

    private styleCells( celName: string ){

        const cellStyle = {

            'A1':{
                alignment: {
                    wrapText: true,
                    vertical: 'center',
                    horizontal: 'center'
                },
                border: {
                    //top: { style: 'medium', color: '00000000' },
                    //left: { style: 'medium', color: '00000000' },
                    right: { style: 'medium', color: '00000000' }
                },
                font: {
                    bold: true,
                    sz: 11,
                    color: { rgb: 'FFFFFF' }
                },
                fill:{
                    patternType: 'solid',
                    fgColor: { theme: "1", tint: "-0.25", rgb: 'f2842a' },
                    bgColor: { indexed: 64 }
                }
            },
            'A2':{
                alignment: {
                    wrapText: true,
                    vertical: 'center',
                    horizontal: 'top'
                },
                border: {
                    //left: { style: 'medium', color: '00000000' },
                    right: { style: 'medium', color: '00000000' }
                },
                font: {
                    bold: false,
                    sz: 9,
                    italic: true
                }
            },
            'A3':{
                alignment: {
                    wrapText: true,
                    vertical: 'center',
                    horizontal: 'top'
                },
                border: {
                    //left: { style: 'medium', color: '00000000' },
                    right: { style: 'medium', color: '00000000' }
                },
                font: {
                    bold: false,
                    sz: 9,
                    italic: true
                }
            },
            'A4':{
                alignment: {
                    wrapText: true,
                    vertical: 'center',
                    horizontal: 'top'
                },
                border: {
                    //left: { style: 'medium', color: '00000000' },
                    right: { style: 'medium', color: '00000000' }
                },
                font: {
                    bold: false,
                    sz: 9,
                    italic: true
                }
            },
            'A5':{
                alignment: {
                    wrapText: true,
                    vertical: 'center',
                    horizontal: 'top'
                },
                border: {
                    bottom: { style: 'medium', color: '00000000' },
                    //left: { style: 'medium', color: '00000000' },
                    right: { style: 'medium', color: '00000000' }
                },
                font: {
                    bold: true,
                    sz: 8,
                    italic: true
                }
            }
        };
        return cellStyle[ celName ];
    }

    private saveAsExcelFile(buffer: any, fileName: string): void{

        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }
}
