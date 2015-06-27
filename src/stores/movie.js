var Ore                   = require('orejs');
var Dispatcher            = require('root/dispatcher');
var Immutable             = require('immutable');
var request               = require('superagent');
var Gradify               = require('root/utils/gradify');
var Promise               = require('bluebird');

var omdbUrl       = 'http://www.omdbapi.com/?';
var gUrl          = 'https://ajax.googleapis.com/ajax/services/search/video?'
var onGoingSearch = null;

module.exports = window.asd = Ore.createStore({
  initialState: {
    'movie:result'            : Immutable.OrderedMap(),
    'movie:busy'              : false,
    'movie:searchTerm'        : null,
    'movie:cache'             : Immutable.OrderedMap(),
    'movie:autocomplete'      : Immutable.OrderedMap(),
    'movie:autocompleteCache' : Immutable.OrderedMap(),
  },

  interestedIn: {
    'search:submit'       : 'search',
    'search:autocomplete' : 'getCompletion',
    'search:clearAutocomplete': 'clearAutocomplete'
  },

  cache: false, //Disable orejs's cache

  methods: {
    init: function(){
      window.JSONP = {};
    },

    clearAutocomplete: function(){
      this.setState({
        'movie:autocomplete' : Immutable.OrderedMap()
       })
    },

    getCompletion: function(action){
      var searchTerm = action.get('payload').searchTerm;
      if (!searchTerm || searchTerm.length <= 2) {
        return this.setState({
          'movie:autocomplete': Immutable.OrderedMap()
        })
      };

      if (this.state.getIn(['movie:autocompleteCache', searchTerm])){
        return this.setState({
          'movie:autocomplete': this.state.getIn(['movie:autocompleteCache', searchTerm])
        });
      }

      this.searchTitle(searchTerm)
      .then(function(items){
        var autocomplete = this.state.get('movie:autocomplete').clear();
        items.forEach(function(item){
          autocomplete = autocomplete.set(item['imdbID'], Immutable.Map(item));
        });

        this.setState({
          'movie:autocomplete' : autocomplete,
          'movie:autocompleteCache' : this.state.get('movie:autocompleteCache').set(searchTerm, autocomplete)
        });

        return items;
      }.bind(this))
      .then(this.searchDetails)
      .then(function(items){
        var result = this.state.get('movie:result').clear();

        items.forEach(function(item){
          result = result.set(item['imdbID'], Immutable.Map(item));
        });

        this.setState({
          'movie:cache' : this.state.get('movie:cache').set(searchTerm, result)
        })
      }.bind(this));
    },

    searchImdbID: function(item){
      return new Promise(function(resolve, reject){
        request.get(omdbUrl+'i='+item['imdbID']+'&tomatoes=true&plot=full')
        .end(function(err, res){
          resolve(JSON.parse(res.text));
        });
      }.bind(this));
    },

    searchVideo: function(item){
      var promise = new Promise(function(resolve, reject){
        var script    = document.createElement('script');
        script.src    = gUrl + 'v=1.0&rsz=1&q='+item['Title']+'&callback=JSONP.'+item['imdbID'];
        script.onload = script.remove.bind(script);

        window.JSONP[item['imdbID']] = function(googleResult){
          item['Video'] = googleResult.responseData.results[0].url.split('=')[1];
        }.bind(this);

        resolve(item);

        document.body.appendChild(script);
      }.bind(this));

      return promise;
    },

    calculateColor: function(item){
      return new Promise(function(resolve, reject){
        if (item['Poster'] == 'N/A'){
          var colors = [
            'rgb(241, 196, 15)',
            'rgb(46, 204, 113)',
            'rgb(52, 152, 219)',
            'rgb(155, 89, 182)',
            'rgb(231, 76, 60)',
            'rgb(52, 73, 94)'
          ];

          item['Color'] = colors[Math.floor(Math.random() * colors.length)];
          return resolve(item);
        }

        var imgObj = new Image();

        imgObj.onload = function(){
          var color = new Gradify(imgObj);
          var colorString= 'rgb('+color[0]+','+color[1]+','+color[2]+')';
          item['Color'] = colorString;

          resolve(item);
        }.bind(this);

        imgObj.crossOrigin = "Anonymous";
        imgObj.src = 'http://crossorigin.me/' + item['Poster'];
      })
    },

    searchTitle: function(searchTerm){
      if (onGoingSearch) onGoingSearch.xhr.abort();

      return new Promise(function(resolve, reject){
        onGoingSearch = request.get(omdbUrl+'s='+searchTerm+'&type=movie&r=json')
        .end(function(err, res){
          onGoingSearch = null;
          if (err) return err;
          var items = JSON.parse(res.text)['Search'] || [];
          resolve(items);
        });

      }.bind(this));
    },

    searchDetails: function(items){
      return new Promise(function(resolve, reject){
        var count = 0;
        var result = [];

        if (items.length === 0) return resolve([]);

        items.forEach(function(item, index){
          this.searchImdbID(item)
          .then(this.searchVideo)
          .then(this.calculateColor)
          .then(function(resultItem){
            result.push(resultItem);
            count++;
            if (count === items.length) resolve(result);
          })
        }.bind(this));

      }.bind(this));
    },

    search: function(action){
      var searchTerm = action.get('payload').searchTerm;
      var searchType = action.get('payload').searchType || 's';

      if (this.state.getIn(['movie:cache', searchTerm])){
        return this.setState({
          'movie:result': this.state.getIn(['movie:cache', searchTerm])
        });
      }

      this.setState({
        'movie:busy' : true,
        'movie:searchTerm' : searchTerm
      });

      (function(thisObj){
        if (searchType === 'i')
          return new Promise(function(resolve, reject){
            resolve([{imdbID : searchTerm}]);
          });
        //else
        return thisObj.searchTitle(searchTerm);
      })(this)
      .then(this.searchDetails)
      .then(function(items){
        var result = this.state.get('movie:result').clear();

        items.forEach(function(item){
          result = result.set(item['imdbID'], Immutable.Map(item));
        });

        this.setState({
          'movie:busy' : false,
          'movie:result' : result,
          'movie:cache' : this.state.get('movie:cache').set(searchTerm, result)
        })
      }.bind(this))
    }
  }

}, Dispatcher);
