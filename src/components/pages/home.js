var React                 = require('react/addons');
var Dispatcher            = require('root/dispatcher');
var Router                = require('react-router');
var PureRenderMixin       = React.PureRenderMixin;
var Ore                   = require('orejs');
var AutoComplete          = require('components/autocomplete');

require('styles/home');

var ENTER_KEY       = 13;
var ESC_KEY         = 27;
var BACKSPACE_KEY   = 8;
var CMD_KEY         = 91;
var SHIFT_KEY       = 16;
var LEFT_KEY        = 37;
var RIGHT_KEY       = 39;

module.exports = React.createClass({
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
    document.title = 'Muuvie';

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
      <div className='Page HomePage'>
        <div ref='inputWrapper' className={'SearchInput ' + isEmpty + ' ' + isFocused}>
          <div ref='inputInnerWrapper' className='SearchInput-inner'>
            {inputValue.slice(0, cursorPosition)}
            <span className='SearchInput-cursor is-hidden'></span>
            {inputValue.slice(cursorPosition, inputValue.length)}
            <span className='SearchInput-placeHolder is-hidden'>Search here</span>
          </div>
          <input
            ref='realInput'
            className='SearchInput-input'
            onFocus={this.toggleFocus}
            onBlur={this.toggleFocus}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange} />
        </div>
        <AutoComplete ref='AutoComplete' />
      </div>
    )
  }
});
