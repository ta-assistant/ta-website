export type oauthCredential = {
  user: {
    uid: string;
    displayName: string;
    photoURL: string;
    email: string;
    emailVerified: boolean;
    phoneNumber: string;
    isAnonymous: boolean;
    tenantId: string;
    providerData: [
      {
        uid: string;
        displayName: string;
        photoURL: string;
        email: string;
        phoneNumber: string;
        providerId: string;
      }
    ];
    apiKey: string;
    appName: string;
    authDomain: string;
    stsTokenManager: {
      apiKey: string;
      refreshToken: string;
      accessToken: string;
      expirationTime: number;
    };
    redirectEventId: string;
    lastLoginAt: string;
    createdAt: string;
    multiFactor: { enrolledFactors: [] };
  };
  credential: {
    providerId: string;
    signInMethod: string;
    oauthIdToken: string;
    oauthAccessToken: string;
  };
  operationType: string;
  additionalUserInfo: {
    providerId: string;
    isNewUser: boolean;
    profile: {
      name: string;
      granted_scopes: string;
      id: string;
      verified_email: boolean;
      given_name: string;
      locale: string;
      family_name: string;
      email: string;
      picture: string;
    };
  };
};
