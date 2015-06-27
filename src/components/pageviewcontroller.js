/* simplify this implementation.
   It's totally a brain fuck */

var React                 = require('react/addons');
var Router                = require('react-router');
var PureRenderMixin       = React.addons.PureRenderMixin;
var Spinner               = require('components/spinner');
var CSSTransitionGroup    = React.addons.CSSTransitionGroup;

var wttArgs;
var wtfArgs;
var page;

var willTransitionFrom = function(){
  (page && page.willTransitionFrom) ? page.willTransitionFrom(wtfArgs[0], wtfArgs[1], wtfArgs[2]) : '';
}

var willTransitionTo = function(){
  (page && page.willTransitionTo) ? page.willTransitionTo(wttArgs[0], wttArgs[1], wttArgs[2], wttArgs[3]) : '';
}

var transitionTo = function(_page, self, name){
  willTransitionFrom();

  page = _page;

  willTransitionTo();

  self.setState({
    component: page,
    name     : name
  });
}

var pages = {
  'home' : function(self, name){
    require.ensure([], function(){
      transitionTo(require('pages/home'), self, name);
    });
  },

  'search' : function(self, name){
    require.ensure([], function(){
      transitionTo(require('pages/search'), self, name);
    });
  },

  'movie' : function(self, name){
    require.ensure([], function(){
      transitionTo(require('pages/movie'), self, name);
    });
  }
}

module.exports = React.createClass({
  displayName : 'Page ViewController',

  mixins: [Router.State, PureRenderMixin],

  statics: {
    willTransitionTo: function(){
      wttArgs = arguments;
    },

    willTransitionFrom: function(){
      wtfArgs = arguments;
    }
  },

  getInitialState: function(){
    return {
      component : null,
      name      : null
    }
  },

  loadPage: function(){
    var routes = this.getRoutes();
    var name   = routes[routes.length - 1].name;

    if (name === this.state.name) return false;

    this.setState({
      name      : null,
      component : null
    });

    pages[name](this, name);
  },

  componentWillMount: function(){
    this.loadPage();
  },

  componentWillReceiveProps: function(){
    this.loadPage();
  },

  render: function(){
    if (!this.state.component) return (<Spinner />);
    document.getElementById('render').className = this.state.name;
    return (
      <this.state.component {...this.props} />
    );
  }
});
