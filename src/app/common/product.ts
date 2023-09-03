import { BaseResponse } from "./base-response";

export class Product extends BaseResponse{
    constructor(
        public id: number,
        public charges: number,
        public chargesType: string,
        public professionalEmail: string,
        public subCategoryName: string,
        public location: string,
        public professionalId: number,
        state: string,
        message: string
    ) {
        super(state, message);
    }
}