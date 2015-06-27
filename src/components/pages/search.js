var React                 = require('react/addons');
var Dispatcher            = require('root/dispatcher');
var PureRenderMixin       = React.addons.PureRenderMixin;
var Spinner               = require('components/spinner');
var Ore                   = require('orejs');
var MovieStore            = require('stores/movie');
var ListItem              = require('components/movielistitem');

require('styles/search');

module.exports = React.createClass({
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
      items.push(<ListItem data={data} key={id} style={style} />);
    });

    return items;
  },

  componentWillMount: function(){
    document.title = this.props.params['searchTerm'];
  },

  render: function(){
    if (this.state['movie:busy'])
      return (<Spinner />);

    if (!this.state['movie:result'].size)
      return (<div>No result</div>);

    return (
      <div className='Page SearchPage'>
        <div className='ResultList'>
          {this.renderItems()}
        </div>
      </div>
    )
  }
});
