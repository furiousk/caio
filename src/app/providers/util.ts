import{ Injectable,Inject } from '@angular/core';
import 'moment/locale/pt-br';
//import * as moment from 'moment';
import * as m from 'moment-timezone';
declare var L:any;

@Injectable()

export class Icon{

    public getIconWithParams( data:any ){

        let $class = ( data.follow ) ? '#8310e8': data.color_seta;

        let $stop  = ( data.speed > 0 ) ? 'visible' : 'hidden';
        let $step  = ( data.speed > 0 ) ? 'hidden' : 'visible';

        let svg_ = {

            'onibus':
            `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <g>
                	<g transform="rotate(${ data.heading }, 75,75)" id="seta">
                		<path visibility="${ $stop }" fill="${ $class }" d="M75.5 109.33c19 0 34-15 34-34 0-10-9-27-9-27l-24-41-25 40s-11 17-11 28c0 19 16 34 35 34z"/>
                        <circle visibility="${ $step }" r="34.39397" cy="75" cx="75" stroke-width="1.14647" fill="${ $class }"/>
                	</g>
                	<circle fill="${ data.url }" cx="75" cy="75" r="30"/>
                	<path id="onibus" fill="${ data.color_inter }" d="M93 63.7c0-3-1-6-2-7-4-4-29-5-32 0-1 1-2 4-2 7-1 1-2 1-2 3v4c0 1 1 2 2 2-1 7 0 14 0 17s2 2 2 2h1v3c0 1 2 2 3 2s3-1 3-2v-3h19v3c0 1 2 2 3 2s3-1 3-2v-3s2 1 2-1c0-3 1-11 0-18 1 0 2-1 2-2v-4c0-2-1-2-2-3zm-28-6h20v3H65v-3zm0 31c-1 0-3-1-3-3 0-1 2-3 3-3 2 0 3 2 3 3 0 2-1 3-3 3zm20 0c-2 0-3-1-3-3 0-1 1-3 3-3 1 0 3 2 3 3 0 2-2 3-3 3zm3-12H61v-15h27v15z"/>
                </g>
            </svg>`,

            'socorro':
            `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <g>
                	<g transform="rotate(${ data.heading } 75,75)" id="seta">
                		<path visibility="${ $stop }" fill="${ data.color_seta }" d="M75.5 109.33c19 0 34-15 34-34 0-10-9-27-9-27l-24-41-25 40s-11 17-11 28c0 19 16 34 35 34z"/>
                        <circle visibility="${ $step }" r="34.39397" cy="75" cx="75" stroke-width="1.14647" fill="${ $class }"/>
                	</g>
                	<circle fill="${ data.url }" cx="75" cy="75" r="30"/>
                	 <path id="socorro" fill="${ data.color_inter }" d="M56.74 87.82c-.07-.02-.23-.04-.36-.05-.12 0-.3-.04-.4-.1-.13-.04-.24-.08-.28-.08-.2 0-.97-.5-1.46-.8-.7-.5-.88-.7-1.43-1.6-.4-.7-.6-1.6-.6-2.7 0-1 .1-1.5.6-2.4.3-.7.4-.7.9-1.2l.7-.7.4-.2c.1-.1.4-.2.7-.4 1.6-.7 3.3-.6 4.9.3.4.2 1.1.8 1.5 1.3.3.3.8 1.5.9 2 .3 1 .1 2.1-.4 3.2-.2.5-.8 1.4-1.2 1.6l-.4.4c-.4.4-1.5.8-2.1.9-.5.1-1.4.1-1.6 0zm1.23-2.66c.34-.1.77-.36 1.2-.72.28-.25.54-.7.65-1.16.1-.4.08-1.05-.05-1.46-.1-.37-.42-.86-.64-1.02l-.34-.27c-.4-.3-1.1-.53-1.6-.52-.3 0-.8.1-.9.2-.1.1-.2.1-.2.1-.2 0-.6.3-.9.6-.2.2-.3.4-.5.7-.3.6-.3.7-.3 1.2s0 .9.2 1.1l.2.3c.1.3.9 1 1.4 1.1.4.2.4.2.8.2.2 0 .5 0 .7-.1v.1zm27.94 2.66c0-.02-.2-.04-.3-.05-.1 0-.3-.04-.5-.1l-.3-.1c-.1 0-1.1-.5-1.4-.75-.5-.4-.6-.53-1-1.05-.5-.7-.9-1.7-1-2.48-.1-.7 0-1.7.1-2l.1-.2c0-.2.6-1.3.7-1.6.5-.6 1-1.1 1.4-1.3 1.7-1 3.3-1.1 4.9-.4.3.1.6.2.7.3l.4.2c.1 0 .5.3.7.6.5.5.6.5.9 1.2.4.8.6 1.4.6 2.3 0 1.1-.2 1.9-.7 2.7l-.3.4c-.3.5-1.3 1.3-2 1.6-.2.1-.4.2-.5.2h-.2c-.1 0-.3.1-.5.1-.4 0-1.3.1-1.5 0h.1zm1.4-2.7c.2-.06.4-.18.6-.26.3-.17.9-.72.9-.8l.2-.33c.2-.48.3-1.03.2-1.47 0-.37-.3-.98-.5-1.23-.2-.24-.6-.63-.8-.72-.1 0-.2-.1-.3-.1-.1 0-.6-.1-.9-.1-.5 0-1.3.3-1.8.7-.8.8-1 2.2-.5 3.2.3.6 1 1.1 1.6 1.3.4.2 1.1.1 1.5 0h.1zm-38.5-6.46c-.8-4.23-.8-4.46-.7-4.9.2-.4.4-.76.5-.9l.3-.26c.1-.06.6-.27 1.1-.46 4-1.55 4.3-1.68 4.4-1.83l2.1-3.7c1.9-3.3 2.1-3.7 2.4-4 .3-.2.9-.5 1.2-.6.4-.1.4-.1 6.6-.1s6.2 0 6.4.1l.2.3.1.2.1 4.6v4.6h3l9.8-3.8c8.7-3.3 9.8-3.8 9.8-3.9 0-.2.2-.7.4-.9.2-.4.5-.6.8-.8.3-.1.3-.1.8-.2.6 0 .6 0 1.2.3.3.2.8.8.9 1.2.1.5.1 1.3-.1 1.6-.1.1-.1.8-.1 5.6V76l.1.2c.3.34.3.4.3.55 0 .1 0 .22-.1.32-.1.15-.1.17-.6.3-.1.04-.3.14-.4.24-.1.1-.2.2-.24.2l-.2.4c-.3.7-.22 1.2.2 1.7.56.6 1.3.8 1.98.4.3-.2.6-.6.7-.9v-.2h.4c.3 0 .3 0 .3.1s-.1.4-.2.7l-.2.4c-.1.3-.6.8-.92 1-.3.2-.45.2-1.04.3-.3.1-.35.1-.74 0-.36-.1-.5-.1-.8-.3-.67-.44-.7-.5-.93-.92-.3-.6-.3-.67-.3-1.26 0-.45 0-.6.1-.9.07-.2.17-.4.23-.5.2-.3.5-1.2.6-1.8.05-.3.06-.9.05-4.9v-5l-1.3 2.68-1.26 2.7v5.06c0 5.1 0 5.1-.1 5.4 0 .2-.14.4-.3.5-.2.2-.3.3-.5.4-.3.1-.34.1-1.3.1h-.86v-.2c0-.1 0-.2-.05-.3l-.1-.5c-.04-.4-.1-.7-.4-1.2-.3-.7-.77-1.4-1.15-1.7l-.3-.3-.4-.3c-.27-.2-1.1-.6-1.3-.6l-.38-.1c-.3-.1-1.1-.2-1.6-.2-.7 0-1.7.28-2.4.58-.8.4-.8.4-1.5 1.1-.4.4-.7.7-.8.9l-.2.4c-.03.04-.1.2-.14.25-.1.1-.1.26-.2.37-.12.3-.4 1.4-.4 1.8v.2h-18v-.3c0-.6-.4-2.1-.6-2.35l-.2-.35c-.1-.2-.3-.5-.74-.9-.5-.5-.7-.7-1.1-.9-.7-.5-1.2-.6-2.1-.8-.58-.1-1.26-.1-1.87 0l-.6.1-.34.1c-.4.1-1.2.54-1.5.8l-.47.4c-.2.2-.45.4-.8.9-.35.54-.5.9-.65 1.3l-.2.64c-.08.1-.1.5-.17.8v.5h-2l-.8-4zm44.7-7.38c.1-.12 2.8-5.82 2.8-5.84 0-.02-14.9 5.8-14.9 5.85h6.1c4.9 0 6.1 0 6.2-.1h.1zm-27.4-4.34v-3.5l-3 .02h-3l-.2.14c-.2.13-.6.5-.6.57l-1.6 3-1.7 3.1-.1.15h10.3v-3.5.02z"/>
                </g>
            </svg>`,

            'passeio':
            `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <g>
                	<g transform="rotate(${ data.heading }, 75,75)" id="seta">
                		<path visibility="${ $stop }" fill="${ data.color_seta }" d="M75.5 109.33c19 0 34-15 34-34 0-10-9-27-9-27l-24-41-25 40s-11 17-11 28c0 19 16 34 35 34z"/>
                        <circle visibility="${ $step }" r="34.39397" cy="75" cx="75" stroke-width="1.14647" fill="${ $class }"/>
                	</g>
                	<circle fill="${ data.url }" cx="75" cy="75" r="30"/>
                	<path id="onibus" fill="${ data.color_inter }" d="M60.38 90.5c-.7-.23-1.3-.76-1.6-1.28-.2-.75-.2-1.13-.2-3v-2.26h-3.25l.4-6.02v-5.98l.36-.67c.7-.9 1.4-1.7 2.6-2.1l.7-.2 1.8-4.5c1.9-5 2.2-5.4 3.7-6l.75-.4h19.6l.77.4c1.3.6 1.5 1 3.5 6l1.7 4.5.74.25c.92.4 1.86 1.13 2.23 2.07l.4.64v11.8h-3.1v2.26c0 2.27 0 2.27-.1 3-1.15 2.27-4.53 1.9-5.28-.36l-.3-2.25v-1.8h-20.5v2.12c-.15 2.28-.2 2.4-.68 3-.37.9-1.95 1.4-3 1.05l-1.28-.08v-.2zm3.52-12.62c1.14-.38 1.8-1.88 1.5-3-.37-1.14-1.2-1.9-2.33-1.9s-2.17.38-2.73 1.5c-.3.76-.3 2.27.3 3.02.8 1.13 2.2 1.5 3.4 1.13v-.8l-.14.05zm26.9 0c.73-.38 1.1-1.13 1.1-2.26-.1-1.13-.6-1.5-1.6-2.26-1.28-.75-2.68 0-3.48 1.13-.64 1.1-.38 2.6.5 3.4 1.12.7 2.63 1.1 3.4.3l-.06-.3.13-.1zm-2.8-9.4c-2.26-6.02-2.26-6.02-2.93-6.4h-9.2c-8.6 0-8.77 0-9.2.38l-.74.75c-.3 1.2-2.6 6.4-2.6 6.8 0 .4 3 .4 12.4.4h12.4l-.1-1.9H88zm-10.34.37c.38-.3.75-1.1 1.5-1.5h3.4c2.24 0 3 0 3.37.4.8.4 1.5 1.2 1.9 1.9v.4h-9.8l-.3-1.1-.06-.1zm3.76-2.6c-.38-.3-.75-.7-.75-1.9 0-.7 0-.7.37-1.1.38 0 .76-.3 1.13-.3 1.13-.34 2.26.4 2.63 1.17.38.75.38 1.88 0 2.25-.75.75-1.88 1.13-2.63.75l-.75-.77v-.1z"/>
                </g>
            </svg>`,

            'manutencao':
            `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <g>
                	<g transform="rotate(${ data.heading }, 75,75)" id="seta">
                		<path visibility="${ $stop }" fill="${ data.color_seta }" d="M75.5 109.33c19 0 34-15 34-34 0-10-9-27-9-27l-24-41-25 40s-11 17-11 28c0 19 16 34 35 34z"/>
                        <circle visibility="${ $step }" r="34.39397" cy="75" cx="75" stroke-width="1.14647" fill="${ $class }"/>
                	</g>
                	<circle fill="${ data.url }" cx="75" cy="75" r="30"/>
                	<g id="manutencao" fill="${ data.color_inter }">
                		  <path id="svg_4" d="m95.141,70.9105c-0.256,-2.264 -6.35,0 -6.35,0l-0.358,3.22c-0.133,-0.077 -0.268,-0.15 -0.41,-0.214l-1.54,-6.715c-0.563,-3.19 -2.976,-5.55 -6.493,-5.43l-9.04,0c-0.06,0.38 -0.148,0.74 -0.25,1.1l9.9,0c2.05,0 3.93,1.32 4.44,3.5l1.653,6.63c-0.105,-0.002 -0.208,-0.012 -0.313,-0.012l-19.16,0l0.006,6.463l11.873,0l0,1.444l-11.88,0l0,0.423l11.76,0l0,1.448l-11.75,0l0.003,5.43l12.677,0l0,3.44c0,1.397 1.73,2.53 3.86,2.53s3.857,-1.132 3.857,-2.53l0,-3.837c1.82,-0.688 3.09,-2.193 3.09,-3.944l0,-6.154c0,-1.36 -0.77,-2.57 -1.958,-3.37l6.38,-0.345s0.25,-0.814 0,-3.075l0.003,-0.002zm-7.313,11.744l-6.966,0l0,-3.312l6.966,0l0,3.312z"/>
                   <path id="svg_5" d="m64.04297,79.30381l0.177,0l0,1.45l-0.18,0l0.003,-1.45zm0.117,-0.415l0.056,0l0,1.445l-0.055,0l-0.001,-1.445z"/>
                   <path id="svg_6" d="m69.581,60.7965c-0.005,-2.778 -1.515,-5.198 -3.764,-6.488l0,5.993l-3.72,2.15l-3.725,-2.15l0,-5.985c-2.24,1.29 -3.75,3.71 -3.76,6.488c0,2.914 1.67,5.438 4.11,6.677l0,24.68c0,0.975 0.395,1.858 1.035,2.5c0.64,0.64 1.52,1.028 2.5,1.03c1.943,0 3.523,-1.576 3.53,-3.53l-0.015,-24.84c2.28,-1.28 3.814,-3.723 3.817,-6.52l-0.008,-0.005zm-6.547,32.925c-0.526,0.53 -1.382,0.53 -1.912,0c-0.522,-0.524 -0.52,-1.376 0.005,-1.904c0.53,-0.526 1.382,-0.526 1.904,-0.004c0.53,0.53 0.53,1.382 0.003,1.91l0,-0.002z"/>
                   </g>
                </g>
            </svg>`,

            'placa':
            `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <g>
                	<g transform="rotate(${ data.heading }, 75,75)" id="seta">
                		<path visibility="${ $stop }" fill="${ data.color_seta }" d="M75.5 109.33c19 0 34-15 34-34 0-10-9-27-9-27l-24-41-25 40s-11 17-11 28c0 19 16 34 35 34z"/>
                        <circle visibility="${ $step }" r="34.39397" cy="75" cx="75" stroke-width="1.14647" fill="${ $class }"/>
                	</g>
                	<circle fill="${ data.url }" cx="75" cy="75" r="30"/>
                  <path fill="${ data.color_inter }" id="atrasado" d="m53.84,78.75c-0.53,-3.5 -0.27,-6.97 0.74,-10.27l0.67,-1.7l0,-0.1l1.5,0.64l1.55,0.63l-0.2,0.45c-2.22,5.8 -1.4,12.3 2.24,17.36c0.37,0.56 1.23,1.5 1.7,2.02c3.5,3.45 8,5.36 12.8,5.44c5.7,0 11.16,-2.63 14.58,-7.24c1.86,-2.43 2.98,-5.25 3.42,-8.24c0.67,-4.2 -0.22,-8.63 -2.45,-12.26c-2.48,-4.05 -6.4,-7 -11,-8.13c-2.26,-0.6 -4.3,-0.75 -6.7,-0.38l-0.17,0l0.74,3.1l0.74,3.24l-5.7,-2.9l-5.66,-2.9l3.82,-5.13l3.85,-5.13l0.76,3.2l0.76,3.28l0.45,0c1.1,-0.2 2.7,-0.25 4.1,-0.2c2.7,0.2 5.5,0.9 7.96,2.1c5,2.5 8.82,6.77 10.7,11.9c0.38,1 0.5,1.5 0.76,2.63c0.3,1.2 0.37,1.63 0.5,2.6c0.54,5.1 -0.76,10.2 -3.6,14.43c-2.6,3.64 -6.1,6.45 -10.2,7.95c-1.06,0.38 -1.5,0.53 -2.6,0.75c-1.1,0.3 -1.7,0.38 -2.8,0.53c-3.4,0.38 -6.96,-0.2 -10.2,-1.5c-1.2,-0.52 -2,-0.93 -3.16,-1.7c-0.93,-0.54 -1.34,-0.84 -2.04,-1.4c-2.96,-2.4 -5.4,-5.63 -6.7,-9.26c-0.35,-1.04 -0.9,-2.84 -1.1,-3.85l-0.06,0.1l0,-0.06z"/>
                  <text x="61" y="85" fill="#000" font-weight="bold" font-size="24" font-family="sans-serif">${ data.key.text }</text>
                </g>
            </svg>`,

            'atrasado':
            `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <g>
                	<g transform="rotate(${ data.heading }, 75,75)" id="seta">
                		<path visibility="${ $stop }" fill="${ data.color_seta }" d="M75.5 109.33c19 0 34-15 34-34 0-10-9-27-9-27l-24-41-25 40s-11 17-11 28c0 19 16 34 35 34z"/>
                        <circle visibility="${ $step }" r="34.39397" cy="75" cx="75" stroke-width="1.14647" fill="${ $class }"/>
                	</g>
                	<circle fill="${ data.url }" cx="75" cy="75" r="30"/>
                  <path fill="${ data.color_inter }" id="atrasado" d="M75.17 45.1c-16.7 0-30.26 13.54-30.26 30.25 0 16.7 13.6 30.26 30.3 30.26 16.7 0 30.3-13.5 30.3-30.2S91.9 45.18 75.2 45.18zm1.9 56.63v-3.7h-3.8v3.7c-13.08-.93-23.55-11.4-24.48-24.5h3.6v-3.77h-3.7c.92-13.1 11.4-23.56 24.5-24.5v3.7H77v-3.7c13.1.94 23.57 11.4 24.5 24.5h-3.7v3.78h3.7c-.93 13.1-11.4 23.56-24.5 24.5zm12-34.43c.26.46.1 1.04-.34 1.3l-10 5.77c.1.32.2.63.2.98 0 2.1-1.7 3.78-3.78 3.78-2.1 0-3.78-1.7-3.78-3.78L61.1 69.43c-.9-.53-1.2-1.68-.7-2.6.53-.9 1.7-1.2 2.6-.68l10.32 5.96c.55-.3 1.15-.5 1.83-.5 1.06 0 2 .5 2.7 1.2l9.93-5.8c.44-.26 1.02-.1 1.3.35z"/>
                  <text font-family="sans-serif" font-size="25" font-weight="bold" fill="${ data.key.color }" y="95.66615" x="61.84375">${ data.key.text }</text>
                </g>
            </svg>`,
            'stop':
            `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <g>
                	<g transform="rotate(00 75,75)" id="circuloverde">
                		  <circle r="34.39397" cy="75" cx="75" stroke-width="1.14647" fill="${ data.color_seta }"/>
                	</g>

                	<circle fill="${ data.url }" cx="75" cy="75" r="30"/>
                	<path id="onibus" fill="${ data.color_inter }" d="M93 63.7c0-3-1-6-2-7-4-4-29-5-32 0-1 1-2 4-2 7-1 1-2 1-2 3v4c0 1 1 2 2 2-1 7 0 14 0 17s2 2 2 2h1v3c0 1 2 2 3 2s3-1 3-2v-3h19v3c0 1 2 2 3 2s3-1 3-2v-3s2 1 2-1c0-3 1-11 0-18 1 0 2-1 2-2v-4c0-2-1-2-2-3zm-28-6h20v3H65v-3zm0 31c-1 0-3-1-3-3 0-1 2-3 3-3 2 0 3 2 3 3 0 2-1 3-3 3zm20 0c-2 0-3-1-3-3 0-1 1-3 3-3 1 0 3 2 3 3 0 2-2 3-3 3zm3-12H61v-15h27v15z"/>
                </g>
            </svg>`

        };

        let iconeSetaSVG = 'data:image/svg+xml;utf-8;base64,' + btoa( svg_[ data.key.key ] );

        let icon = L.Icon.Label.extend({
        	options: {
        		iconUrl: iconeSetaSVG,
        		shadowUrl: null,
                iconSize: [60, 60],
        		iconAnchor: [15, 17],/* H / V */
                labelAnchor: new L.Point(50, 0),
				wrapperAnchor: new L.Point(12, 13),
        		labelClassName: 'sweet-deal-label'
        	}
        });

        return icon;
    }

    public getIconHtmlWithParams( data:any ){

        let $class = ( data.follow ) ? '#8310e8': data.color_seta;

        let $stop  = ( data.speed > 0 ) ? 'visible' : 'hidden';
        let $step  = ( data.speed > 0 ) ? 'hidden' : 'visible';

        let svg_ = {

            'onibus':
            `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <g>
                	<g transform="rotate(${ data.heading }, 75,75)" id="seta">
                		<path visibility="${ $stop }" fill="${ $class }" d="M75.5 109.33c19 0 34-15 34-34 0-10-9-27-9-27l-24-41-25 40s-11 17-11 28c0 19 16 34 35 34z"/>
                        <circle visibility="${ $step }" r="34.39397" cy="75" cx="75" stroke-width="1.14647" fill="${ $class }"/>
                	</g>
                	<circle fill="${ data.url }" cx="75" cy="75" r="30"/>
                	<path id="onibus" fill="${ data.color_inter }" d="M93 63.7c0-3-1-6-2-7-4-4-29-5-32 0-1 1-2 4-2 7-1 1-2 1-2 3v4c0 1 1 2 2 2-1 7 0 14 0 17s2 2 2 2h1v3c0 1 2 2 3 2s3-1 3-2v-3h19v3c0 1 2 2 3 2s3-1 3-2v-3s2 1 2-1c0-3 1-11 0-18 1 0 2-1 2-2v-4c0-2-1-2-2-3zm-28-6h20v3H65v-3zm0 31c-1 0-3-1-3-3 0-1 2-3 3-3 2 0 3 2 3 3 0 2-1 3-3 3zm20 0c-2 0-3-1-3-3 0-1 1-3 3-3 1 0 3 2 3 3 0 2-2 3-3 3zm3-12H61v-15h27v15z"/>
                </g>
            </svg>`,

            'socorro':
            `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <g>
                	<g transform="rotate(${ data.heading } 75,75)" id="seta">
                		<path visibility="${ $stop }" fill="${ data.color_seta }" d="M75.5 109.33c19 0 34-15 34-34 0-10-9-27-9-27l-24-41-25 40s-11 17-11 28c0 19 16 34 35 34z"/>
                        <circle visibility="${ $step }" r="34.39397" cy="75" cx="75" stroke-width="1.14647" fill="${ $class }"/>
                	</g>
                	<circle fill="${ data.url }" cx="75" cy="75" r="30"/>
                	 <path id="socorro" fill="${ data.color_inter }" d="M56.74 87.82c-.07-.02-.23-.04-.36-.05-.12 0-.3-.04-.4-.1-.13-.04-.24-.08-.28-.08-.2 0-.97-.5-1.46-.8-.7-.5-.88-.7-1.43-1.6-.4-.7-.6-1.6-.6-2.7 0-1 .1-1.5.6-2.4.3-.7.4-.7.9-1.2l.7-.7.4-.2c.1-.1.4-.2.7-.4 1.6-.7 3.3-.6 4.9.3.4.2 1.1.8 1.5 1.3.3.3.8 1.5.9 2 .3 1 .1 2.1-.4 3.2-.2.5-.8 1.4-1.2 1.6l-.4.4c-.4.4-1.5.8-2.1.9-.5.1-1.4.1-1.6 0zm1.23-2.66c.34-.1.77-.36 1.2-.72.28-.25.54-.7.65-1.16.1-.4.08-1.05-.05-1.46-.1-.37-.42-.86-.64-1.02l-.34-.27c-.4-.3-1.1-.53-1.6-.52-.3 0-.8.1-.9.2-.1.1-.2.1-.2.1-.2 0-.6.3-.9.6-.2.2-.3.4-.5.7-.3.6-.3.7-.3 1.2s0 .9.2 1.1l.2.3c.1.3.9 1 1.4 1.1.4.2.4.2.8.2.2 0 .5 0 .7-.1v.1zm27.94 2.66c0-.02-.2-.04-.3-.05-.1 0-.3-.04-.5-.1l-.3-.1c-.1 0-1.1-.5-1.4-.75-.5-.4-.6-.53-1-1.05-.5-.7-.9-1.7-1-2.48-.1-.7 0-1.7.1-2l.1-.2c0-.2.6-1.3.7-1.6.5-.6 1-1.1 1.4-1.3 1.7-1 3.3-1.1 4.9-.4.3.1.6.2.7.3l.4.2c.1 0 .5.3.7.6.5.5.6.5.9 1.2.4.8.6 1.4.6 2.3 0 1.1-.2 1.9-.7 2.7l-.3.4c-.3.5-1.3 1.3-2 1.6-.2.1-.4.2-.5.2h-.2c-.1 0-.3.1-.5.1-.4 0-1.3.1-1.5 0h.1zm1.4-2.7c.2-.06.4-.18.6-.26.3-.17.9-.72.9-.8l.2-.33c.2-.48.3-1.03.2-1.47 0-.37-.3-.98-.5-1.23-.2-.24-.6-.63-.8-.72-.1 0-.2-.1-.3-.1-.1 0-.6-.1-.9-.1-.5 0-1.3.3-1.8.7-.8.8-1 2.2-.5 3.2.3.6 1 1.1 1.6 1.3.4.2 1.1.1 1.5 0h.1zm-38.5-6.46c-.8-4.23-.8-4.46-.7-4.9.2-.4.4-.76.5-.9l.3-.26c.1-.06.6-.27 1.1-.46 4-1.55 4.3-1.68 4.4-1.83l2.1-3.7c1.9-3.3 2.1-3.7 2.4-4 .3-.2.9-.5 1.2-.6.4-.1.4-.1 6.6-.1s6.2 0 6.4.1l.2.3.1.2.1 4.6v4.6h3l9.8-3.8c8.7-3.3 9.8-3.8 9.8-3.9 0-.2.2-.7.4-.9.2-.4.5-.6.8-.8.3-.1.3-.1.8-.2.6 0 .6 0 1.2.3.3.2.8.8.9 1.2.1.5.1 1.3-.1 1.6-.1.1-.1.8-.1 5.6V76l.1.2c.3.34.3.4.3.55 0 .1 0 .22-.1.32-.1.15-.1.17-.6.3-.1.04-.3.14-.4.24-.1.1-.2.2-.24.2l-.2.4c-.3.7-.22 1.2.2 1.7.56.6 1.3.8 1.98.4.3-.2.6-.6.7-.9v-.2h.4c.3 0 .3 0 .3.1s-.1.4-.2.7l-.2.4c-.1.3-.6.8-.92 1-.3.2-.45.2-1.04.3-.3.1-.35.1-.74 0-.36-.1-.5-.1-.8-.3-.67-.44-.7-.5-.93-.92-.3-.6-.3-.67-.3-1.26 0-.45 0-.6.1-.9.07-.2.17-.4.23-.5.2-.3.5-1.2.6-1.8.05-.3.06-.9.05-4.9v-5l-1.3 2.68-1.26 2.7v5.06c0 5.1 0 5.1-.1 5.4 0 .2-.14.4-.3.5-.2.2-.3.3-.5.4-.3.1-.34.1-1.3.1h-.86v-.2c0-.1 0-.2-.05-.3l-.1-.5c-.04-.4-.1-.7-.4-1.2-.3-.7-.77-1.4-1.15-1.7l-.3-.3-.4-.3c-.27-.2-1.1-.6-1.3-.6l-.38-.1c-.3-.1-1.1-.2-1.6-.2-.7 0-1.7.28-2.4.58-.8.4-.8.4-1.5 1.1-.4.4-.7.7-.8.9l-.2.4c-.03.04-.1.2-.14.25-.1.1-.1.26-.2.37-.12.3-.4 1.4-.4 1.8v.2h-18v-.3c0-.6-.4-2.1-.6-2.35l-.2-.35c-.1-.2-.3-.5-.74-.9-.5-.5-.7-.7-1.1-.9-.7-.5-1.2-.6-2.1-.8-.58-.1-1.26-.1-1.87 0l-.6.1-.34.1c-.4.1-1.2.54-1.5.8l-.47.4c-.2.2-.45.4-.8.9-.35.54-.5.9-.65 1.3l-.2.64c-.08.1-.1.5-.17.8v.5h-2l-.8-4zm44.7-7.38c.1-.12 2.8-5.82 2.8-5.84 0-.02-14.9 5.8-14.9 5.85h6.1c4.9 0 6.1 0 6.2-.1h.1zm-27.4-4.34v-3.5l-3 .02h-3l-.2.14c-.2.13-.6.5-.6.57l-1.6 3-1.7 3.1-.1.15h10.3v-3.5.02z"/>
                </g>
            </svg>`,

            'passeio':
            `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <g>
                	<g transform="rotate(${ data.heading }, 75,75)" id="seta">
                		<path visibility="${ $stop }" fill="${ data.color_seta }" d="M75.5 109.33c19 0 34-15 34-34 0-10-9-27-9-27l-24-41-25 40s-11 17-11 28c0 19 16 34 35 34z"/>
                        <circle visibility="${ $step }" r="34.39397" cy="75" cx="75" stroke-width="1.14647" fill="${ $class }"/>
                	</g>
                	<circle fill="${ data.url }" cx="75" cy="75" r="30"/>
                	<path id="onibus" fill="${ data.color_inter }" d="M60.38 90.5c-.7-.23-1.3-.76-1.6-1.28-.2-.75-.2-1.13-.2-3v-2.26h-3.25l.4-6.02v-5.98l.36-.67c.7-.9 1.4-1.7 2.6-2.1l.7-.2 1.8-4.5c1.9-5 2.2-5.4 3.7-6l.75-.4h19.6l.77.4c1.3.6 1.5 1 3.5 6l1.7 4.5.74.25c.92.4 1.86 1.13 2.23 2.07l.4.64v11.8h-3.1v2.26c0 2.27 0 2.27-.1 3-1.15 2.27-4.53 1.9-5.28-.36l-.3-2.25v-1.8h-20.5v2.12c-.15 2.28-.2 2.4-.68 3-.37.9-1.95 1.4-3 1.05l-1.28-.08v-.2zm3.52-12.62c1.14-.38 1.8-1.88 1.5-3-.37-1.14-1.2-1.9-2.33-1.9s-2.17.38-2.73 1.5c-.3.76-.3 2.27.3 3.02.8 1.13 2.2 1.5 3.4 1.13v-.8l-.14.05zm26.9 0c.73-.38 1.1-1.13 1.1-2.26-.1-1.13-.6-1.5-1.6-2.26-1.28-.75-2.68 0-3.48 1.13-.64 1.1-.38 2.6.5 3.4 1.12.7 2.63 1.1 3.4.3l-.06-.3.13-.1zm-2.8-9.4c-2.26-6.02-2.26-6.02-2.93-6.4h-9.2c-8.6 0-8.77 0-9.2.38l-.74.75c-.3 1.2-2.6 6.4-2.6 6.8 0 .4 3 .4 12.4.4h12.4l-.1-1.9H88zm-10.34.37c.38-.3.75-1.1 1.5-1.5h3.4c2.24 0 3 0 3.37.4.8.4 1.5 1.2 1.9 1.9v.4h-9.8l-.3-1.1-.06-.1zm3.76-2.6c-.38-.3-.75-.7-.75-1.9 0-.7 0-.7.37-1.1.38 0 .76-.3 1.13-.3 1.13-.34 2.26.4 2.63 1.17.38.75.38 1.88 0 2.25-.75.75-1.88 1.13-2.63.75l-.75-.77v-.1z"/>
                </g>
            </svg>`,

            'manutencao':
            `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <g>
                	<g transform="rotate(${ data.heading }, 75,75)" id="seta">
                		<path visibility="${ $stop }" fill="${ data.color_seta }" d="M75.5 109.33c19 0 34-15 34-34 0-10-9-27-9-27l-24-41-25 40s-11 17-11 28c0 19 16 34 35 34z"/>
                        <circle visibility="${ $step }" r="34.39397" cy="75" cx="75" stroke-width="1.14647" fill="${ $class }"/>
                	</g>
                	<circle fill="${ data.url }" cx="75" cy="75" r="30"/>
                	<g id="manutencao" fill="${ data.color_inter }">
                		  <path id="svg_4" d="m95.141,70.9105c-0.256,-2.264 -6.35,0 -6.35,0l-0.358,3.22c-0.133,-0.077 -0.268,-0.15 -0.41,-0.214l-1.54,-6.715c-0.563,-3.19 -2.976,-5.55 -6.493,-5.43l-9.04,0c-0.06,0.38 -0.148,0.74 -0.25,1.1l9.9,0c2.05,0 3.93,1.32 4.44,3.5l1.653,6.63c-0.105,-0.002 -0.208,-0.012 -0.313,-0.012l-19.16,0l0.006,6.463l11.873,0l0,1.444l-11.88,0l0,0.423l11.76,0l0,1.448l-11.75,0l0.003,5.43l12.677,0l0,3.44c0,1.397 1.73,2.53 3.86,2.53s3.857,-1.132 3.857,-2.53l0,-3.837c1.82,-0.688 3.09,-2.193 3.09,-3.944l0,-6.154c0,-1.36 -0.77,-2.57 -1.958,-3.37l6.38,-0.345s0.25,-0.814 0,-3.075l0.003,-0.002zm-7.313,11.744l-6.966,0l0,-3.312l6.966,0l0,3.312z"/>
                   <path id="svg_5" d="m64.04297,79.30381l0.177,0l0,1.45l-0.18,0l0.003,-1.45zm0.117,-0.415l0.056,0l0,1.445l-0.055,0l-0.001,-1.445z"/>
                   <path id="svg_6" d="m69.581,60.7965c-0.005,-2.778 -1.515,-5.198 -3.764,-6.488l0,5.993l-3.72,2.15l-3.725,-2.15l0,-5.985c-2.24,1.29 -3.75,3.71 -3.76,6.488c0,2.914 1.67,5.438 4.11,6.677l0,24.68c0,0.975 0.395,1.858 1.035,2.5c0.64,0.64 1.52,1.028 2.5,1.03c1.943,0 3.523,-1.576 3.53,-3.53l-0.015,-24.84c2.28,-1.28 3.814,-3.723 3.817,-6.52l-0.008,-0.005zm-6.547,32.925c-0.526,0.53 -1.382,0.53 -1.912,0c-0.522,-0.524 -0.52,-1.376 0.005,-1.904c0.53,-0.526 1.382,-0.526 1.904,-0.004c0.53,0.53 0.53,1.382 0.003,1.91l0,-0.002z"/>
                   </g>
                </g>
            </svg>`,

            'placa':
            `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <g>
                	<g transform="rotate(${ data.heading }, 75,75)" id="seta">
                		<path visibility="${ $stop }" fill="${ data.color_seta }" d="M75.5 109.33c19 0 34-15 34-34 0-10-9-27-9-27l-24-41-25 40s-11 17-11 28c0 19 16 34 35 34z"/>
                        <circle visibility="${ $step }" r="34.39397" cy="75" cx="75" stroke-width="1.14647" fill="${ $class }"/>
                	</g>
                	<circle fill="${ data.url }" cx="75" cy="75" r="30"/>
                  <path fill="${ data.color_inter }" id="atrasado" d="m53.84,78.75c-0.53,-3.5 -0.27,-6.97 0.74,-10.27l0.67,-1.7l0,-0.1l1.5,0.64l1.55,0.63l-0.2,0.45c-2.22,5.8 -1.4,12.3 2.24,17.36c0.37,0.56 1.23,1.5 1.7,2.02c3.5,3.45 8,5.36 12.8,5.44c5.7,0 11.16,-2.63 14.58,-7.24c1.86,-2.43 2.98,-5.25 3.42,-8.24c0.67,-4.2 -0.22,-8.63 -2.45,-12.26c-2.48,-4.05 -6.4,-7 -11,-8.13c-2.26,-0.6 -4.3,-0.75 -6.7,-0.38l-0.17,0l0.74,3.1l0.74,3.24l-5.7,-2.9l-5.66,-2.9l3.82,-5.13l3.85,-5.13l0.76,3.2l0.76,3.28l0.45,0c1.1,-0.2 2.7,-0.25 4.1,-0.2c2.7,0.2 5.5,0.9 7.96,2.1c5,2.5 8.82,6.77 10.7,11.9c0.38,1 0.5,1.5 0.76,2.63c0.3,1.2 0.37,1.63 0.5,2.6c0.54,5.1 -0.76,10.2 -3.6,14.43c-2.6,3.64 -6.1,6.45 -10.2,7.95c-1.06,0.38 -1.5,0.53 -2.6,0.75c-1.1,0.3 -1.7,0.38 -2.8,0.53c-3.4,0.38 -6.96,-0.2 -10.2,-1.5c-1.2,-0.52 -2,-0.93 -3.16,-1.7c-0.93,-0.54 -1.34,-0.84 -2.04,-1.4c-2.96,-2.4 -5.4,-5.63 -6.7,-9.26c-0.35,-1.04 -0.9,-2.84 -1.1,-3.85l-0.06,0.1l0,-0.06z"/>
                  <text x="61" y="85" fill="#000" font-weight="bold" font-size="24" font-family="sans-serif">${ data.key.text }</text>
                </g>
            </svg>`,

            'atrasado':
            `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <g>
                	<g transform="rotate(${ data.heading }, 75,75)" id="seta">
                		<path visibility="${ $stop }" fill="${ data.color_seta }" d="M75.5 109.33c19 0 34-15 34-34 0-10-9-27-9-27l-24-41-25 40s-11 17-11 28c0 19 16 34 35 34z"/>
                        <circle visibility="${ $step }" r="34.39397" cy="75" cx="75" stroke-width="1.14647" fill="${ $class }"/>
                	</g>
                	<circle fill="${ data.url }" cx="75" cy="75" r="30"/>
                  <path fill="${ data.color_inter }" id="atrasado" d="M75.17 45.1c-16.7 0-30.26 13.54-30.26 30.25 0 16.7 13.6 30.26 30.3 30.26 16.7 0 30.3-13.5 30.3-30.2S91.9 45.18 75.2 45.18zm1.9 56.63v-3.7h-3.8v3.7c-13.08-.93-23.55-11.4-24.48-24.5h3.6v-3.77h-3.7c.92-13.1 11.4-23.56 24.5-24.5v3.7H77v-3.7c13.1.94 23.57 11.4 24.5 24.5h-3.7v3.78h3.7c-.93 13.1-11.4 23.56-24.5 24.5zm12-34.43c.26.46.1 1.04-.34 1.3l-10 5.77c.1.32.2.63.2.98 0 2.1-1.7 3.78-3.78 3.78-2.1 0-3.78-1.7-3.78-3.78L61.1 69.43c-.9-.53-1.2-1.68-.7-2.6.53-.9 1.7-1.2 2.6-.68l10.32 5.96c.55-.3 1.15-.5 1.83-.5 1.06 0 2 .5 2.7 1.2l9.93-5.8c.44-.26 1.02-.1 1.3.35z"/>
                  <text font-family="sans-serif" font-size="25" font-weight="bold" fill="${ data.key.color }" y="95.66615" x="61.84375">${ data.key.text }</text>
                </g>
            </svg>`,
            'stop':
            `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <g>
                	<g transform="rotate(00 75,75)" id="circuloverde">
                		  <circle r="34.39397" cy="75" cx="75" stroke-width="1.14647" fill="${ data.color_seta }"/>
                	</g>

                	<circle fill="${ data.url }" cx="75" cy="75" r="30"/>
                	<path id="onibus" fill="${ data.color_inter }" d="M93 63.7c0-3-1-6-2-7-4-4-29-5-32 0-1 1-2 4-2 7-1 1-2 1-2 3v4c0 1 1 2 2 2-1 7 0 14 0 17s2 2 2 2h1v3c0 1 2 2 3 2s3-1 3-2v-3h19v3c0 1 2 2 3 2s3-1 3-2v-3s2 1 2-1c0-3 1-11 0-18 1 0 2-1 2-2v-4c0-2-1-2-2-3zm-28-6h20v3H65v-3zm0 31c-1 0-3-1-3-3 0-1 2-3 3-3 2 0 3 2 3 3 0 2-1 3-3 3zm20 0c-2 0-3-1-3-3 0-1 1-3 3-3 1 0 3 2 3 3 0 2-2 3-3 3zm3-12H61v-15h27v15z"/>
                </g>
            </svg>`

        };

        let iconeSetaSVG = 'data:image/svg+xml;utf-8;base64,' + btoa( svg_[ data.key.key ] );

        return iconeSetaSVG;
    }


    public getIconFixWithParams( color ){

        let svg_ = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
        <title>background</title><rect x="-1" y="-1" width="26" height="26" fill="none"/>
        <title>Layer 1</title><ellipse stroke="#ffffff" ry="6.7" rx="6.7" cy="11" cx="11.9" stroke-width="5" fill="${ color }"/>
        </svg>`;

        let iconeSetaSVG = 'data:image/svg+xml;utf-8;base64,' + btoa( svg_ );

        let icon = L.Icon.Label.extend({

            options: {
                iconUrl: iconeSetaSVG,
                shadowUrl: null,
                iconAnchor: [0, 0],
                labelAnchor: new L.Point(30, -10),
                wrapperAnchor: new L.Point(12, 13),
                labelClassName: 'fix-deal-label'
            }
        });

        return icon;
    }
}

export class Baloon{

    public getBaloonWithParams( data:any ){

        let line = data.line;
        let situ = data.situacao;

        let stringtipoaloc = '(atual)';
        let stringbyfor = `
        <nb-layout center class="ballon-vehicle">

            <nb-layout-header>Tentando conectar a estrutura mobile Reginas</nb-layout-header>
            <nb-layout-column>

            <div class="row show-grid">
                Sincronizando...
            </div>

            </nb-layout-column>

        </nb-layout>
        `;

        if( situ==null ){}else{

            let o = '';
            stringbyfor = '';

            switch( situ.situacao ){

                case 'R':
                    o = 'Recebido(caixa)';
                break;
                case 'F':
                    o = 'Finalizada(guia)';
                break;
                case 'C':
                    o = 'Cancelada(guia)';
                break;
                case 'X':
                    o = 'Alocado(iPad)';
                break;
                case 'G':
                    o = 'Nao sei';
                break;
                case 'E':
                    o = 'Alocado';
                break;
            }

            stringbyfor += `

            <nb-layout center class="ballon-vehicle">
                <nb-layout-header> Dados da alocação ${stringtipoaloc}</nb-layout-header>
                <nb-layout-column>

                <div class="row show-grid">
                  <div class="col-4">
                    <div>MOTORISTA:</div>
                  </div>
                  <div class="col-8">
                    <div>
                    ${ situ.nome_motorista }
                    </div>
                  </div>
                </div>

                <div class="row show-grid">
                  <div class="col-4">
                    <div>PEGADA:</div>
                  </div>
                  <div class="col-8">
                    <div>
                    ${ situ.pegada_motorista }
                    </div>
                  </div>
                </div>

                <div class="row show-grid">
                  <div class="col-4">
                    <div>LARGADA:</div>
                  </div>
                  <div class="col-8">
                    <div>
                    ${ situ.largada_motorista||'--:--' }
                    </div>
                  </div>
                </div>

                <div class="row show-grid">
                  <div class="col-4">
                    <div>TURNO / SITUAÇÃO:</div>
                  </div>
                  <div class="col-8">
                    <div>
                    ${ situ.turno } / ${ o }
                    </div>
                  </div>
                </div>

                <div class="row show-grid">
                  <div class="col-4">
                    <div>LINHA:</div>
                  </div>
                  <div class="col-8">
                    <div>
                    ${ line.prefixo } - ${ line.descricao }
                    </div>
                  </div>
                </div>

                <div class="row show-grid">
                  <div class="col-4">
                    <div>GUIA:</div>
                  </div>
                  <div class="col-8">
                    <div>
                    ${ situ.numero_guia }
                    </div>
                  </div>
                </div>

                </nb-layout-column>
            </nb-layout>
            `;
            stringtipoaloc = '(anterior)';
        }

        let date  = new Date( data.time );
        let _date = m( date ).tz( 'America/Sao_Paulo' ).format( 'DD/MM/YYYY HH:mm:ss' );
        let html  = `
        <nb-layout center class="ballon-vehicle">

            <nb-layout-header>${ data.title }</nb-layout-header>

            <nb-layout-column>

                <div class="row show-grid">
                  <div class="col-4">
                    <div>VELOCIDADE:</div>
                  </div>
                  <div class="col-8">
                    <div>${ data.velocidade }km/h</div>
                  </div>
                </div>

                <div class="row show-grid">
                  <div class="col-4">
                    <div>ENDEREÇO:</div>
                  </div>
                  <div class="col-8">
                    <div>
                    ${ data.road||'' }
                    </div>
                  </div>
                </div>

                <div class="row show-grid">
                  <div class="col-4">
                    <div>ULTIMA POSIÇÃO:</div>
                  </div>
                  <div class="col-8">
                    <div>
                    ${ _date||'' }
                    </div>
                  </div>
                </div>

            </nb-layout-column>

        </nb-layout>

        ${stringbyfor}

        <nb-layout center class="ballon-vehicle">

            <nb-layout-column>

                <div class="col-4"></div>

                <div class="col-8">
                    <button id="${ data.id }" type="submit" class="btn btn-primary rastrear">rastrear</button>
                </div>

            </nb-layout-column>

        </nb-layout>

        `;

        return html;
    }
}

/*

<defs>
<filter id="f074" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" inkscape:label="Black hole" inkscape:menu="Morphology" inkscape:menu-tooltip="Creates a black light inside and outside" height="1.5" width="1.5" y="-.25" x="-.25" color-interpolation-filters="sRGB">
    <feGaussianBlur stdDeviation="5" in="SourceAlpha" result="result1"/>
    <feComposite operator="arithmetic" k2="3.2" k1="-1" k4="-2" result="result3" in2="result1"/>
    <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 10 0 " result="result2"/>
    <feComposite result="fbSourceGraphic" in="SourceGraphic" operator="out" in2="result2"/>
    <feBlend mode="multiply" in="result1" in2="fbSourceGraphic" result="result91"/>
    <feBlend mode="screen" in="fbSourceGraphic" in2="result91"/>
</filter>
</defs>

*/
