var React                 = require('react/addons');
var Router                = require('react-router');
var Link                  = Router.Link;
var PureRenderMixin       = React.addons.PureRenderMixin;
var Bird                  = require('assets/bird');
require('styles/noresult');

module.exports = React.createClass({
  mixins: [PureRenderMixin],

  render: function(){
    return (
      <div className='Page NoResultPage'>
        <img className='Bird' src={Bird} />
        <div className='NoResultPage-message'>
          We couldn't find anything :( <br />
          Maybe you can <Link to='home'>search again</Link>.
        </div>
      </div>
    )
  }
})
