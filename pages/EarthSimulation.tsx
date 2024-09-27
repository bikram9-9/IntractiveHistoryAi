import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const EarthSimulation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Stars (unchanged)
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    const starsSizes = [];
    for (let i = 0; i < 5000; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);
      starsVertices.push(x, y, z);
      starsSizes.push(Math.random() * 0.4 + 0.1);
    }
    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    starsGeometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(starsSizes, 1)
    );

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      sizeAttenuation: true,
      vertexColors: false,
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Earth
    const earthRadius = 5;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("/images/earth-texture.jpg");
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      specular: new THREE.Color(0x333333),
      shininess: 5,
      bumpMap: earthTexture,
      bumpScale: 0.02,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Improved Lighting
    const ambientLight = new THREE.AmbientLight(0x333333); // Reduced ambient light
    scene.add(ambientLight);

    // Main sunlight
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    // Wider, softer light
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    scene.add(hemisphereLight);

    // Subtle rim light
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    camera.position.z = 15;

    // OrbitControls (unchanged)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.minDistance = 6;
    controls.maxDistance = 50;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;

    // Country borders (unchanged)
    const addCountryBorders = async () => {
      try {
        const response = await fetch("/data/countries.geojson");
        const geoJson = await response.json();

        const material = new THREE.LineBasicMaterial({
          color: 0xd3d3d3,
          linewidth: 2,
          transparent: true,
          opacity: 0.7,
        });

        const allPoints: THREE.Vector3[] = [];

        geoJson.features.forEach((feature: any) => {
          if (feature.geometry.type === "Polygon") {
            allPoints.push(
              ...getPointsFromPolygon(feature.geometry.coordinates[0], 3)
            );
          } else if (feature.geometry.type === "MultiPolygon") {
            feature.geometry.coordinates.forEach((polygon: number[][][]) => {
              allPoints.push(...getPointsFromPolygon(polygon[0], 3));
            });
          }
        });

        const geometry = new THREE.BufferGeometry().setFromPoints(allPoints);
        const lines = new THREE.LineSegments(geometry, material);
        earth.add(lines);
      } catch (error) {
        console.error("Error loading country borders:", error);
      }
    };

    const getPointsFromPolygon = (
      coordinates: number[][],
      simplifyFactor: number
    ): THREE.Vector3[] => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i < coordinates.length; i += simplifyFactor) {
        const coord = coordinates[i];
        const nextCoord =
          coordinates[(i + simplifyFactor) % coordinates.length];
        points.push(latLonToVector3(coord[1], coord[0], earthRadius + 0.01));
        points.push(
          latLonToVector3(nextCoord[1], nextCoord[0], earthRadius + 0.01)
        );
      }
      return points;
    };

    const latLonToVector3 = (lat: number, lon: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    addCountryBorders();

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    />
  );
};

export default EarthSimulation;
