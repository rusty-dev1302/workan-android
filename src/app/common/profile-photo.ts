import { BaseResponse } from "./base-response";

export class ProfilePhoto extends BaseResponse{

    constructor(
        public id: number,
        public customerId: number,
        public picByte: any,
        public thumbnail: any,
        state: string,
        message: string
    ) {
        super(state, message);
    }
}