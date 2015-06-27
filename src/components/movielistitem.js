var React                 = require('react/addons');
var Dispatcher            = require('root/dispatcher');
var PureRenderMixin       = React.addons.PureRenderMixin;
var Router                = require('react-router');

module.exports = React.createClass({
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
      <div className='MovieListItem' onClick={this.showDetails} style={this.props.style}>
        <figure className='MovieListItem-poster' style={{backgroundColor: data.get('Color')}}>
          <figure className='MovieListItem-poster-inner' ref='Image' style={{
            backgroundImage: 'url(http://crossorigin.me/' + data.get('Poster')+')'
          }} />
        </figure>
        <div className='MovieListItem-info'>
          <h4>{data.get('Title')}</h4>
          <h6>{data.get('Genre') || ''}</h6>
          <h6>{data.get('Runtime') || ''}</h6>
        </div>
      </div>
    )
  }
});
