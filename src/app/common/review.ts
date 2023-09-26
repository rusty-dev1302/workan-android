import { BaseResponse } from "./base-response";
import { Professional } from "./professional";

export class Review extends BaseResponse{
    constructor(
        public customer: string,
        public content: string,
        public rating: number,
        public professional: Professional,
        state: string,
        message: string
    ) {
        super(state, message);
    }
}