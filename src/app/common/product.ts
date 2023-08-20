import { Customer } from "./customer"

export class Product {
    constructor(
        public id: number,
        public charges: number,
        public chargesType: string,
        public professional: Customer,
        public subCategoryName: string,
        public subCategory: SubCategory,
        public professionalEmail: string,
        public location: string
    ) {
        
    }
}

interface SubCategory {
    subCategoryName: string;
  }
