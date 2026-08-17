/**
 * Real 3D WebGL Canvas Scene using Three.js - 100% Entire Page Ambient Background
 * Minimalist, organically randomized 3D geometries (no parallel lines, uncluttered distribution).
 */

class ThreeDWebCanvas {
  constructor() {
    this.container = document.getElementById('three-canvas-container');
    if (!this.container) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });

    this.meshes = [];
    this.scrollTarget = 0;
    this.currentScroll = 0;

    this.mouseX = 0;
    this.mouseY = 0;

    this.init();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.z = 16;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xf87171, 1.0); // Soft coral
    dirLight1.position.set(10, 20, 15);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x2dd4bf, 1.0); // Soft teal
    dirLight2.position.set(-10, -10, 10);
    this.scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xfbbf24, 1.2, 50); // Soft amber glow
    pointLight.position.set(0, 5, 5);
    this.scene.add(pointLight);

    // Create Minimalist Organic 3D Meshes
    this.createRandomized3DMeshes();

    // Event Listeners
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.animate();
  }

  createRandomized3DMeshes() {
    const createMat = (colorHex) => new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.25,
      metalness: 0.45,
      transparent: true,
      opacity: 0.5,
      flatShading: true
    });

    const matCoral = createMat(0xf87171);
    const matTeal = createMat(0x2dd4bf);
    const matGold = createMat(0xfbbf24);
    const matPurple = createMat(0xa78bfa);

    const materials = [matCoral, matTeal, matGold, matPurple];

    // 3D Geometries
    const icoGeo = new THREE.IcosahedronGeometry(1.2, 0);       // 3D 20-sided Gem
    const octGeo = new THREE.OctahedronGeometry(1.0, 0);        // 3D Diamond Gem
    const dodecGeo = new THREE.DodecahedronGeometry(1.1, 0);    // 3D 12-sided Crystal
    const torusGeo = new THREE.TorusGeometry(1.1, 0.3, 16, 32); // 3D Ring
    const boxGeo = new THREE.BoxGeometry(1.1, 1.4, 0.4);       // 3D Floating Book
    const tetGeo = new THREE.TetrahedronGeometry(1.1, 0);       // 3D Pyramid

    const geometries = [icoGeo, octGeo, dodecGeo, torusGeo, boxGeo, tetGeo];

    // Minimalist: 14 total objects naturally scattered (no parallel lines)
    const totalObjects = 14;
    const startY = 3;
    const endY = -62;
    const stepY = (startY - endY) / totalObjects;

    for (let i = 0; i < totalObjects; i++) {
      const geo = geometries[i % geometries.length];
      const mat = materials[i % materials.length];

      // Organic random X scattering (avoiding dead center text block)
      let x = (Math.random() - 0.5) * 18;
      if (Math.abs(x) < 3.2) {
        x += (x >= 0 ? 3.2 : -3.2);
      }

      // Random Y jitter for natural organic float
      const y = startY - (i * stepY) + ((Math.random() - 0.5) * 3.5);
      const z = (Math.random() * 4 - 2);

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);

      // Random initial rotations
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mesh.userData = {
        baseY: y,
        rotSpeed: [
          (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
          (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
          (Math.random() * 0.008 + 0.002)
        ],
        floatOffset: Math.random() * Math.PI * 2
      };

      this.scene.add(mesh);
      this.meshes.push(mesh);
    }
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseMove(e) {
    this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Scroll Lerp Interpolation
    this.scrollTarget = window.scrollY;
    this.currentScroll += (this.scrollTarget - this.currentScroll) * 0.08;

    // Dynamically calculate camera Y based on scrollable page percentage
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollProgress = this.currentScroll / maxScroll;

    // Camera moves smoothly from Y = 0 down to Y = -62 across 100% of page height
    this.camera.position.y = -scrollProgress * 62;

    // 3D Mouse Tilt
    this.scene.rotation.y = (this.mouseX * 0.06);
    this.scene.rotation.x = (this.mouseY * 0.04);

    // Animate individual 3D background meshes
    const time = Date.now() * 0.0012;

    this.meshes.forEach((mesh) => {
      // Continuous 3D Rotation
      mesh.rotation.x += mesh.userData.rotSpeed[0];
      mesh.rotation.y += mesh.userData.rotSpeed[1];
      mesh.rotation.z += mesh.userData.rotSpeed[2];

      // Scroll-driven extra 3D spin
      mesh.rotation.y += scrollProgress * 0.04;

      // Floating Bobbing
      mesh.position.y = mesh.userData.baseY + Math.sin(time + mesh.userData.floatOffset) * 0.3;
    });

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.threeDCanvas = new ThreeDWebCanvas();
});
