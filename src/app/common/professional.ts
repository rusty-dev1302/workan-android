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
        public fiveRating: number,
        public fourRating: number,
        public threeRating: number,
        public twoRating: number,
        public oneRating: number,
        public rating: number,
        public certifications: any[],
        state: string,
        message: string
    ) {
        super(state, message);
    }
}
