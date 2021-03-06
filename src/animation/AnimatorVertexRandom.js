var BaseAnimator = require( './BaseAnimator' );

var AnimatorVertexRandom = function( mesh ) {

	BaseAnimator.call( this, mesh );

	this.velocityX = .1;
	this.velocityY = .1;
	this.velocityZ = .1;
};

var p = AnimatorVertexRandom.prototype = Object.create( BaseAnimator.prototype );

p.update = function() {
	this.vertices = this.mesh.geometry.vertices;
};

p.updateVertex = function(){
	var out;

	return function( vertexIDX ) {
		out = this.vertices[ vertexIDX ];
		
		out.x += ( Math.random() * 2 - 1 ) * this.velocityX;
		out.y += ( Math.random() * 2 - 1 ) * this.velocityY;
		out.z += ( Math.random() * 2 - 1 ) * this.velocityZ;
	}
}();

module.exports = AnimatorVertexRandom;