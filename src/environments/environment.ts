export const environment = {
    production: false,
    keycloak : {
        // issuer: "http://workan.ca/auth/realms/workan",
        // redirectUri: "http://workan.ca/",
        issuer: "http://localhost:8080/auth/realms/workan",
        redirectUri: "http://localhost:4200/",
        clientId: "workan-app",
        scope: "profile email offline_access"
    },
};