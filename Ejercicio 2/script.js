
const escena = new THREE.Scene();
const renderizador = new THREE.WebGLRenderer();
renderizador.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderizador.domElement);


const ancho = window.innerWidth;
const alto = window.innerHeight;
const camara = new THREE.OrthographicCamera(ancho / -2, ancho / 2, alto / 2, alto / -2, 0.1, 1000);
camara.position.z = 10;


const geometría1 = new THREE.SphereGeometry(70, 70); 
const material1 = new THREE.MeshBasicMaterial({ color: 0xFF69B4, wireframe: true });
const esfera = new THREE.Mesh(geometría1, material1);
esfera.position.x = -150;
escena.add(esfera);

const geometría2 = new THREE.BoxGeometry(100, 100, 100, 10, 10, 10); 
const material2 = new THREE.MeshBasicMaterial({ color: 0x00008B, wireframe: true });
const cubo = new THREE.Mesh(geometría2, material2);
cubo.position.x = 150;
escena.add(cubo);


function animacion() {
    requestAnimationFrame(animacion);
    esfera.rotation.z += 0.01; 
    esfera.rotation.y += 0.01;
    esfera.rotation.x += 0.01;
    
    cubo.rotation.z -= 0.01; 
    cubo.rotation.y -= 0.01;
    cubo.rotation.x -= 0.01;

    renderizador.render(escena, camara);
}

animacion();

window.addEventListener('resize', () => {
    const ancho = window.innerWidth;
    const alto = window.innerHeight;
    camara.left = ancho / -2;
    camara.right = ancho / 2;
    camara.top = alto / 2;
    camara.bottom = alto / -2;
    camara.updateProjectionMatrix();
    renderizador.setSize(ancho, alto);
});