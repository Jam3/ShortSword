/*
	Demo of loading and displaying an OBJ file.
 */
var ssView = new SHORTSWORD.View();

var _this = this;
SHORTSWORD.Loader.loadGeometryOBJ("../assets/models/mario_obj.obj", function(geometry) {

	SHORTSWORD.GeometryUtils.orderlyScramble([geometry]);
	SHORTSWORD.GeometryUtils.reduce(geometry, 5000);
	var img = new Image();
	img.src = '../assets/images/image1.png';

	var img2 = new Image();
	img2.src = '../assets/images/image2.png';

	var countLoaded = 0;

	img.onload = onImageLoaded;
	img2.onload = onImageLoaded;


	function onImageLoaded() {

		if( ++countLoaded == 2 ){

			var mat = new SHORTSWORD.materials.VoxelImageLookUp();
			mat.addFromImage( img );
			mat.addFromImage( img2 );

			for( var i = 0, len = geometry.vertices.length; i < len; i++ ) {
				//this is a hack, but very high performance when zsorted
				geometry.materialIndex[i] = i % 2;
			}
			
			var mesh = new SHORTSWORD.Mesh( geometry, mat );

			ssView.scene.add( mesh );
			_this.objModel = mesh;
		}
	}
});



var mouseMove = {x:0,y:0,speed:.1};
SHORTSWORD.PerformanceTweaker.upgradeWhen = 45;
SHORTSWORD.PerformanceTweaker.degradeWhen = 30;

var canvasGraph = new SHORTSWORD.CanvasGraph();
canvasGraph.addValue(SHORTSWORD.FPS, "fps", "green", "FPS Smoothed");
canvasGraph.addValue(SHORTSWORD.PerformanceTweaker, "degradeWhen", "#550000", "FPS Smoothed");
canvasGraph.addValue(SHORTSWORD.PerformanceTweaker, "upgradeWhen", "#2244aa", "FPS Smoothed");

ssView.renderManager.onEnterFrame.add(function() {
	if(!_this.objModel) return;
	_this.objModel.rotateY(mouseMove.x * mouseMove.speed);
	_this.objModel.rotateX(mouseMove.y * mouseMove.speed);
})
window.onmousemove = function(event) {
	mouseMove.x = event.x / window.innerWidth * 2 - 1;
	mouseMove.y = event.y / window.innerHeight * 2 - 1;
};