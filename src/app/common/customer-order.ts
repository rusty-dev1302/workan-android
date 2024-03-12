import { BaseResponse } from "./base-response";
import { Customer } from "./customer";
import { Professional } from "./professional";

export class CustomerOrder extends BaseResponse{
    constructor(
        
        public id: number,
        public customer: Customer,
        public professional: Professional,
        public status: string,
        public appointmentDate: Date,
        public charges: number,
        public listingId: number,
        public startTimeHhmm: number,
        public endTimeHhmm: number,
        public subCategoryName: string,
        public paymentStatus:string,
        public reviewDone: boolean,
        public cancelReason: string,
        public otp: string,
        state: string,
        message: string
    ) {
        super(state, message);
    }

}