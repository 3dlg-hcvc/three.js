import { DefaultLoadingManager } from './LoadingManager.js';

/**
 * @author alteredq / http://alteredqualia.com/
 */

function Loader( manager ) {

	this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

	this.crossOrigin = 'anonymous';
	this.path = '';
	this.resourcePath = '';

}

Loader.DefaultMaterialType = 'MeshPhysicalMaterial';  // NOTE(MS): MeshLambertMaterial breaks light shadow mapping


Object.assign( Loader.prototype, {

	load: function ( /* url, onLoad, onProgress, onError */ ) {},

	parse: function ( /* data */ ) {},

	setCrossOrigin: function ( crossOrigin ) {

		this.crossOrigin = crossOrigin;
		return this;

	},

	setPath: function ( path ) {
		this.path = path;
		return this;
	},

	setResourcePath: function ( resourcePath ) {

		this.resourcePath = resourcePath;
		return this;

	}

} );

export { Loader };
