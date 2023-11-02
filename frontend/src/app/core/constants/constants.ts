import { environment } from "environments/environment";

export class constants {
    public static APIS = {
        AUTH: environment.authUrl,
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

    public static TITLE = 'RSMS';
    public static VERSION = '0.0.1';

    public static ROUTES = [
        { path: '', title: 'Home', },
        { path: 'bak', title: 'BAK', },
    ]
}