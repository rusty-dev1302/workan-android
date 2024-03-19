import { BaseResponse } from "./base-response";

export class ServicePricing extends BaseResponse{

    constructor(
        public id: number,
        public serviceName: string,
        public charges: number,
        state: string,
        message: string,
    ) {
        super(state, message);
    }
}