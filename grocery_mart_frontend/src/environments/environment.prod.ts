import { getWindow } from '../app/utils/platform';

export const environment = {
  production: true,
  // PUBLIC_INTERFACE
  /** Base URL for backend REST API (should be set via .env mapping in deployment). */
  apiBaseUrl: (getWindow() as any)?.__env?.API_BASE_URL || '/api'
};
