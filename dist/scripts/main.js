"use strict";var Map=React.createClass({displayName:"Map",getInitialState:function(){return{radius:1200,zoom:14,loaded:!0}},getDefaultProps:function(){return{lat:37.7833,lng:-122.4167,trucks:{}}},handleRadiusClick:function(e){this.setState({radius:React.findDOMNode(this.refs.radiusValue).value},function(){this.centerCircle.setRadius(this.state.radius),this.loadData()})},createMap:function(){L.Icon.Default.imagePath="images";var e=L.map("map");return L.tileLayer(app.MAPBOX_TILE_STR,{attribution:'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',maxZoom:this.state.radius,id:app.MAPBOX_ACCESS_ID,accessToken:app.MAPBOX_ACCESS_TOKEN}).addTo(e),e},setupMap:function(){this.map.setView([this.props.lat,this.props.lng],this.state.zoom),this.setCircle(),this.loadData()},loadData:function(){this.setState({loaded:!1});var e="?$where=within_circle(location,%20"+this.props.lat+",%20"+this.props.lng+",%20"+this.state.radius+")",t=this;$.get(app.SFGOV_API_URL+e,function(e){for(var a=0;a<e.length;a++)if(!(e[a].objectid in t.props.trucks)&&"undefined"!=typeof e[a].location){t.props.trucks[e[a].objectid]=e[a];var n=L.marker([e[a].location.latitude,e[a].location.longitude]);n.bindPopup(React.renderToStaticMarkup(React.createElement("div",null,React.createElement("h5",null,e[a].applicant," ",React.createElement("small",null,e[a].dayshours)),e[a].fooditems,React.createElement("br",null),React.createElement("ul",null,React.createElement("li",null,React.createElement("b",null,"Type:")," ",e[a].facilitytype),React.createElement("li",null,React.createElement("b",null,"Address:")," ",e[a].fooditems),React.createElement("li",null,React.createElement("b",null,"Location Description:")," ",e[a].locationdescription)),React.createElement("a",{href:e[a].schedule},"Download Schedule")))),n.addTo(t.map)}}.bind(this)).fail(function(){alert("SFGOV data source seems to be down, please try again later.")}).always(function(){t.setState({loaded:!0})})},setCircle:function(){this.centerCircle=L.circle([this.props.lat,this.props.lng],this.state.radius,{color:"red",fillColor:"#f03",fillOpacity:.5}),this.centerCircle.addTo(this.map);var e=this;this.map.on("click",function(t){e.props.lat=t.latlng.lat,e.props.lng=t.latlng.lng,e.loadData(),e.centerCircle.setLatLng(new L.LatLng(e.props.lat,e.props.lng))})},componentDidMount:function(){this.map=this.createMap(),this.setupMap()},render:function(){return React.createElement("main",null,React.createElement(Loader,{loaded:this.state.loaded,speed:1.8,radius:7,width:3,length:6,color:"#333"}),React.createElement("div",{id:"map"}),React.createElement("div",{className:"infobox-wrapper"},React.createElement("div",{id:"infoBox"},React.createElement("h4",null,"Food Trucks of San Francisco"),React.createElement("p",null,"Click around the map to change your line of sight and discover food trucks around the city of San Francisco!"),React.createElement("input",{type:"number",min:"1",step:"1",ref:"radiusValue",defaultValue:this.state.radius}),React.createElement("button",{type:"button",onClick:this.handleRadiusClick},"Change Radius"),React.createElement("div",null,React.createElement("a",{href:app.GITHUB_URL,target:"_blank"},"Source code on Github")))))}});