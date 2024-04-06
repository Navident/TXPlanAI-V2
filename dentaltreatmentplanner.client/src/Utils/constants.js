export const API_BASE_URL = (() => {
    const { hostname } = window.location;

    if (hostname === 'localhost') {
        return 'https://localhost:7089/api';
    } else if (hostname === 'dentaltreatmentplanner-staging.azurewebsites.net') {
        return 'https://dentaltreatmentplanner-staging.azurewebsites.net/api';
    } else if (hostname === 'app.getnavident.com') {
        return 'https://app.getnavident.com/api';
    } else {
        return 'https://dentaltreatmentplanner.azurewebsites.net/api';
    }
})();
