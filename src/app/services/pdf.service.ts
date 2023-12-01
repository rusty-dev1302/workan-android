import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  pdfMake = require('pdfmake/build/pdfmake');
  pdfFonts = require('pdfmake/build/vfs_fonts');

  constructor() { 
    this.pdfMake.vfs = this.pdfFonts.pdfMake.vfs;
  }

  generatePdf(fileName: string) {
    const data = [    ['Name', 'Email', 'Country'],
      ['John Doe', 'johndoe@example.com', 'USA'],
      ['Jane Smith', 'janesmith@example.com', 'Canada'],
      ['Bob Johnson', 'bobjohnson@example.com', 'UK']
    ];
  
    const docDefinition = {
      content: [
        { text: 'User Data', style: 'header' },
        { table: { body: data } }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] }
      }
    };
  
    this.pdfMake.createPdf(docDefinition).download('invoice_'+fileName+'.pdf');
  }

}
