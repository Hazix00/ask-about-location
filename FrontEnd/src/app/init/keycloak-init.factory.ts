import { KeycloakService } from "keycloak-angular";
import { environment } from "src/environments/environment";

export function initializeKeycloak(
  keycloak: KeycloakService
  ) {
    return () =>
      keycloak.init({
        config: environment.keycloakConfig,
        initOptions: {
          onLoad: 'login-required',
          checkLoginIframe: false,
          flow: 'implicit'
        },
        enableBearerInterceptor: true,
        bearerExcludedUrls: ['/assets', '/client/public']
      });
}
