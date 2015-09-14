"use strict"

var Map = React.createClass({displayName: "Map",

  getInitialState: function() {
    return {
      radius: 1200,
      zoom: 14,
      loaded: true
    };
  },

  getDefaultProps: function(){
    return {
      // Central SF lat and lng
      lat: 37.7833,
      lng: -122.4167,
      trucks: {}
    }
  },

  handleRadiusClick: function(event) {
    this.setState({
      radius: React.findDOMNode(this.refs.radiusValue).value
    }, function(){
      this.centerCircle.setRadius(this.state.radius);
      this.loadData();
    })
  },

  createMap: function () {
      L.Icon.Default.imagePath = 'images';
      var map = L.map('map');
      L.tileLayer(app.MAPBOX_TILE_STR, {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
          maxZoom: this.state.radius,
          id: app.MAPBOX_ACCESS_ID,
          accessToken: app.MAPBOX_ACCESS_TOKEN
      }).addTo(map);
      return map;
  },

  setupMap: function () {
    this.map.setView([this.props.lat, this.props.lng], this.state.zoom);
    this.setCircle();
    this.loadData();
  },

  loadData: function() {
    this.setState({loaded:false});
    var params = '?$where=within_circle(location,%20'+ this.props.lat +',%20'+ this.props.lng +',%20'+ this.state.radius +')';
    var that = this;
    $.get(app.SFGOV_API_URL+params, function(res) {
      for (var i=0; i < res.length; i++) {

        if (!(res[i].objectid in that.props.trucks) && typeof(res[i].location) !== 'undefined'){
            that.props.trucks[res[i].objectid] = res[i];
            var marker = L.marker([res[i].location.latitude, res[i].location.longitude]);
            marker.bindPopup(React.renderToStaticMarkup(
              <div>
                <h5>{res[i].applicant} <small>{res[i].dayshours}</small></h5>
                {res[i].fooditems}<br/>
                <ul>
                  <li><b>Type:</b> {res[i].facilitytype}</li>
                  <li><b>Address:</b> {res[i].fooditems}</li>
                  <li><b>Location Description:</b> {res[i].locationdescription}</li>
                </ul>
                <a href={res[i].schedule}>Download Schedule</a>
              </div>
            ));
            marker.addTo(that.map);
        }
      }
    }.bind(this))
    .fail(function() {
      alert( "SFGOV data source seems to be down, please try again later." );
    })
    .always(function(){
      that.setState({
        loaded:true
      });
    });
  },

  setCircle: function() {
    this.centerCircle = L.circle(
      [this.props.lat, this.props.lng], this.state.radius,
      { color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
      }
    );
    this.centerCircle.addTo(this.map);

    var that = this;
    this.map.on('click', function(e){
      that.props.lat = e.latlng.lat;
      that.props.lng = e.latlng.lng;
      that.loadData();
      that.centerCircle.setLatLng(new L.LatLng(that.props.lat, that.props.lng));
    });

  },

  componentDidMount: function () {
    this.map = this.createMap();
    this.setupMap();
  },

  render: function () {
      return (
        <main>
          <Loader loaded={this.state.loaded} speed={1.8} radius={7} width={3} length={6} color="#333"></Loader>
          <div id="map"></div>
            <div className="infobox-wrapper">
              <div id="infoBox">
                <h4>Food Trucks of San Francisco</h4>
                <p>Click around the map to change your line of sight and discover food trucks around the city of San Francisco!</p>
                 <input type="number" min="1" step="1" ref="radiusValue" defaultValue={this.state.radius} />
                 <button type="button" onClick={this.handleRadiusClick}>Change Radius</button>
                 <div><a href={ app.GITHUB_URL } target="_blank">Source code on Github</a></div>
              </div>
            </div>
          </main>
        );
    }
});
