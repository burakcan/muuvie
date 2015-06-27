var React             = require('react/addons');
require('styles/spinner');

module.exports = React.createClass({
  render : function(){
    return (
      <div className="Spinner">
        <div className="Spinner-bounce1"></div>
        <div className="Spinner-bounce2"></div>
        <div className="Spinner-bounce3"></div>
      </div>
    )
  }
})
