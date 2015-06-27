webpackJsonp([3],{

/***/ 231:
/***/ function(module, exports, __webpack_require__) {

	var React                 = __webpack_require__(5);
	var Dispatcher            = __webpack_require__(224);
	var PureRenderMixin       = React.addons.PureRenderMixin;
	var Spinner               = __webpack_require__(219);
	var Ore                   = __webpack_require__(221);
	var MovieStore            = __webpack_require__(232);
	var ListItem              = __webpack_require__(240);
	
	__webpack_require__(241);
	
	module.exports = React.createClass({displayName: "module.exports",
	  mixins: [PureRenderMixin, Ore.Mixin],
	
	  statics: {
	    willTransitionTo: function(transition, params, query, callback){
	      if (params.searchTerm != MovieStore.state.get('movie:searchTerm')) {
	        Dispatcher.dispatch(new Ore.ACTION({
	          type: 'search:submit',
	          payload: {
	            searchTerm: params.searchTerm
	          }
	        }) );
	      }
	    }
	  },
	
	  defineRequiredData: function(){
	    return [
	      'movie:busy',
	      'movie:result',
	      'movie:searchTerm'
	    ]
	  },
	
	  renderItems: function(){
	    var items = [];
	
	    this.state['movie:result'].forEach(function(data, id){
	      if (!data) return false;
	      var style = {
	        animationDelay : Math.random() * 0.4 + 's'
	      }
	      items.push(React.createElement(ListItem, {data: data, key: id, style: style}));
	    });
	
	    return items;
	  },
	
	  render: function(){
	    if (this.state['movie:busy'])
	      return (React.createElement(Spinner, null));
	
	    if (!this.state['movie:result'].size)
	      return (React.createElement("div", null, "No result"));
	
	    return (
	      React.createElement("div", {className: "Page SearchPage"}, 
	        React.createElement("div", {className: "ResultList"}, 
	          this.renderItems()
	        )
	      )
	    )
	  }
	});


/***/ },

/***/ 240:
/***/ function(module, exports, __webpack_require__) {

	var React                 = __webpack_require__(5);
	var Dispatcher            = __webpack_require__(224);
	var PureRenderMixin       = React.addons.PureRenderMixin;
	var Router                = __webpack_require__(178);
	
	module.exports = React.createClass({displayName: "module.exports",
	  mixins: [Router.Navigation ,PureRenderMixin],
	
	  showDetails: function(){
	    this.transitionTo('movie', {
	      imdbID : this.props.data.get('imdbID')
	    });
	  },
	
	  componentDidMount: function(){
	    var img = new Image;
	
	    img.onload = function(){
	      this.refs['Image'].getDOMNode().classList.add('is-loaded');
	    }.bind(this)
	
	    img.src = 'http://crossorigin.me/' + this.props.data.get('Poster');
	  },
	
	  render: function(){
	    var data = this.props.data;
	    var style = {
	      backgroundColor: data.get('Color')
	    };
	    return (
	      React.createElement("div", {className: "MovieListItem", onClick: this.showDetails, style: this.props.style}, 
	        React.createElement("figure", {className: "MovieListItem-poster", style: {backgroundColor: data.get('Color')}}, 
	          React.createElement("figure", {className: "MovieListItem-poster-inner", ref: "Image", style: {
	            backgroundImage: 'url(http://crossorigin.me/' + data.get('Poster')+')'
	          }})
	        ), 
	        React.createElement("div", {className: "MovieListItem-info"}, 
	          React.createElement("h4", null, data.get('Title')), 
	          React.createElement("h6", null, data.get('Genre') || ''), 
	          React.createElement("h6", null, data.get('Runtime') || '')
	        )
	      )
	    )
	  }
	});


/***/ },

/***/ 241:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(242);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./search.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./search.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 242:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	exports.push([module.id, ".ResultList {\n  padding: 10px;\n}\n\n.MovieListItem {\n  width: 20%;\n  float: left;\n  position: relative;\n  padding: 10px 10px 30px 10px;\n  overflow: hidden;\n  opacity: 0;\n  transform: translateX(100px);\n  animation: ItemIn .3s 1 ease forwards;\n  cursor: pointer;\n}\n\n.MovieListItem-poster {\n  position: relative;\n  width: 100%;\n  border-radius: 4px;\n  overflow: hidden;\n  padding-bottom: 142%;\n  margin: 0;\n  background-repeat: no-repeat;\n  background-size: cover;\n  background-position: center;\n}\n\n.MovieListItem-poster-inner {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  background-repeat: no-repeat;\n  background-size: cover;\n  background-position: center;\n  opacity: 0;\n}\n\n.MovieListItem-poster-inner.is-loaded {\n  animation: FadeIn .3s .3s 1 ease forwards;\n}\n\n.MovieListItem-info {\n  padding: 1.4rem 0;\n}\n\n.MovieListItem-info\n  h4 {\n    display: block;\n    padding: 0;\n    font-size: 1.4rem;\n    font-weight: 200;\n    color: #000;\n    margin: 0;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n  }\n\n  .MovieListItem-info\n    h6 {\n      display: block;\n      padding: 0.5rem 0 0;\n      font-size: 1.2rem;\n      font-weight: 200;\n      color: #aaa;\n      margin: 0;\n    }\n\n@keyframes ItemIn {\n  0% {\n    opacity: 0;\n    transform: translateY(100px);\n  }\n\n  100% {\n    opacity: 1;\n    transform: translateY(0px);\n  }\n}\n", ""]);

/***/ }

});
//# sourceMappingURL=3.3.js.map