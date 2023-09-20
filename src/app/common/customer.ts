import { BaseResponse } from "./base-response";
import { ContactDetail } from "./contact-detail";

export class Customer extends BaseResponse{

    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public gender: string,
        public mobile: number,
        public email: string,
        public languages: string[],
        public enabled: boolean,
        public professional: boolean,
        public contact: ContactDetail,
        public rating: number,
        state: string,
        message: string
    ) {
        super(state, message);
    }
}
