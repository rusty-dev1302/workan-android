import { BaseResponse } from "./base-response";

export class ContactDetail extends BaseResponse{
    constructor(
        public customerId: number,
        public email: string,
        public mobile: number,
        public addressLine3: string,
        public geoHash: string,
        public latitude: number,
        public longitude: number,
        state: string,
        message: string,
    ) {
        super(state, message);
    }
}
