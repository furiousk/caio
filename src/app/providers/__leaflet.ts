import { Injectable, EventEmitter, ElementRef } from  '@angular/core';

import { Api }               from './api';
import { Sessao }            from './sessao';
import { Icon }              from './util';

import 'moment/locale/pt-br';
import * as m from 'moment-timezone';

declare var L:any;
declare var $:any;

@Injectable()
export class Leaflet{

	constructor(
		private api:        Api,
		private session:    Sessao,
		private _icon:      Icon
	){}

	private _configs: any = {

		empresa: '01',
		nome: 'Empresa teste',
		coordenadas: {
			lat:-22.7572231,
			lng:-43.4564171
		}
	};

	private mapLayer: any = {

		//mapbox:'https://{s}.tiles.mapbox.com/v4/github.map-xgq2svrz/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaXRzc2VydmljZSIsImEiOiJjam03cHUxbm8wNjFwM3ZtbTVheDV3dGR3In0.1YkSJy8AOgT_XXdtEsMSrQ',
		opensm:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		google:'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
	};

	private color: Array<any> = [

		"#fe2508",
		"#11ff40",
		"#0e72f6",
		"#991c06",
		"#f49152",
		"#00730a",
		"#5a0b99",
		"#efff3c",
		"#3313a6"
	];

	private mapLink:string = '<a href="http://iconup.com.br">IconupTeam</a>';
	private osm:string = '&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors';
	private _map: any;
	private playback: any = null;
	private playOptn: any = {

		sliderControl: false,
		playControl: false,
		dateControl: false,
		popups: true,
		//orientIcons: true,
		tracksLayer: false,
		maxInterpolationTime: 1*60*1000,
		layer: {
			pointToLayer: ( featureData, latlng ) => {

				let _self  = this;
				let result = {
					radius: 5,
					color: '#1a0582'
				};

				if( featureData && featureData.properties && featureData.properties.path_options ){
					result = featureData.properties.path_options;
				}

				if( featureData && featureData.properties && featureData.properties.isavl ){

					let key      = _self.arrayContainsArray( featureData.geometry.coordinates, [ latlng.lng, latlng.lat ] );
					result.color = ( featureData.properties.isavl[ key ] ) ? '#1a0582' : '#c82110';
				}
				let marker = new L.CircleMarker( latlng, result );

				marker.on('click', function( ev ){

					_self.setClickPoint( latlng, featureData, this );
				});
				return marker;
			}
		},
		marker: (featureData) => {

			if( !featureData.bbox ){

				let Icon = this._icon.getIconWithParams({

					speed:       0,
					heading:     '0',
					color_seta:  '#2cd41e',
					color_inter: '#0c0770',
					key:         { key:'onibus',text:'' },
					url:         "#fff",
					follow:      false
				});

				let _mico = new Icon({ labelText: '' });

				return {
					icon: _mico,
					//message: html,
					getPopup:( featureData ) => {
						return '';
					}
				};

			}else{

				let Icon = this._icon.getIconWithParams({

					speed:       0,
					heading:     '0',
					color_seta:  '#2cd41e',
					color_inter: '#0c0770',
					key:         { key:'onibus',text:featureData.bbox.prefixo },
					url:         "#fff",
					follow:      false
				});

				let _mico = new Icon({ labelText: featureData.bbox.prefixo });
				let html  = '';

				if( !featureData.cbox ){

					html = `${ featureData.bbox.prefixo||"" }`;

				}else{

					html = `
						<div center class="ballon-vehicle">

							<div class="ballon-header">-=${ featureData.bbox.prefixo||"" }=-</div>

							<div class="row show-grid">
								<div class="col-3">
									MOTORISTA:
								</div>
								<div class="col-9">
									${ featureData.cbox.nome_motorista||'-- --' }
								</div>
							</div>

							<div class="row show-grid">
								<div class="col-3">
									PEGADA:
								</div>
								<div class="col-9">
									${ featureData.cbox.pegada_motorista||'-- --' }
								</div>
							</div>

							<div class="row show-grid">
								<div class="col-3">
									LARGADA:
								</div>
								<div class="col-9">
									${ featureData.cbox.largada_motorista||'-- --' }
								</div>
							</div>

							<div class="row show-grid">
								<div class="col-3">
									TURNO / SITU:
								</div>
								<div class="col-9">
									${ featureData.cbox.turno||'-- --' } / Alocado
								</div>
							</div>

							<div class="row show-grid">
								<div class="col-3">
									LINHA:
								</div>
								<div class="col-9">
									${ featureData.dbox.descricao||'-- --' }
								</div>
							</div>

							<div class="row show-grid">
								<div class="col-3">
									GUIA:
								</div>
								<div class="col-9">
									${ featureData.cbox.numero_guia||'-- --' }
								</div>
							</div>
						</div>`;
				}
				return {
					icon: _mico,
					//message: html,
					getPopup:( featureData ) => {
						return html;
					}
				};
			}
		}
	};

	public setClickPoint( latlng, feature, ev ){

		return this.api.reverse({ lat:latlng.lat, lng:latlng.lng }).subscribe( _res => {

			let key    = this.arrayContainsArray( feature.geometry.coordinates, [ latlng.lng, latlng.lat ] );
			let _isAvl = ( !feature.properties.isavl ) ? null : feature.properties.isavl[ key ];
			let _Avl   = ( _isAvl==null ) ? '' : (( !_isAvl ) ? 'falso' : 'verdadeiro');
			let date   = new Date( feature.properties.time[ key ] );
			let _date  = m( date ).tz( 'America/Sao_Paulo' ).format( 'DD/MM/YYYY HH:mm:ss' );
			let _id    = feature.properties.pid[ key ];
			let html   = `
				<div center class="ballon-vehicle">

					<div class="ballon-header">-=${ feature.bbox.prefixo||"" }=-</div>

					<div class="row show-grid">
					  <div class="col-2">
						VELOCIDADE:
					  </div>
					  <div class="col-9">
						${ feature.properties.speed[ key ] }km/h
					  </div>
					</div>

					<div class="row show-grid">
					  <div class="col-2">
						ENDEREÇO:
					  </div>
					  <div class="col-9 truncate">
						${ _res||'' }
					  </div>
					</div>

					<div class="row show-grid">

					  <div class="col-2">
						DATA/HORA:
					  </div>
					  <div class="col-9">
						${ _date||'' }
					  </div>

					</div>

					<div class="row show-grid">

					  <div class="col-2">
						AVL:
					  </div>
					  <div class="col-9">
						${ _Avl||'' }
					  </div>

					</div>

					<div class="row show-grid">

					  <div class="col-2">
						HASH:
					  </div>
					  <div class="col-9">
						${ _id||'' }
					  </div>

					</div>

				</div>`;

			ev.bindPopup( html ).openPopup();
		});
	}

	public loadMap():any{

		return this._map;
	}

	public setMap():void{

		L.Map = L.Map.extend({
		  openPopup: function (popup, latlng, options){
			  if (!(popup instanceof L.Popup)) {
				  let content = popup;
				  popup = new L.Popup(options).setContent(content);
			  }
			  if (latlng) {
				  popup.setLatLng(latlng);
			  }
			  if (this.hasLayer(popup)) {
				  return this;
			  }
			  this._popup = popup;
			  return this.addLayer(popup);
		  }
		});

		L.Map.include({
			'clearLayers': function(){
				this.eachLayer(function(layer){
					this.removeLayer(layer);
				}, this);
			}
		});

		this._map = new L.Map('map', {

			center: new L.LatLng( this._configs.coordenadas.lat, this._configs.coordenadas.lng ),
			zoom: 18,
			closePopupOnClick: false,
			zoomControl: false

		});

		L.control.zoom({

			position: 'bottomright',
			zoomInText: '+',
			zoomInTitle: 'aumentar zoom',
			zoomOutText: '-',
			zoomOutTitle: 'diminuir zoom'

		}).addTo( this._map );

		L.tileLayer( this.mapLayer.opensm, {

			attribution: 'by &copy; ' + this.mapLink,
			maxZoom: 18

		}).addTo( this._map );
	}

	public setCtrlPlay(){

		L.Playback = L.Playback || {};
		L.Playback.Control = L.Control.extend({

			_html: `
			<footer class="lp">
				<div class="d-flex justify-content-center">
					<div class="p-2">
						<a id="play-pause"><i id="play-pause-icon" class="fa fa-play fa-lg"></i></a>
					</div>
					<div class="p-2">
						<input id="time-slider" type="range" class="custom-range" min="null" max="null" step="null" >
				  	</div>
				  	<div class="p-2">
						<div id="clock-btn" class="clock">
							<i id="cursor-time"></i>
							<i id="cursor-date"></i>
						</div>
					</div>
					<div class="p-2">
						<input id="ckc-roteiro" type="checkbox">
						<span>Ver roteiro</span>
					</div>
				  	<div class="p-2">
					  	<a id="speed-btn" onclick="$('.menususp').toggle()">
							<i class="fa fa-dashboard fa-lg"></i> <p><span id="speed-icon-val" class="speed">1</span>x<p>
					  	</a>
					<div class="menususp">
						<input id="speed-input" class="span1 speed" type="text" value="1" disabled/>
						<input id="speed-slider" type="range" orient="vertical" min="1" max="9" step="1"/>
					</div>
				  </div>
				</div>
			</footer>
			`,

		  initialize: function(playback) {

			  this.playback = playback;
			  playback.addCallback(this._clockCallback);
		  },

		  onAdd: function(map) {

			  var html = this._html;
			  $('#map').after(html);
			  this._setup();
			  return L.DomUtil.create('div');
		  },

		  _setup: function() {

			  var self = this;
			  var playback = this.playback;

			  $('#play-pause').click(function() {
				  if (playback.isPlaying() === false) {
					  playback.start();
					  $('#play-pause-icon').removeClass('fa-play');
					  $('#play-pause-icon').addClass('fa-pause');
				  } else {
					  playback.stop();
					  $('#play-pause-icon').removeClass('fa-pause');
					  $('#play-pause-icon').addClass('fa-play');
				  }
			  });

			  var startTime = playback.getStartTime();
			  var endTime = playback.getEndTime();
			  var step = playback.getTickLen();

			  $('#cursor-date').html(L.Playback.Util.DateStr(startTime));
			  $('#cursor-time').html(L.Playback.Util.TimeStr(startTime));
			  $("#time-slider").attr({
				  min: startTime,
				  max: endTime,
				  step: step
			  });

			  $("#time-slider").change(function(){
				  var newv=$(this).val();
				  playback.setCursor(newv);
				  $('#cursor-time').val(newv.toString());
				  $('#cursor-time-txt').html(new Date(newv).toString());
			  });

			  $('#speed-slider').attr({
				  min: 1,
			      max: 11,
				  step: 1,
				  value: self._speedToSliderVal(this.playback.getSpeed())
			  });

			  $('#speed-slider').change(function(){

				  var newv  = $( this ).val();
				  var speed = self._sliderValToSpeed( newv );
				  var descr = self._speedToSliderVal( newv );

				  playback.setSpeed( speed );

				  $('.speed').html(descr).val(descr);
			  });

			  $('#speed-input').on('keyup', function(e) {
				  var speed = parseFloat($('#speed-input').val());
				  if (!speed) return;
				  playback.setSpeed( speed );
				  $('#speed-slider').val(this.speedToSliderVal(speed));
				  $('#speed-icon-val').html(speed);
				  if (e.keyCode === 13) {
					  $('.speed-menu').dropdown('toggle');
				  }
			  });

			  $('.dropdown-menu').on('click', function(e) {
				  e.stopPropagation();
			  });
		  },

		  _clockCallback: function(ms) {

			  $('#cursor-date').html(L.Playback.Util.DateStr(ms));
			  $('#cursor-time').html(L.Playback.Util.TimeStr(ms));
			  $('#time-slider').val(ms);
		  },

		  _speedToSliderVal: function(speed) {
			  if( parseInt( speed ) == 11 )return 'Hyp';
			  return parseInt( speed );
		  },

		  _sliderValToSpeed: function(val) {
		  	  if( val == 11 )return -9;
		      return parseInt( val );
		  },

		  _combineDateAndTime: function(date, time) {
			  var yr = date.getFullYear();
			  var mo = date.getMonth();
			  var dy = date.getDate();
			  // the calendar uses hour and the timepicker uses hours...
			  var hr = time.hours || time.hour;
			  if (time.meridian === 'PM' && hr !== 12) hr += 12;
			  var min = time.minutes || time.minute;
			  var sec = time.seconds || time.second;
			  return new Date(yr, mo, dy, hr, min, sec).getTime();
			}
		});

		this.playback = new L.Playback( this._map, null, null, this.playOptn );

		var control = new L.Playback.Control(this.playback);

		control.addTo(this._map);

		return this.playback;
	}

	public setPlayback( geoJsonTrack ){

		let array = [];
		let type  = ( Object.keys( geoJsonTrack ).length > 1 ) ? "LineString" : "MultiPoint";

		Object.keys( geoJsonTrack ).forEach( i => {
			let int = Math.floor( Math.random() * 8 );
			geoJsonTrack[ i ].geometry.type = type;
			geoJsonTrack[ i ].color = this.color[ int ];
			array.push( geoJsonTrack[ i ] );
		});

		var layer_options = {};

		layer_options['pointToLayer'] = function (featureData, latlng) {
			return new L.CircleMarker(latlng, { radius : 5 });
		};

		this.playback['layer'] = new L.GeoJSON( array, layer_options );
		this.playback.setData( array );
		this.playback.setSpeed( 1 );

		var _self = this;

		$("#time-slider").attr({
			min: this.playback.getStartTime(),
			max: this.playback.getEndTime(),
			step: this.playback.getTickLen()
		});

		$('#ckc-roteiro').change(function(){
			var $input = $(this);
			var newv=$input.prop( "checked" );
			if(newv){

				_self.playback.layer.eachLayer( function( layer ){
					_self._map.addLayer( layer );
				});

			}else{

				_self.playback.layer.eachLayer( function( layer ){
					_self._map.removeLayer( layer );
				});
			}
		});

		return this.playback;
	}

	public setControls():void {

		let editableLayers = this.setOptionsMap();

		let options = {
			position: 'topright',
			draw: {
				polyline:     true,
				polygon:      false,
				circle:       true,
				rectangle:    false,
				marker:       false,
				circlemarker: false
			},
			edit: {
				featureGroup: editableLayers,
				remove: true
			}
		};

		let drawControl = new L.Control.Draw( options );

		drawControl.addTo( this._map );

		return editableLayers;
	}

	public setOptionsMap(){

		let drawnItems = L.featureGroup().addTo( this._map );

		//let mapbox = L.tileLayer( this.mapLayer.mapbox, {attribution: 'Mapbox'}).addTo( this._map );
		let osm = L.tileLayer( this.mapLayer.opensm, { attribution: this.osm }).addTo( this._map );

		let roadMutant = L.gridLayer.googleMutant({

			maxZoom: 18,
			type:'roadmap',
			attribution: 'Google'

		});

		let hybridMutant = L.gridLayer.googleMutant({

			maxZoom: 18,
			type:'hybrid',
			attribution: 'Google - Satélite'
		});

		let trafficMutant = L.gridLayer.googleMutant({

			maxZoom: 18,
			type:'roadmap',
			attribution: 'Google - Tráfego'
		});

		trafficMutant.addGoogleLayer('TrafficLayer');

		L.control.layers({

			OSM: osm,
			Google: roadMutant,
			Satélite: hybridMutant,
			Tráfego: trafficMutant

		}, {}, {

			collapsed: true

		}).addTo( this._map );

		return drawnItems;
	}

	public arrayContainsArray( superset, subset ){

		let searchJson = JSON.stringify( subset );
		let arrJson    = superset.map( JSON.stringify );

		return arrJson.indexOf( searchJson );
	}
}
