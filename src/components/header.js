var React                 = require('react/addons');
var Router                = require('react-router');
var Link                  = Router.Link;
var PureRenderMixin       = React.addons.PureRenderMixin;
var icons                 = require('assets/icons.svg');

var icons                 = {
  search                  : '<svg class="icon-search"><use xlink:href="'+icons+'#icon-search"></use></svg>',
  back                    : '<svg class="icon-back"><use xlink:href="'+icons+'#icon-back"></use></svg>'
}

require('styles/header');

module.exports = React.createClass({
  mixins: [Router.Navigation, PureRenderMixin],

  render: function(){
    return (
      <header className='Header'>
        <a className='Header-icon' onClick={this.goBack}  dangerouslySetInnerHTML={{__html: icons['back']}} />
        <Link className='Header-icon' to='home' dangerouslySetInnerHTML={{__html: icons['search']}} />
      </header>
    )
  }
})
