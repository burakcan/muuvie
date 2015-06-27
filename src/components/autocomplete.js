var React                 = require('react/addons');
var PureRenderMixin       = React.addons.PureRenderMixin;
var Dispatcher            = require('root/dispatcher');
var Ore                   = require('orejs')

var UP_KEY                = 38;
var DOWN_KEY              = 40;
var ENTER_KEY             = 13;

module.exports = React.createClass({
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
        <div key={index} className='AutoComplete-item'>
          {item.get('Title')}
        </div>
      )
    })

    return items;
  },

  render: function(){
    var items = this.renderItems()
    return (
      <div className={'AutoComplete ' + ((items.length) ? '' : 'is-hidden')}>
        {items}
      </div>
    )
  }
});
