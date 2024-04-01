import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: '09ce749c-1f75-4e8f-8e36-755330e111b4',
        enableAutoRouteTracking: true 
    }
});

appInsights.loadAppInsights();
appInsights.trackPageView(); 

export default appInsights;
