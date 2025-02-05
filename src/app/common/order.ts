import { BaseResponse } from "./base-response";
import { Customer } from "./customer";
import { Professional } from "./professional";

export class Order extends BaseResponse{
    constructor(
        
        public id: number,
        public customer: Customer,
        public professional: Professional,
        public status: string,
        public appointmentDate: Date,
        public charges: number,
        public listingId: number,
        public appointmentTimeHhmm: number,
        public preferredStartTimeHhmm: number,
        public preferredEndTimeHhmm: number,
        public subCategoryName: string,
        public listingDistance: number,
        public numSchedule: number,
        public paymentStatus:string,
        public otp: string,
        public directInitiated: boolean,
        public reviewDone: boolean,
        public cancelReason: string,
        public menuItems: any[],
        public duration: string,
        state: string,
        message: string
    ) {
        super(state, message);
    }

}