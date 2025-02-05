export const environment = {
    production: false,
    keycloak : {
        // url: 'https://workan.ca/auth',
        // issuer: "https://workan.ca/auth/realms/workan",
        // redirectUri: "https://workan.ca/",
        url: 'http://localhost:8080/auth',
        issuer: "http://localhost:8080/auth/realms/workan",
        redirectUri: "http://localhost:4200/",
        clientId: "workan-app",
        scope: "profile email offline_access"
    },
};