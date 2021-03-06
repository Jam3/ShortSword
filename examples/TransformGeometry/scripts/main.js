/*
	Demo of loading 2 OBJs and blending between them
 */
var ssView = new SHORTSWORD.View();

var fileName1 = SHORTSWORD.URLParamUtils.getParam("json1") || "landscape.json";
var fileName2 = SHORTSWORD.URLParamUtils.getParam("json2") || "yoshi.json";
var voxels = SHORTSWORD.URLParamUtils.getParam("voxels");
var scale = SHORTSWORD.URLParamUtils.getParam("scale") || 60;
var options1 = {};
var options2 = {};
if(fileName1 == "landscape.json") {
	options1.transform = {
		offset: {
			y: 1,
			z: 2
		},
		scale : .75
	}
}
if(fileName2 == "yoshi.json") {
	options2.transform = {
		offset: {
			y: 0,
			z: 0
		},
		scale : .5
	}
}
if(!voxels) voxels = 60000;
var _this = this;
var mesh;
SHORTSWORD.Loader.loadGeometryJSON("../assets/models/" + fileName1, function(geometry1) {
	SHORTSWORD.Loader.loadGeometryJSON("../assets/models/" + fileName2, function(geometry2) {
		SHORTSWORD.GeometryUtils.fillEitherSurfacesToMatch(geometry1, geometry2);
		SHORTSWORD.GeometryGarage.fillSurfaces([geometry1, geometry2], voxels, function(){
			mesh = new SHORTSWORD.BlendMesh(geometry1, geometry2);
			ssView.scene.add(mesh);
			_this.blendModel = mesh;
			_this.blendModel.scale.multiplyScalar(scale);
		});
	}, options2);
}, options1);

var mouseTarget = new THREE.Vector3(0, 0, 100);
var mouseTargetTarget = mouseTarget.clone();

SHORTSWORD.PerformanceTweaker.upgradeWhen = 60;
SHORTSWORD.PerformanceTweaker.degradeWhen = 45;

var canvasGraph = new SHORTSWORD.CanvasGraph();
canvasGraph.addValue(SHORTSWORD.FPS, "fps", "green", "FPS Smoothed");
canvasGraph.addValue(SHORTSWORD.PerformanceTweaker, "degradeWhen", "#550000", "FPS Smoothed");
canvasGraph.addValue(SHORTSWORD.PerformanceTweaker, "upgradeWhen", "#2244aa", "FPS Smoothed");

ssView.renderManager.onEnterFrame.add(function() {
	SHORTSWORD.GeometryGarage.doSomeWork();
	if(!_this.blendModel) return;
	_this.blendModel.blend = Math.min( 1, Math.max( 0, Math.sin((new Date()).getTime() * .0005) * .5 + .5));
	mouseTarget.x -= (mouseTarget.x - mouseTargetTarget.x) * .1;
	mouseTarget.y -= (mouseTarget.y - mouseTargetTarget.y) * .1;
	this.mesh.lookAt(mouseTarget);
})
window.onmousemove = function(event) {
	mouseTargetTarget.x = 100 * (event.x / window.innerWidth * 2 - 1);
	mouseTargetTarget.y = -100 * (event.y / window.innerHeight * 2 - 1);
}.bind(this);
