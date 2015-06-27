webpackJsonp([2],{

/***/ 220:
/***/ function(module, exports, __webpack_require__) {

	var React                 = __webpack_require__(5);
	var Dispatcher            = __webpack_require__(224);
	var Router                = __webpack_require__(178);
	var PureRenderMixin       = React.PureRenderMixin;
	var Ore                   = __webpack_require__(221);
	var AutoComplete          = __webpack_require__(228);
	
	__webpack_require__(229);
	
	var ENTER_KEY       = 13;
	var ESC_KEY         = 27;
	var BACKSPACE_KEY   = 8;
	var CMD_KEY         = 91;
	var SHIFT_KEY       = 16;
	var LEFT_KEY        = 37;
	var RIGHT_KEY       = 39;
	
	module.exports = React.createClass({displayName: "module.exports",
	  mixins : [PureRenderMixin, Router.Navigation],
	
	  getInitialState: function(){
	    return {
	      inputValue      : '',
	      cursorPosition  : 0,
	      focused         : false
	    }
	  },
	
	  handleChange: function(){
	    var input           = this.refs['realInput'].getDOMNode();
	    var value           = input.value;
	    var cursorPosition  = input.selectionStart;
	    this.setState({
	      inputValue : value,
	      cursorPosition : cursorPosition
	    });
	
	    Dispatcher.dispatch(new Ore.ACTION({
	      type : 'search:autocomplete',
	      payload: {
	        searchTerm: value
	      }
	    }) );
	  },
	
	  handleKeyDown: function(e){
	    var key = e.which;
	
	    switch (key){
	      case ESC_KEY:
	        return this.handleEsc()
	        break;
	
	      case ENTER_KEY:
	        return this.handleEnter()
	        break;
	
	      case LEFT_KEY:
	        return this.moveCursor('left');
	        break;
	
	      case RIGHT_KEY:
	        return this.moveCursor('right');
	        break;
	    }
	  },
	
	  handleEsc: function(){
	    this.refs['realInput'].getDOMNode().value = '';
	    this.setState({
	      inputValue: ''
	    });
	  },
	
	  handleEnter: function(){
	    var inputValue = this.state['inputValue'];
	    this.transitionTo('/search/'+inputValue);
	  },
	
	  moveCursor: function(direction){
	    var cursorPosition = this.state['cursorPosition'];
	    var inputValue     = this.state['inputValue'];
	
	    if (direction == 'left' && cursorPosition == 0){
	      cursorPosition = 0;
	    } else if (direction == 'left'){
	      cursorPosition = cursorPosition - 1;
	    } else if(cursorPosition != inputValue.length) {
	      cursorPosition = cursorPosition + 1;
	    }
	
	    this.setState({
	      cursorPosition : cursorPosition
	    });
	
	  },
	
	  toggleFocus: function(){
	    this.setState({
	      focused : !this.state.focused
	    });
	  },
	
	  componentWillMount: function(){
	    Dispatcher.dispatch(new Ore.ACTION({
	      type : 'search:clearAutocomplete'
	    }) )
	  },
	
	  componentDidUpdate: function(){
	    var innerWrapper        = this.refs['inputInnerWrapper'].getDOMNode();
	    var wrapperWidth        = this.refs['inputWrapper'].getDOMNode().clientWidth;
	    var innerWrapperWidth   = innerWrapper.clientWidth;
	    var diff = innerWrapperWidth - wrapperWidth;
	
	    if (diff > 0) {
	      innerWrapper.style.marginLeft = (-1 * diff - 2) + 'px';
	    } else {
	      innerWrapper.style.marginLeft = 0;
	    }
	  },
	
	  render: function(){
	    var cursorPosition    = this.state['cursorPosition'];
	    var inputValue        = this.state['inputValue'];
	    var focused           = this.state['focused'];
	    var isEmpty           = (inputValue.length == 0) ? 'is-empty' : '';
	    var isFocused         = (focused) ? 'is-focused' : '';
	
	    return (
	      React.createElement("div", {className: "Page HomePage"}, 
	        React.createElement("div", {ref: "inputWrapper", className: 'SearchInput ' + isEmpty + ' ' + isFocused}, 
	          React.createElement("div", {ref: "inputInnerWrapper", className: "SearchInput-inner"}, 
	            inputValue.slice(0, cursorPosition), 
	            React.createElement("span", {className: "SearchInput-cursor is-hidden"}), 
	            inputValue.slice(cursorPosition, inputValue.length), 
	            React.createElement("span", {className: "SearchInput-placeHolder is-hidden"}, "Search here")
	          ), 
	          React.createElement("input", {
	            ref: "realInput", 
	            className: "SearchInput-input", 
	            onFocus: this.toggleFocus, 
	            onBlur: this.toggleFocus, 
	            onKeyDown: this.handleKeyDown, 
	            onChange: this.handleChange})
	        ), 
	        React.createElement(AutoComplete, {ref: "AutoComplete"})
	      )
	    )
	  }
	});


/***/ },

/***/ 228:
/***/ function(module, exports, __webpack_require__) {

	var React                 = __webpack_require__(5);
	var PureRenderMixin       = React.addons.PureRenderMixin;
	var Dispatcher            = __webpack_require__(224);
	var Ore                   = __webpack_require__(221)
	
	var UP_KEY                = 38;
	var DOWN_KEY              = 40;
	var ENTER_KEY             = 13;
	
	module.exports = React.createClass({displayName: "module.exports",
	  mixins: [PureRenderMixin, Ore.Mixin],
	
	  getInitialState: function(){
	    return {
	      'selectedIndex' : -1
	    }
	  },
	
	  defineRequiredData: function(){
	    return [
	      'movie:autocomplete'
	    ]
	  },
	
	  renderItems: function(){
	    var items = [];
	    
	    this.state['movie:autocomplete'].toList().forEach(function(item, index){
	      items.push(
	        React.createElement("div", {key: index, className: "AutoComplete-item"}, 
	          item.get('Title')
	        )
	      )
	    })
	
	    return items;
	  },
	
	  render: function(){
	    var items = this.renderItems()
	    return (
	      React.createElement("div", {className: 'AutoComplete ' + ((items.length) ? '' : 'is-hidden')}, 
	        items
	      )
	    )
	  }
	});


/***/ },

/***/ 229:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(230);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./home.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./home.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 230:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	exports.push([module.id, ".HomePage {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100vw;\n  height: 100vh;\n}\n\n.SearchInput {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  display: block;\n  width: 40%;\n  height: 8rem;\n  line-height: 8rem;\n  font-size: 3.2rem;\n  color: #000;\n  overflow: hidden;\n  transform: translateX(-50%) translateY(-50%);\n  border-bottom: 1px solid #dadada;\n  animation: SearchInputIn .3s 1 ease forwards;\n}\n\n.SearchInput.is-focused {\n  border-bottom-color: #000;\n}\n\n.SearchInput-inner {\n  position: absolute;\n  left: 0;\n  top: 0;\n  height: 8rem;\n  z-index: 20;\n}\n\n.SearchInput-inner\n  > * {\n    vertical-align: middle;\n  }\n\n.SearchInput-cursor {\n  width: 1px;\n  margin-right: -1px;\n  height: 6rem;\n  background: #000000;\n  animation: blink infinite 1s steps(1);\n}\n\n.SearchInput.is-focused\n  .SearchInput-cursor {\n    display: inline-block;\n  }\n\n.SearchInput-placeHolder {\n  color: #dadada;\n}\n\n.SearchInput.is-empty\n  .SearchInput-placeHolder {\n    display: inline-block;\n  }\n\n.SearchInput-input {\n  display: block;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  border: none;\n  outline: none;\n  background: transparent;\n  color: transparent;\n  z-index: 50;\n}\n\n.AutoComplete {\n  position: absolute;\n  left: 50%;\n  top: calc(50% + 4rem);\n  width: 40%;\n  transform: translateX(-50%);\n  padding: 10px 0;\n  color: #dadada;\n  border-top: none;\n}\n\n.AutoComplete-item {\n  font-size: 1.8rem;\n  padding: 6px 16px;\n}\n\n@keyframes blink {\n  0% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n\n@keyframes SearchInputIn {\n  0% {\n    opacity: 0;\n    transform: translateX(-50%) translateY(10%);\n  }\n\n  100% {\n    opacity: 1;\n    transform: translateX(-50%) translateY(-50%);\n  }\n}\n", ""]);

/***/ }

});
//# sourceMappingURL=2.2.js.map