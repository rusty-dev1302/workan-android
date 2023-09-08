import { BaseResponse } from "./base-response";

// These are ad listings 

export class Listing extends BaseResponse{
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