let routerDecorator = ($rootScope, $state, Auth) => {
  'ngInject';
  // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
  $rootScope.$on('$stateChangeStart', function (event, next) {
    if (!next.authenticate) {
      return;
    }

    if (typeof next.authenticate === 'string') {
      Auth.hasRole(next.authenticate, angular.noop)
        .then(has => {
          if (has) {
            return;
          }

          event.preventDefault();
          return Auth.isLoggedIn(angular.noop)
            .then(is => {
              $state.go(is ? 'main.home' : 'login');
            });
        });
    } else {
      Auth.isLoggedIn(angular.noop)
        .then(is => {
          if (is) {
            return;
          }

          event.preventDefault();
          $state.go('main.home');
        });
    }
  });
};

export default routerDecorator;