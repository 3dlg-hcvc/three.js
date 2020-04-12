import { Object3D } from '../core/Object3D.js';
import { WebGLCubeRenderTarget } from '../renderers/WebGLCubeRenderTarget.js';
import { LinearFilter, RGBFormat } from '../constants.js';
import { Vector3 } from '../math/Vector3.js';
import { PerspectiveCamera } from './PerspectiveCamera.js';

/**
 * Camera for rendering cube maps
 *	- renders scene into axis-aligned cube
 *
 * @author alteredq / http://alteredqualia.com/
 */

var fov = 90, aspect = 1;

function CubeCamera( near, far, cubeResolution, options ) {

	Object3D.call( this );

	this.type = 'CubeCamera';

	var cameraPX = new PerspectiveCamera( fov, aspect, near, far );
	cameraPX.up.set( 0, - 1, 0 );
	cameraPX.lookAt( new Vector3( 1, 0, 0 ) );
	this.add( cameraPX );

	var cameraNX = new PerspectiveCamera( fov, aspect, near, far );
	cameraNX.up.set( 0, - 1, 0 );
	cameraNX.lookAt( new Vector3( - 1, 0, 0 ) );
	this.add( cameraNX );

	var cameraPY = new PerspectiveCamera( fov, aspect, near, far );
	cameraPY.up.set( 0, 0, 1 );
	cameraPY.lookAt( new Vector3( 0, 1, 0 ) );
	this.add( cameraPY );

	var cameraNY = new PerspectiveCamera( fov, aspect, near, far );
	cameraNY.up.set( 0, 0, - 1 );
	cameraNY.lookAt( new Vector3( 0, - 1, 0 ) );
	this.add( cameraNY );

	var cameraPZ = new PerspectiveCamera( fov, aspect, near, far );
	cameraPZ.up.set( 0, - 1, 0 );
	cameraPZ.lookAt( new Vector3( 0, 0, 1 ) );
	this.add( cameraPZ );

	var cameraNZ = new PerspectiveCamera( fov, aspect, near, far );
	cameraNZ.up.set( 0, - 1, 0 );
	cameraNZ.lookAt( new Vector3( 0, 0, - 1 ) );
	this.add( cameraNZ );

	options = options || { format: RGBFormat, magFilter: LinearFilter, minFilter: LinearFilter };

	this.renderTarget = new WebGLCubeRenderTarget( cubeResolution, options );
	this.renderTarget.texture.name = "CubeCamera";

	this.update = function ( renderer, scene ) {

		if ( this.parent === null ) this.updateMatrixWorld();

		var currentRenderTarget = renderer.getRenderTarget();

		var renderTarget = this.renderTarget;
		var generateMipmaps = renderTarget.texture.generateMipmaps;

		renderTarget.texture.generateMipmaps = false;

		renderer.setRenderTarget( renderTarget, 0 );
		renderer.render( scene, cameraPX );

		renderer.setRenderTarget( renderTarget, 1 );
		renderer.render( scene, cameraNX );

		renderer.setRenderTarget( renderTarget, 2 );
		renderer.render( scene, cameraPY );

		renderer.setRenderTarget( renderTarget, 3 );
		renderer.render( scene, cameraNY );

		renderer.setRenderTarget( renderTarget, 4 );
		renderer.render( scene, cameraPZ );

		renderTarget.texture.generateMipmaps = generateMipmaps;

		renderer.setRenderTarget( renderTarget, 5 );
		renderer.render( scene, cameraNZ );

		renderer.setRenderTarget( currentRenderTarget );

	};

	this.clear = function ( renderer, color, depth, stencil ) {

		var currentRenderTarget = renderer.getRenderTarget();

		var renderTarget = this.renderTarget;

		for ( var i = 0; i < 6; i ++ ) {

			renderer.setRenderTarget( renderTarget, i );

			renderer.clear( color, depth, stencil );

		}

		renderer.setRenderTarget( currentRenderTarget );

	};

	this.setFromCamera = function( source, useLocal ) {
		this.up.copy( source.up );

		if (useLocal) {
			this.position.copy( source.position );
			this.quaternion.copy( source.quaternion );
			this.scale.copy( source.scale );

			this.matrix.copy( source.matrix );
		} else {
			this.matrix.copy( source.matrixWorld );
			this.matrix.decompose(this.position, this.quaternion, this.scale);
			this.matrixWorldNeedsUpdate = true;  // make sure matrixWorldNeedsUpdate is set
		}
		this.updateMatrixWorld();

		this.near = source.near;
		this.far = source.far;
		var sv = new THREE.Vector3();
		var scale = 1.0 / this.getWorldScale(sv).length();
		this.children.forEach(function(c) {
			if (c.near !== source.near || c.far !== source.far) {
				c.near = scale*source.near;
				c.far = scale*source.far;
				c.updateProjectionMatrix();
			}
		});
	}

}

CubeCamera.prototype = Object.create( Object3D.prototype );
CubeCamera.prototype.constructor = CubeCamera;


export { CubeCamera };
