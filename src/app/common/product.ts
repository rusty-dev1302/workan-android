import { Professional } from "./professional";

export class Product {
    constructor(
        public id: number,
        public charges: number,
        public chargesType: string,
        public professionalId: number,
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
