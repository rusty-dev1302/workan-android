export class PushNotification {
    constructor(
        public id: number,
        public message: string,
        public timeCreated: Date,
        public messageRead: boolean,
        public routeLink: string,
    ) { }
}