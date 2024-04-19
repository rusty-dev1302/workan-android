import { BaseResponse } from "./base-response";

export class ServicePricing extends BaseResponse {

    constructor(
        public id: number,
        public serviceName: string,
        public charges: number,
        public serviceTimeHh: number,
        public serviceTimeMm: number,
        state: string,
        message: string,
    ) {
        super(state, message);
    }
}