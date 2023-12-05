export class PushNotification {
    constructor(
        public message: string,
        public timeUpdated: Date,
        public messageRead: boolean,
        public routeLink: string,
    ) { }
}