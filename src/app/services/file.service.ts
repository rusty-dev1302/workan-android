import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from 'src/environments/constants';
import { BaseResponse } from '../common/base-response';
import { Invoice } from '../common/invoice';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private baseUrl = constants.API_SERVER + '/api/v1/files';

  pdfMake = require('pdfmake/build/pdfmake');
  pdfFonts = require('pdfmake/build/vfs_fonts');

  constructor(
    private httpClient: HttpClient,
    private datePipe: DatePipe,
  ) {
    this.pdfMake.vfs = this.pdfFonts.pdfMake.vfs;
  }

  uploadAttachment(uploadData: any, certId: number): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/attachment/save?certId=${certId}`;
    return this.httpClient.post<BaseResponse>(postUrl, uploadData);
  }

  generatePdfForInvoice(fileName: string, invoice: Invoice) {

    this.pdfMake.createPdf(this.prepareInvoice(invoice)).download('invoice_' + fileName + '.pdf');

  }

  formatBreakdown(breakdown: any): any {
    var item: any;
    var breakdownList = [
      [
        {
          text: 'DESCRIPTION',
          fillColor: '#eaf2f5',
          border: [false, true, false, true],
          margin: [0, 5, 0, 5],
          textTransform: 'uppercase',
        },
        {
          text: 'AMOUNT',
          border: [false, true, false, true],
          alignment: 'right',
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          textTransform: 'uppercase',
        },
      ],
    ];

    for (let i = 0; i < breakdown.length; i++) {
      if (breakdown[i].detail == constants.AMOUNT_COLLECTED_CUSTOMER) {
        item = [
          {
            text: breakdown[i].detail,
            border: [true, true, false, true],
            fillColor: '#f0f0f0',
            margin: [0, 5, 0, 5],
            alignment: 'left',
          },
          {
            border: [false, true, true, true],
            fillColor: '#f0f0f0',
            text: this.amountToString(breakdown[i].amount),
            alignment: 'right',
            margin: [0, 5, 0, 5],
          },
        ];
      } else {
        item = [
          {
            text: breakdown[i].detail,
            border: [false, false, false, true],
            margin: [0, 5, 0, 5],
            alignment: 'left',
          },
          {
            border: [false, false, false, true],
            text: this.amountToString(breakdown[i].amount),
            fillColor: '#f5f5f5',
            alignment: 'right',
            margin: [0, 5, 0, 5],
          },
        ];
      }

      breakdownList.push(item);
    }

    return breakdownList;
  }

  prepareInvoice(invoice: Invoice): any {
    var breakdown = invoice.breakdown;
    let invoiceDefinition = {
      content: [
        {
          columns: [
            {
              image:
                'data:image/png;base64,' + constants.WORKAN_LOGO_BASE64,
              width: 100,
            },
            [
              {
                text: 'Invoice',
                color: '#333333',
                width: '*',
                fontSize: 20,
                bold: true,
                alignment: 'right',
                margin: [0, 0, 0, 15],
              },
              {
                stack: [
                  {
                    columns: [
                      {
                        text: 'Date Issued',
                        color: '#515151',
                        bold: true,
                        width: '*',
                        fontSize: 12,
                        alignment: 'right',
                      },
                      {
                        text: this.datePipe.transform(invoice.dateCreated, 'dd/MM/YYYY'),
                        bold: true,
                        color: '#333333',
                        fontSize: 12,
                        alignment: 'right',
                        width: 100,
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Status',
                        color: '#515151',
                        bold: true,
                        fontSize: 12,
                        alignment: 'right',
                        width: '*',
                      },
                      {
                        text: this.paymentComplete(invoice.paid),
                        bold: true,
                        fontSize: 14,
                        alignment: 'right',
                        color: this.paymentCompleteColor(invoice.paid),
                        width: 100,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        {
          columns: [
            {
              text: 'Customer',
              color: '#515151',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 20, 0, 5],
            },
            {
              text: 'Professional',
              color: '#515151',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 20, 0, 5],
            },
          ],
        },
        {
          columns: [
            {
              text: invoice.fromName,
              bold: true,
              color: '#333333',
              alignment: 'left',
            },
            {
              text: invoice.toName,
              bold: true,
              color: '#333333',
              alignment: 'left',
            },
          ],
        },
        '\n\n',
        {
          width: '100%',
          alignment: 'center',
          text: 'Invoice No. ' + this.datePipe.transform(invoice.dateCreated, 'YYYY.MM.dd.')+invoice.id,
          bold: true,
          margin: [0, 10, 0, 10],
          fontSize: 15,
        },
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function (i: any, node: any) {
              return 1;
            },
            vLineWidth: function (i: any, node: any) {
              return 1;
            },
            hLineColor: function (i: any, node: any) {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: function (i: any, node: any) {
              return '#eaeaea';
            },
            hLineStyle: function (i: any, node: any) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i: any, node: any) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function (i: any, node: any) {
              return 10;
            },
            paddingRight: function (i: any, node: any) {
              return 10;
            },
            paddingTop: function (i: any, node: any) {
              return 2;
            },
            paddingBottom: function (i: any, node: any) {
              return 2;
            },
            fillColor: function (rowIndex: any, node: any, columnIndex: any) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['*', 80],
            body: this.formatBreakdown(breakdown),
          },
        },
        '\n',
        '\n\n',
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function (i: any, node: any) {
              return 1;
            },
            vLineWidth: function (i: any, node: any) {
              return 1;
            },
            hLineColor: function (i: any, node: any) {
              return '#eaeaea';
            },
            vLineColor: function (i: any, node: any) {
              return '#eaeaea';
            },
            hLineStyle: function (i: any, node: any) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i: any, node: any) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function (i: any, node: any) {
              return 10;
            },
            paddingRight: function (i: any, node: any) {
              return 10;
            },
            paddingTop: function (i: any, node: any) {
              return 3;
            },
            paddingBottom: function (i: any, node: any) {
              return 3;
            },
            fillColor: function (rowIndex: any, node: any, columnIndex: any) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['*', 'auto'],
            body: [
              [
                {
                  text: 'Payment Subtotal',
                  border: [false, true, false, true],
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  border: [false, true, false, true],
                  text: 'CA$' + invoice.totalAmount.toFixed(2),
                  alignment: 'right',
                  fillColor: '#f5f5f5',
                  margin: [0, 5, 0, 5],
                },
              ],
              // [
              //   {
              //     text: 'Payment Processing Fee',
              //     border: [false, false, false, true],
              //     alignment: 'right',
              //     margin: [0, 5, 0, 5],
              //   },
              //   {
              //     text: '$999.99',
              //     border: [false, false, false, true],
              //     fillColor: '#f5f5f5',
              //     alignment: 'right',
              //     margin: [0, 5, 0, 5],
              //   },
              // ],
              [
                {
                  text: 'Total Amount',
                  bold: true,
                  fontSize: 15,
                  alignment: 'right',
                  border: [false, false, false, true],
                  margin: [0, 5, 0, 5],
                },
                {
                  text: 'CA$' + invoice.totalAmount.toFixed(2),
                  bold: true,
                  fontSize: 15,
                  alignment: 'right',
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
        },
        '\n\n',
        {
          text: 'TERMS AND CONDITIONS',
          style: 'notesTitle',
        },
        {
          text: '1. The amount includes taxes, payable by the freelance professional.\n2. For more information please read our Terms Of Use (www.workan.ca/termsOfUse).',
          style: 'notesText',
        },
      ],
      styles: {
        notesTitle: {
          fontSize: 10,
          bold: true,
          margin: [0, 50, 0, 3],
        },
        notesText: {
          fontSize: 10,
        },
      },
      defaultStyle: {
        columnGap: 20,
        //font: 'Quicksand',
      },
    };
    return invoiceDefinition;
  }

  paymentComplete(status: boolean): String {
    if (status) {
      return "PAID"
    } else {
      return "UNPAID"
    }
  }

  paymentCompleteColor(status: boolean): string {
    if (status) {
      return "green"
    } else {
      return "red"
    }
  }

  amountToString(amount: any): string {
    if (amount < 0) {
      return "- $" + (-1 * amount);
    } else {
      return "$" + (amount);
    }
  }

  getAttachmentsForCertificate(certId: number): Observable<any[]> {
    const getUrl = `${this.baseUrl}/attachments?certId=${certId}`;
    return this.httpClient.get<any[]>(getUrl)
  }

  downloadAttachment(attachmentByte: any, fileName: string, type: string) {
    const byteArray = new Uint8Array(
      atob(attachmentByte)
        .split('')
        .map((char) => char.charCodeAt(0))
    );

    const file = new Blob([byteArray], { type: type });
    const fileUrl = URL.createObjectURL(file);
    let link = document.createElement('a');
    link.download = fileName;
    link.target = '_blank';
    link.href = fileUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }



}
