export class Listing {
    constructor(
        public id: number,
        public charges: number,
        public chargesType: string,
        public professionalId: number,
        public subCategoryName: string,
        public location: string
    ) {
        
    }
}