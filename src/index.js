require('styles/spinner');

require.ensure([], function(){
  var React                 = require('react/addons');
  var Router                = require('react-router');
  var Route                 = Router.Route;
  var DefaultRoute          = Router.DefaultRoute;
  var RouteHandler          = Router.RouteHandler;
  var Redirect              = Router.Redirect;
  var PageViewController    = require('components/pageviewcontroller');
  var Header                = require('components/header');
  var MovieStore            = require('stores/movie');

  require('styles/normalize');
  require('styles/main');

  var App = React.createClass({
    render: function(){
      return (
        <main>
          <Header />
          <RouteHandler />
        </main>
      )
    }
  });

  var routes = (
    <Route path='muuvie/' handler={App}>
      <DefaultRoute name='home' handler={PageViewController} />
      <Route name='search' path='/search/:searchTerm' handler={PageViewController} />
      <Route name='movie' path='/movie/:imdbID' handler={PageViewController} />

      <Redirect from='/search/:searchTerm/' to='search' />
      <Redirect from='/search/' to='/' />
      <Redirect from='/search' to='/' />
    </Route>
  );

  Router.run(routes, Router.HistoryLocation, function(Handler, state){
    React.render(<Handler />, document.getElementById('render'));
  });
});
