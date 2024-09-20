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
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Earth
    const earthRadius = 5;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("/images/earth-texture.jpg");
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.5,
      metalness: 0.1,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    camera.position.z = 15;

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Add country borders
    const addCountryBorders = async () => {
      try {
        const response = await fetch("/data/countries.geojson");
        const geoJson = await response.json();

        const material = new THREE.LineBasicMaterial({
          color: 0x000000, // Changed to black
          transparent: true,
          opacity: 0.5,
        });

        const allPoints: THREE.Vector3[] = [];

        geoJson.features.forEach((feature: any) => {
          if (feature.geometry.type === "Polygon") {
            allPoints.push(
              ...getPointsFromPolygon(feature.geometry.coordinates[0])
            );
          } else if (feature.geometry.type === "MultiPolygon") {
            feature.geometry.coordinates.forEach((polygon: number[][][]) => {
              allPoints.push(...getPointsFromPolygon(polygon[0]));
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

    const getPointsFromPolygon = (coordinates: number[][]): THREE.Vector3[] => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i < coordinates.length; i++) {
        const coord = coordinates[i];
        const nextCoord = coordinates[(i + 1) % coordinates.length];
        points.push(latLonToVector3(coord[1], coord[0], earthRadius + 0.005)); // Slightly above the surface
        points.push(
          latLonToVector3(nextCoord[1], nextCoord[0], earthRadius + 0.005)
        ); // Slightly above the surface
      }
      return points;
    };

    // Helper function to convert latitude and longitude to 3D coordinates
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

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default EarthSimulation;
