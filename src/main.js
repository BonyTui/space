import * as THREE from 'three';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Import assets
import earthImage from './assets/earth.jpg';
import normalImage from './assets/normal.jpg';
import moonImage from './assets/moon.jpg';
import normal2Image from './assets/normal2.jpg';
import spaceImage from './assets/space2.jpg';
import backgroundMusic from './assets/background-music.mp3';
import laserSound from './assets/laser.mp3';

// Import region images
import newcastle1 from './assets/newcastle1.jpg';
import newcastle2 from './assets/newcastle2.jpg';
import sydney from './assets/sydney1.jpg';
import hanoi from './assets/hanoi.jpg';
import phuquoc1 from './assets/phuquoc1.jpg';
import phuquoc2 from './assets/phuquoc2.jpg';
import sanfrancisco from './assets/sanfrancisco.jpg';
import yosemite from './assets/yosemite.jpg';
import hawaii from './assets/hawaii.jpg';
import nanning from './assets/nanning.jpg';
import kualalumpur from './assets/kualalumpur.jpg';
import bangkok from './assets/bangkok.jpg';
import jakarta from './assets/jakarta.jpg';

// Create a new Three.js scene
const scene = new THREE.Scene();

// Set up the camera with a perspective view
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Set up the renderer and attach it to the canvas element
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Position the camera
camera.position.setZ(30);

// Create the Earth geometry and material
const geometry = new THREE.SphereGeometry(15, 32, 32); 
const earthTexture = new THREE.TextureLoader().load(earthImage);
const normalTexture = new THREE.TextureLoader().load(normalImage);
const material = new THREE.MeshStandardMaterial({ map: earthTexture, normalMap: normalTexture }); 
const earth = new THREE.Mesh(geometry, material);
earth.rotation.y = Math.PI / 1.5;
scene.add(earth);

// Create the Moon geometry and material
const moonGeometry = new THREE.SphereGeometry(3.75, 32, 32);
const moonTexture = new THREE.TextureLoader().load(moonImage);
const moonnNormalTexture = new THREE.TextureLoader().load(normal2Image);
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: moonnNormalTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(-60, 0, 60);
scene.add(moon);

// Add ambient light to the scene
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.5); // Brighter ambient light
scene.add(ambientLight);

// Add point light to the scene
const pointLight = new THREE.PointLight(0xFFFFFF, 1.5);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

// Add point light for the Moon
const moonLight = new THREE.PointLight(0xFFFFFF, 1.5);
moonLight.position.set(-60, 0, 60);
scene.add(moonLight);

// Add directional light to the scene
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(-50, -50, 50);
scene.add(directionalLight);

// Add glow effect to the Earth
const glowGeometry = new THREE.SphereGeometry(15.5, 32, 32);
const glowMaterial = new THREE.ShaderMaterial({
  uniforms: {
    'c': { type: 'f', value: 0.3 },
    'p': { type: 'f', value: 4.0 },
    glowColor: { type: 'c', value: new THREE.Color(0x00ff00) },
    viewVector: { type: 'v3', value: camera.position }
  },
  vertexShader: `
    uniform vec3 viewVector;
    uniform float c;
    uniform float p;
    varying float intensity;
    void main() {
      vec3 vNormal = normalize(normalMatrix * normal);
      vec3 vNormel = normalize(normalMatrix * viewVector);
      intensity = pow(c - dot(vNormal, vNormel), p);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 glowColor;
    varying float intensity;
    void main() {
      vec4 glow = vec4(glowColor, 1.0) * intensity;
      gl_FragColor = glow;
    }
  `,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true
});
const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
scene.add(glowMesh);

// Set up orbit controls for camera interaction
const controls = new OrbitControls(camera, renderer.domElement);

// Function to add stars to the scene
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 16, 16);
  const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF }); 
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(700));
  star.position.set(x, y, z);
  scene.add(star);
}

// Add 200 stars to the scene
Array(1000).fill().forEach(addStar);

// Set the background texture of the scene
const spaceTexture = new THREE.TextureLoader().load(spaceImage);
scene.background = spaceTexture;

// Create a text box element
const infoBox = document.createElement('div');
infoBox.style.position = 'fixed';
infoBox.style.backgroundColor = 'white';
infoBox.style.padding = '10px';
infoBox.style.display = 'none';
infoBox.style.top = '50%';
infoBox.style.left = '50%';
infoBox.style.transform = 'translate(-50%, -50%)';
infoBox.style.zIndex = '1000';
document.body.appendChild(infoBox);

// Add a close button to the text box
const closeButton = document.createElement('button');
closeButton.innerHTML = 'X';
closeButton.style.position = 'absolute';
closeButton.style.top = '5px';
closeButton.style.right = '5px';
closeButton.addEventListener('click', () => {
  infoBox.style.display = 'none';
});
infoBox.appendChild(closeButton);

// Define regions on the Earth
const regions = [
  { position: new THREE.Vector3(-11.7, -7.1, -5.9), info: 'Newcastle: 2 Days Road Trip, Hiking, Sandboarding', img: [newcastle1, newcastle2] },
  { position: new THREE.Vector3(-10.8, -8.2, -6.2), info: 'Sydney: Ferry to Fishing Spot', img: [sydney] },
  { position: new THREE.Vector3(-3.2, 5.6, -13.5), info: 'Hanoi: Paintballing', img: [hanoi] },
  { position: new THREE.Vector3(-3.6, 3.2, -14.2), info: 'Phu Quoc: Paragliding and Jetskiing', img: [phuquoc1, phuquoc2] },
  { position: new THREE.Vector3(-6, 9.8, 9.6), info: 'San Francisco: Sea Fishing', img: [sanfrancisco] },
  { position: new THREE.Vector3(-5.1, 10.6, 9.2), info: 'Yosemite: Skiing', img: [yosemite] },
  { position: new THREE.Vector3(-12.8, 5, 5.8), info: 'Hawaii: Family Vacation, Beach, Explore Islands', img: [hawaii] },
  { position: new THREE.Vector3(-4.6, 6.2, -12.8), info: 'Nanning: Me and Cousins', img: [nanning] },
  { position: new THREE.Vector3(-3, 0.8, -14.6), info: 'Kuala Lumpur: Petronas Twin Tower', img: [kualalumpur] },
  { position: new THREE.Vector3(-2.6, 3.8, -14.2), info: 'Bangkok: Pet Cafe', img: [bangkok] },
  { position: new THREE.Vector3(-4.5, -1.7, -14.1), info: 'Jakarta: Church', img: [jakarta] },
];

// Add regions to the Earth
regions.forEach(region => {
  const markerGeometry = new THREE.SphereGeometry(0.3, 16, 16); // Larger size for easier clicking
  const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00, opacity: 1 });
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.copy(region.position);
  marker.userData.info = region.info;
  marker.userData.img = region.img;
  earth.add(marker);
});

// Create a raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event listener for mouse clicks to display a text box at the clicked position on the Earth
document.addEventListener("click", (event) => {
  // Update the mouse variable with the normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Set the raycaster from the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // World Location Debug
  // const location_intersects = raycaster.intersectObject(earth);
  // if (location_intersects.length > 0) {
  //   const pointClick = location_intersects[0].point;
  //   console.log("World location:", pointClick);
  // }

// Raycasting the moon
const moon_intersect = raycaster.intersectObject(moon);
if (moon_intersect.length > 0) {
  const moonText = `
    <strong>Name:</strong> Tony Bui <br>
    <strong>Age:</strong> 19 <br>
    <strong>Origin:</strong> Vietnam <br>
    <strong>Study:</strong> Computer Science (2nd Year) <br>
    <strong>Hobbies:</strong> Powerlifting, Skateboarding, BJJ, Traveling <br>
    <strong>Fav Ice Cream Flavor:</strong> Vanilla
  `;
  displayTextBox(moonText, []);
  return;
}

  // Calculate objects intersecting the ray
  const intersects = raycaster.intersectObjects(earth.children);
  if (intersects.length > 0) {
    // Get the first intersected object
    const intersectedObject = intersects[0].object;

    // Display the text box at the center of the screen
    displayTextBox(intersectedObject.userData.info, intersectedObject.userData.img);
  }
});

// Function to display a text box at the center of the screen
const displayTextBox = (text, imgSrcArray) => {
  clickSound.play();
  let imagesHtml = '';
  imgSrcArray.forEach(src => {
    imagesHtml += `<img src="${src}" alt="Region Image" style="width:490px;height:auto;margin:10px 0;">`;
  });
  infoBox.innerHTML = `<button style="position:absolute;top:5px;right:5px;" onclick="this.parentElement.style.display='none'">X</button><p>${text}</p>${imagesHtml}`;
  infoBox.style.display = 'block';
  console.log("Text box displayed");
}
// Add background music
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load(backgroundMusic, function(buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  
  // Function to resume audio context on user gesture
  const resumeAudioContext = () => {
    if (listener.context.state === 'suspended') {
      listener.context.resume();
    }
    sound.play();
    // Remove the event listener after the audio context is resumed
    document.removeEventListener('click', resumeAudioContext);
    document.removeEventListener('keydown', resumeAudioContext);
  };

  // Add event listeners for user gestures
  document.addEventListener('click', resumeAudioContext);
  document.addEventListener('keydown', resumeAudioContext);
});

// Load click sound effect
const clickSound = new THREE.Audio(listener);
audioLoader.load(laserSound, function(buffer) {
  clickSound.setBuffer(buffer);
  clickSound.setVolume(1.0);
});

// Animation loop to render the scene and update controls
function animate() {
  requestAnimationFrame(animate);

  // Rotate the Earth
  earth.rotation.y += 0.0009;
  moon.rotation.y += 0.01;
  
  // Update orbit controls
  controls.update();

  // Render the scene from the perspective of the camera
  renderer.render(scene, camera);
}

// Start the animation loop
animate();