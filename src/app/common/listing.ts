import { BaseResponse } from "./base-response";
import { Professional } from "./professional";
import { SubCategory } from "./subCategory";

// These are ad listings 

export class Listing extends BaseResponse{
    constructor(
        public id: number,
        public charges: number,
        public chargesType: string,
        public enabled: boolean,
        public professionalEmail: string,
        public location: string,
        public professionalId: number,
        public professional: Professional,
        public subCategory: SubCategory,
        public experience: number,
        public geoHash: string,
        state: string,
        message: string
    
    ) {
        super(state, message);
    }
}