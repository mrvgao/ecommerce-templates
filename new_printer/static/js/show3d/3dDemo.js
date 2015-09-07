/*var T_DInited = false;*/
/*var loader;*/

var particleLight;

var _obj = {
	scene: null,
	camera: null,
	renderer: null,
	container: null,
	controls: null,
	clock: null,
	stats: null,

	init: function(url,width,height,cont) { // 初始化

		//创建主要场景
		this.scene = new THREE.Scene();  // 实例化3D对象

		var SCREEN_WIDTH = width,
			SCREEN_HEIGHT = height;  // 设置宽高

		// 准备相机
		var VIEW_ANGLE = 15, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 10000;
		this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
		this.scene.add(this.camera);
		this.camera.position.set(-1000, 1000, 0);
		this.camera.lookAt(new THREE.Vector3(0,0,0));

		//////////added by white
		this.spotLight = new THREE.SpotLight(0xffffff, .3, 0);
		this.spotLight.position.set(-700, 1000, 1000);
		this.spotLight.castShadow = false;
		this.scene.add(this.spotLight);

		this.pointLights = [];

		var pointLight = new THREE.PointLight(0xffffff, 0.6, 0);
		pointLight.position.set(-700, 1000, 100);
		this.scene.add(pointLight);
		this.pointLights.push(pointLight);

		pointLight = new THREE.PointLight(0xffffff, 0.6, 0);
		pointLight.position.set(200, -1000, 0);
		this.scene.add(pointLight);
		this.pointLights.push(pointLight);

		pointLight = new THREE.PointLight(0xffffff, 0.7, 0);
		pointLight.position.set(3200, -3900, 3500);
		this.scene.add(pointLight);
		this.pointLights.push(pointLight);

		pointLight = new THREE.PointLight(0xffffff, 0.6, 0);
		pointLight.position.set(0, 0, -10000);
		this.scene.add(pointLight);
		this.pointLights.push(pointLight);

		// 准备渲染
		// set 'preserveDrawingBuffer' distribute to 'true' to make sure that the canvas with threejs can be captured as an image (via white)
		this.renderer = new THREE.WebGLRenderer({antialias:true, alpha: false, preserveDrawingBuffer: true });
		this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		this.renderer.setClearColor(0xffffff);

		this.renderer.shadowMapEnabled = true;
		this.renderer.shadowMapSoft = true;

		// 准备容器
		// this.container = document.createElement('div');
		document.getElementById(cont).appendChild(this.renderer.domElement);
		// this.container.appendChild(this.renderer.domElement);

		// 事件
		// THREEx.WindowResize(this.renderer, this.camera);

		// 准备控制器 (OrbitControls)
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.controls.target = new THREE.Vector3(0, 0, 0);

		// 准备计时器
		this.clock = new THREE.Clock();

		// 添加定向光线
		var dLight = new THREE.DirectionalLight(0xffffff);
		dLight.position.set(1000, 0, 1);
		dLight.castShadow = true;
		// dLight.shadowCameraVisible = true;
		dLight.shadowDarkness = 0.2;
		dLight.shadowMapWidth = dLight.shadowMapHeight = 1000;
		//this.scene.add(dLight);

		// 开始画3D图

		// ASCII file
		var _this = this;

		// Binary files
		//var material = new THREE.MeshPhongMaterial({ambient: 0x555555,color: 0xff0000,specular: 0x111111,shininess: 200});
		//var material = new THREE.MeshPhongMaterial( { bumpScale: 0.5, color: 0x000000, specular: 0xF9FF00, shininess: 50, shading: THREE.SmoothShading } );
		var material = new THREE.MeshPhongMaterial({color:0x0066CC,specular: 0x0066CC, shading: THREE.SmoothShading, shininess: 6, fog: false, side: THREE.DoubleSide});
		/*material.metal = true;*/

		var loader = new THREE.STLLoader();
		loader.addEventListener('load', function(event) {

				var geometry = event.content;
				var mesh = new THREE.Mesh(geometry, material);

				mesh.position.set(0, -0.37, -0.6);
				mesh.rotation.set(-Math.PI / 2, 0, 0);
				mesh.scale.set(2, 2, 2);

				mesh.castShadow = true;
				mesh.receiveShadow = true;

				_this.scene.add(mesh);

				});
		loader.load(url);
	},
};

// 动画
function animate() {
	requestAnimationFrame(animate);
	render();
	update();
}

// 更新控制器状态
function update() {
	_obj.controls.update(_obj.clock.getDelta());
	//_obj.stats.update();
	// smoothly move the particleLight
	var timer = Date.now() * 0.000025;
	//particleLight.position.x = Math.sin(timer * 5) * 300;
	//particleLight.position.z = Math.cos(timer * 5) * 300;
}

// 渲染场景
function render() {
	if (_obj.renderer) {
		_obj.renderer.render(_obj.scene, _obj.camera);
	}
}

// 在页面加载时初始化 _obj 对象
function initializeObj(url, width, height, contId) {
	/*$('#show-3d').html(null);*/
	_obj.init(url,width,height,contId);
	animate();
	$('canvas').hover(function(){
		$('body').css('overflow','hidden');	   
	},function(){
		$('body').css('overflow','auto');	   
	});
}

