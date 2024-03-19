export class SubCategory{
    constructor(
        public id: number,

        public subCategoryName: string,

        public categoryName: string,

        public servicePricings: string[],

        public verificationMandatory: boolean
    ) {
    }
}