export const environment = {
    production: false,
    keycloak : {
        issuer: "http://localhost:8080/auth/realms/workan",
        redirectUri: "http://localhost:4200/",
        clientId: "workan-app",
        scope: "profile email offline_access"
    },
};