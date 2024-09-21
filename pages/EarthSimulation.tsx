import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from 'three/examples/jsm/libs/stats.module';

const EarthSimulation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fps, setFps] = useState<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Performance optimizations
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
    mountRef.current.appendChild(renderer.domElement);

    const stats = new Stats();
    mountRef.current.appendChild(stats.dom);

    // Optimized star field
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const starsVertices = new Float32Array(15000);
    for (let i = 0; i < 15000; i += 3) {
      starsVertices[i] = THREE.MathUtils.randFloatSpread(2000);
      starsVertices[i + 1] = THREE.MathUtils.randFloatSpread(2000);
      starsVertices[i + 2] = THREE.MathUtils.randFloatSpread(2000);
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Optimized Earth
    const earthRadius = 5;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("/images/earth-texture.jpg", () => {
      earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    });
    const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture, roughness: 0.5 });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Optimized lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    camera.position.z = 15;

    // Optimized OrbitControls with zoom restrictions
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05; // Adds smoothness to camera movement
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 0.8;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.enableRotate = true;

    // Set zoom limits
    const minDistance = 7; // Minimum distance from the center (zoom in limit)
    const maxDistance = 20; // Maximum distance from the center (zoom out limit)
    controls.minDistance = minDistance;
    controls.maxDistance = maxDistance;

    // Additional zoom smoothness
    controls.zoomToCursor = true;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };

    // Optimized country borders
    const addCountryBorders = async () => {
      try {
        const response = await fetch("/data/countries.geojson");
        const geoJson = await response.json();

        const material = new THREE.LineBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.5,
        });

        const allPoints: THREE.Vector3[] = [];
        const tempVector = new THREE.Vector3();

        geoJson.features.forEach((feature: any) => {
          if (feature.geometry.type === "Polygon") {
            getPointsFromPolygon(feature.geometry.coordinates[0], allPoints, tempVector);
          } else if (feature.geometry.type === "MultiPolygon") {
            feature.geometry.coordinates.forEach((polygon: number[][][]) => {
              getPointsFromPolygon(polygon[0], allPoints, tempVector);
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

    const getPointsFromPolygon = (coordinates: number[][], points: THREE.Vector3[], tempVector: THREE.Vector3) => {
      for (let i = 0; i < coordinates.length; i += 2) {
        const coord = coordinates[i];
        const nextCoord = coordinates[(i + 1) % coordinates.length];
        points.push(latLonToVector3(coord[1], coord[0], earthRadius + 0.005, tempVector).clone());
        points.push(latLonToVector3(nextCoord[1], nextCoord[0], earthRadius + 0.005, tempVector).clone());
      }
    };

    const latLonToVector3 = (lat: number, lon: number, radius: number, vec: THREE.Vector3) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      vec.x = -(radius * Math.sin(phi) * Math.cos(theta));
      vec.z = radius * Math.sin(phi) * Math.sin(theta);
      vec.y = radius * Math.cos(phi);
      return vec;
    };

    addCountryBorders();

    let lastTime = performance.now();
    let frameCount = 0;
    let elapsedTime = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      const currentTime = performance.now();
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      frameCount++;
      elapsedTime += delta;

      if (elapsedTime >= 1000) {
        setFps(Math.round(frameCount * 1000 / elapsedTime));
        frameCount = 0;
        elapsedTime = 0;
      }

      // Ensure camera doesn't go beyond zoom limits
      camera.position.clampLength(minDistance, maxDistance);

      controls.update();
      renderer.render(scene, camera);
      stats.update();
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
      mountRef.current?.removeChild(stats.dom);
      renderer.dispose();
    };
  }, []);

  return (
    <>
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
      <div style={{ position: 'fixed', top: 10, left: 10, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px' }}>
        FPS: {fps}
      </div>
    </>
  );
};

export default EarthSimulation;