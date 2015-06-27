var React                 = require('react/addons');
var PureRenderMixin       = React.addons.PureRenderMixin;
var Router                = require('react-router');
var MovieStore            = require('stores/movie');
var Dispatcher            = require('root/dispatcher');
var Ore                   = require('orejs');
var Spinner               = require('components/spinner');

require('styles/movie');

module.exports = React.createClass({
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
        <div key={i}>
          <span className='MoviePage-meta-title' style={{color: color}}>
            {topic}:
          </span>
          {data.get(topic)}
        </div>
      );
    })
  },

  renderVideo: function(){
    var width   = (window.innerWidth / 100) * 60;
    var height  = width / 1.77777;
    var data    = this.state['movie:result'].get(this.props.params.imdbID);

    if (!data.get('Video')) return (<span />);

    return (
      <iframe
        width={width}
        height={height}
        src={'https://www.youtube.com/embed/'+data.get('Video')+'?rel=0&amp;controls=1&amp;showinfo=0'}
        frameBorder="0" allowFullScreen></iframe>
    )
  },

  componentWillMount: function(){
    document.title = this.state['movie:result'].get(this.props.params.imdbID).get('Title');
  },

  render: function(){
    if (this.state['movie:busy'])
      return (<Spinner />);

    if (!this.state['movie:result'].size)
      return (<div>No result</div>);

    var data = this.state['movie:result'].get(this.props.params.imdbID);
    var blurryStyle = {
      backgroundImage : 'url(http://crossorigin.me/' + data.get('Poster')+')',
      backgroundColor : data.get('Color')
    }

    return (
      <div className='Page MoviePage'>
        <div className='MoviePage-poster-wrapper'>
          <figure className='MoviePage-poster is-blurry' style={blurryStyle} />
          <img ref='posterImg' className='MoviePage-poster' src={'http://crossorigin.me/' + data.get('Poster')} />
        </div>
        <article className='MoviePage-content'>
          <h2 className='MoviePage-title' style={{color: data.get('Color')}}>
            {data.get('Title')}
          </h2>
          <header className='MoviePage-meta'>
            {this.renderMeta()}
          </header>
          <p className='MoviePage-plot'>
            {data.get('Plot')}
          </p>
          <figure ref='video' className='MoviePage-video'>
            {this.renderVideo()}
          </figure>
        </article>
      </div>
    )
  }
});
