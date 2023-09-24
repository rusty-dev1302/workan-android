import { BaseResponse } from "./base-response";
import { ProfilePhoto } from "./profile-photo";

export class Professional extends BaseResponse{

    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public languages: string[],
        public enabled: boolean,
        public professional: boolean,
        public profilePhoto: ProfilePhoto,
        state: string,
        message: string
    ) {
        super(state, message);
    }
}
