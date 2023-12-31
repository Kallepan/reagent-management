import { environment } from "environments/environment";

export class constants {
    public static APIS = {
        AUTH: environment.authUrl,
        BASE: environment.apiUrl,
        BAK: {
            BASE: environment.apiUrl + '/bak',
        },
    };

    public static JWT = {
        // One hour time in minutes, seconds and miliseconds
        ACCESS_STORAGE: 'access_token',
        REFRESH_STORAGE: 'refresh_token',
        USERNAME_STORAGE: 'username',
    }

    public static TITLE_SHORT = 'RMS';
    public static TITLE_LONG = 'RMS - Reagent Management System';
    public static VERSION = '1.0.0';

    public static ROUTES = [
        { path: '', title: 'Home', tooltip: 'Home' },
        { path: 'bak', title: 'BAK', tooltip: 'Verwaltung von Reagenzien für die BAK' },
        { path: 'pcr/batch/', title: 'PCR', tooltip: 'Verwaltung von InGe Reagenzien für die PCR' },
    ]

    public static IS_PRODUCTION = environment.production;
}