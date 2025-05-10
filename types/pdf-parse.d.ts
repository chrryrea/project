declare module 'pdf-parse' {
  export interface PDFData {
    numpages: number;
    numrender: number;
    info: {
      PDFFormatVersion: string;
      IsAcroFormPresent: boolean;
      IsXFAPresent: boolean;
      [key: string]: any;
    };
    metadata: {
      [key: string]: any;
    };
    text: string;
    version: string;
  }

  const parse: (dataBuffer: Buffer) => Promise<PDFData>;
  export default parse;
  
  export class PDFDocument {
    static load(dataBuffer: Buffer): Promise<PDFDocument>;
  }
} 