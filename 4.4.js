webpackJsonp([4],{

/***/ 243:
/***/ function(module, exports, __webpack_require__) {

	var React                 = __webpack_require__(5);
	var PureRenderMixin       = React.addons.PureRenderMixin;
	var Router                = __webpack_require__(178);
	var MovieStore            = __webpack_require__(232);
	var Dispatcher            = __webpack_require__(224);
	var Ore                   = __webpack_require__(221);
	var Spinner               = __webpack_require__(219);
	
	__webpack_require__(244);
	
	module.exports = React.createClass({displayName: "module.exports",
	  mixins: [PureRenderMixin, Ore.Mixin],
	
	  statics: {
	    willTransitionTo: function(transition, params, query, callback){
	      var imdbID = params.imdbID;
	      var movie  = MovieStore.state.getIn(['movie:result', imdbID]);
	      if (!movie) {
	        Dispatcher.dispatch(new Ore.ACTION({
	          type: 'search:submit',
	          payload: {
	            searchType: 'i',
	            searchTerm: imdbID
	          }
	        }) );
	      }
	    }
	  },
	
	  defineRequiredData: function(){
	    return [
	      'movie:result',
	      'movie:busy'
	    ]
	  },
	
	  renderMeta: function(){
	    var data   = this.state['movie:result'].get(this.props.params.imdbID);
	    var color  = data.get('Color');
	    var topics = ['Genre', 'Language', 'Released', 'Runtime'];
	
	    return topics.map(function(topic, i){
	      return (
	        React.createElement("div", {key: i}, 
	          React.createElement("span", {className: "MoviePage-meta-title", style: {color: color}}, 
	            topic, ":"
	          ), 
	          data.get(topic)
	        )
	      );
	    })
	  },
	
	  renderVideo: function(){
	    var width   = (window.innerWidth / 100) * 60;
	    var height  = width / 1.77777;
	    var data    = this.state['movie:result'].get(this.props.params.imdbID);
	
	    if (!data.get('Video')) return (React.createElement("span", null));
	
	    return (
	      React.createElement("iframe", {
	        width: width, 
	        height: height, 
	        src: 'https://www.youtube.com/embed/'+data.get('Video')+'?rel=0&amp;controls=1&amp;showinfo=0', 
	        frameBorder: "0", allowFullScreen: true})
	    )
	  },
	
	  render: function(){
	    if (this.state['movie:busy'])
	      return (React.createElement(Spinner, null));
	
	    if (!this.state['movie:result'].size)
	      return (React.createElement("div", null, "No result"));
	
	    var data = this.state['movie:result'].get(this.props.params.imdbID);
	    var blurryStyle = {
	      backgroundImage : 'url(http://crossorigin.me/' + data.get('Poster')+')',
	      backgroundColor : data.get('Color')
	    }
	
	    return (
	      React.createElement("div", {className: "Page MoviePage"}, 
	        React.createElement("div", {className: "MoviePage-poster-wrapper"}, 
	          React.createElement("figure", {className: "MoviePage-poster is-blurry", style: blurryStyle}), 
	          React.createElement("img", {ref: "posterImg", className: "MoviePage-poster", src: 'http://crossorigin.me/' + data.get('Poster')})
	        ), 
	        React.createElement("article", {className: "MoviePage-content"}, 
	          React.createElement("h2", {className: "MoviePage-title", style: {color: data.get('Color')}}, 
	            data.get('Title')
	          ), 
	          React.createElement("header", {className: "MoviePage-meta"}, 
	            this.renderMeta()
	          ), 
	          React.createElement("p", {className: "MoviePage-plot"}, 
	            data.get('Plot')
	          ), 
	          React.createElement("figure", {ref: "video", className: "MoviePage-video"}, 
	            this.renderVideo()
	          )
	        )
	      )
	    )
	  }
	});


/***/ },

/***/ 244:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(245);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./movie.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./movie.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 245:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	exports.push([module.id, ".MoviePage {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.MoviePage-poster-wrapper {\n  height: 100vh;\n  width: 40vw;\n  position: relative;\n  overflow: hidden;\n  transform: translateX(-100%);\n  animation: Poster .5s .2s 1 ease forwards;\n  float: left;\n}\n\n.MoviePage-poster-wrapper:after {\n  content: '';\n  display: block;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 200%;\n  height: 200%;\n  z-index: 60;\n  transform: translateX(-50%) translateY(-50%);\n  box-shadow: inset 3px 140px 70px #000;\n}\n\n.MoviePage-poster {\n  background-color: #000;\n  width: 50%;\n  position: absolute;\n  margin: 0;\n  background-repeat: no-repeat;\n  background-size: cover;\n  background-position: center;\n  left: 50%;\n  top: 50%;\n  transform: translateX(-50%) translateY(-50%);\n  z-index: 40;\n}\n\n.MoviePage-poster[src='http://crossorigin.me/N/A'] {\n  display: none;\n}\n\n.MoviePage-poster.is-blurry {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 20;\n  -webkit-filter: blur(20px);\n  transform: scale(2);\n}\n\n.MoviePage-content {\n  width: 60vw;\n  height: 100vh;\n  overflow: auto;\n  float: left;\n  padding: 40px;\n  animation: FadeIn 1s 1 ease forwards;\n}\n\n.MoviePage-title {\n  display: block;\n  padding: 0 0 14px;\n  margin: 0;\n  font-weight: 200;\n  font-size: 2.2rem;\n  border-bottom: 1px solid;\n}\n\n.MoviePage-plot {\n  color: #000;\n  font-size: 1.4rem;\n  line-height: 2.4rem;\n  margin: 0;\n  padding: 24px 0;\n  width: 100%;\n  clear: both;\n}\n\n.MoviePage-meta {\n  padding: 24px 0 0;\n  font-size: 1.2rem;\n  line-height: 2.2rem;\n  color: #aaa;\n}\n\n.MoviePage-meta-title {\n  margin-right: 6px;\n}\n\n.MoviePage-video {\n  margin: 24px 0;\n}\n\n.MoviePage-video iframe {\n  border: none;\n  width: 100%;\n}\n\n@keyframes Poster {\n  0% {\n    transform: translateX(-100%);\n  }\n  100% {\n    transform: translateX(0);\n  }\n}\n", ""]);

/***/ }

});
//# sourceMappingURL=4.4.js.map