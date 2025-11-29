export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;
export const baseURL = import.meta.env.BASE_URL;

export const shouldShowLogs = isDevelopment;
export const shouldReportErrors = isProduction;
