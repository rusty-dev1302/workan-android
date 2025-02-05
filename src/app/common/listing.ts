import { BaseResponse } from "./base-response";
import { Professional } from "./professional";
import { SubCategory } from "./subCategory";

// These are ad listings 

export class Listing extends BaseResponse{
    constructor(
        public id: number,
        public charges: number,
        public minCharge: number,
        public maxCharge: number,
        public enabled: boolean,
        public professionalEmail: string,
        public location: string,
        public shortLocation: string,
        public professionalId: number,
        public professional: Professional,
        public subCategory: SubCategory,
        public experience: number,
        public timezoneOffset: number,
        public geoHash: string,
        public latitude: number,
        public longitude: number,
        public availableToday: boolean,
        public availableTomorrow: boolean,
        state: string,
        message: string
    
    ) {
        super(state, message);
    }
}