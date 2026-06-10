const endpoints = {
  auth: {
    path: `/users`,
    subroutes: {
      login: `/users/signIn`,
        me: `/users/me`,
      register: `/users/signUp`,
      verify: `/users/verify`,
      forget: `/users/findForModifyPassword`,
      verifyTokenModifyPassword : '/users/verifyTokenModifyPassword',
      logout: '/users/logout',

    },
  },
  card: {
    path: `/card`,
  },
  externalApi: {
    path: `/external_api`,
    subroutes: {
      cards: `/external_api/cards`,
      searchCard: `/external_api/searchCard`,
    },
  },
};

export default endpoints;
