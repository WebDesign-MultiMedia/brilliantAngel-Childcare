import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

// Draw a letter onto a canvas so blocks need no external font/texture fetch.
function makeFaceTexture(char, bg, fg) {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = bg;
  g.fillRect(0, 0, size, size);
  // subtle wood grain
  g.globalAlpha = 0.08;
  g.strokeStyle = '#7a4b1c';
  for (let i = 0; i < 14; i++) {
    g.lineWidth = 1 + (i % 3);
    g.beginPath();
    const y = 10 + i * 18 + Math.sin(i) * 4;
    g.moveTo(0, y);
    g.bezierCurveTo(size * 0.3, y + 6, size * 0.6, y - 6, size, y + 3);
    g.stroke();
  }
  g.globalAlpha = 1;
  // inset frame
  g.strokeStyle = fg;
  g.lineWidth = 10;
  g.strokeRect(22, 22, size - 44, size - 44);
  // character
  g.fillStyle = fg;
  g.font = '700 150px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(char, size / 2, size / 2 + 10);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function starShape(outer = 1, inner = 0.48, points = 5) {
  const s = new THREE.Shape();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    i === 0 ? s.moveTo(x, y) : s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

/* ------------------------------------------------------------------ */
/* Scene pieces                                                        */
/* ------------------------------------------------------------------ */

function ToyBlock({ position, faces, color, ink, speed = 0.3, scale = 1 }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const materials = useMemo(() => {
    // Box face order: +x, -x, +y, -y, +z, -z
    const order = [faces[1], faces[2], faces[3] ?? faces[0], faces[0], faces[0], faces[2]];
    return order.map((ch) => new THREE.MeshStandardMaterial({ map: makeFaceTexture(ch, color, ink), roughness: 0.65 }));
  }, [faces, color, ink]);
  useEffect(
    () => () =>
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      }),
    [materials],
  );

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * speed * (hovered ? 3 : 1);
    ref.current.rotation.x += dt * speed * 0.35;
    const s = THREE.MathUtils.lerp(ref.current.scale.x, scale * (hovered ? 1.15 : 1), 0.12);
    ref.current.scale.setScalar(s);
  });

  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.1}>
      <mesh
        ref={ref}
        position={position}
        material={materials}
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = '';
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
    </Float>
  );
}

function Cloud({ position, scale = 1, color = '#ffffff', speed = 0.15 }) {
  const ref = useRef();
  const start = position[0];
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.x = start + Math.sin(clock.elapsedTime * speed) * 0.6;
  });
  const puffs = [
    [0, 0, 0, 0.62],
    [0.62, -0.08, 0.05, 0.48],
    [-0.62, -0.1, 0, 0.46],
    [0.28, 0.32, -0.05, 0.42],
    [-0.28, 0.26, 0.05, 0.4],
    [1.05, -0.18, 0, 0.3],
    [-1.02, -0.2, 0, 0.3],
  ];
  return (
    <group ref={ref} position={position} scale={scale}>
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 24, 24]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function AngelStar({ burst, onClick }) {
  const group = useRef();
  const star = useRef();
  const halo = useRef();
  const spin = useRef(0);
  const [hovered, setHovered] = useState(false);
  const geom = useMemo(
    () =>
      new THREE.ExtrudeGeometry(starShape(1, 0.5), {
        depth: 0.32,
        bevelEnabled: true,
        bevelThickness: 0.14,
        bevelSize: 0.1,
        bevelSegments: 6,
      }).center(),
    [],
  );

  // Each click adds a full extra spin.
  useEffect(() => {
    if (burst) spin.current += Math.PI * 2;
  }, [burst]);

  useFrame(({ pointer, clock }, dt) => {
    if (!group.current) return;
    // Lean toward the cursor.
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.6, 0.06);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.4, 0.06);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, pointer.x * 0.25, 0.05);
    // Burst spin + gentle idle wobble.
    const target = spin.current + Math.sin(clock.elapsedTime * 0.8) * 0.2;
    star.current.rotation.y = THREE.MathUtils.lerp(star.current.rotation.y, target, Math.min(1, dt * 3));
    const s = THREE.MathUtils.lerp(star.current.scale.x, hovered ? 1.12 : 1, 0.1);
    star.current.scale.setScalar(s);
    halo.current.rotation.z += dt * 0.6;
    halo.current.material.emissiveIntensity = 0.7 + Math.sin(clock.elapsedTime * 2.2) * 0.25;
  });

  return (
    <group ref={group} position={[0, 0.35, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
        <mesh
          ref={star}
          geometry={geom}
          castShadow
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = '';
          }}
        >
          <meshStandardMaterial
            color="#FFD166"
            emissive="#FFB703"
            emissiveIntensity={hovered ? 0.55 : 0.32}
            metalness={0.35}
            roughness={0.25}
          />
        </mesh>
        <mesh ref={halo} position={[0, 1.45, 0]} rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[0.62, 0.075, 20, 64]} />
          <meshStandardMaterial color="#FFE08A" emissive="#FFD166" emissiveIntensity={0.8} roughness={0.3} />
        </mesh>
        {/* soft glow disc behind the star */}
        <mesh position={[0, 0, -0.45]}>
          <circleGeometry args={[1.7, 48]} />
          <meshBasicMaterial color="#FFF6DA" transparent opacity={0.7} depthWrite={false} toneMapped={false} />
        </mesh>
      </Float>
    </group>
  );
}

function Rig() {
  // Subtle camera parallax for depth.
  useFrame(({ camera, pointer }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.6, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.4 + pointer.y * 0.35, 0.03);
    camera.lookAt(0, 0.2, 0);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Canvas                                                              */
/* ------------------------------------------------------------------ */

export default function Scene3D({ active = true, label }) {
  const [burst, setBurst] = useState(0);

  return (
    <Canvas
      role="img"
      aria-label={label}
      shadows
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0.4, 7.8], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.85} />
      <hemisphereLight args={['#ffffff', '#FFE3D9', 0.6]} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={20}
      />
      <pointLight position={[0, 1, 2.5]} intensity={6} color="#FFD166" distance={6} />

      <Rig />

      <Cloud position={[-2.6, 2.1, -2]} scale={0.9} color="#ffffff" speed={0.18} />
      <Cloud position={[2.7, 2.4, -2.6]} scale={1.05} color="#E6F4FF" speed={0.13} />
      <Cloud position={[3.0, -0.4, -3.2]} scale={0.7} color="#FFF4F0" speed={0.21} />
      <Cloud position={[-3.2, -0.2, -3.5]} scale={0.65} color="#EAFBEF" speed={0.16} />

      <AngelStar burst={burst} onClick={() => setBurst((b) => b + 1)} />

      <ToyBlock position={[-1.75, -0.95, 0.5]} faces={['A', 'B', 'C', '1']} color="#7CC6FE" ink="#1E293B" speed={0.35} scale={0.95} />
      <ToyBlock position={[1.8, -0.9, 0.3]} faces={['1', '2', '3', 'B']} color="#FF9E80" ink="#1E293B" speed={-0.3} scale={0.9} />
      <ToyBlock position={[-0.7, -1.6, 1.4]} faces={['C', 'A', '★', '4']} color="#80ED99" ink="#1E293B" speed={0.25} scale={0.62} />
      <ToyBlock position={[0.95, -1.65, 1.5]} faces={['5', 'A', 'B', 'C']} color="#FFD166" ink="#1E293B" speed={-0.4} scale={0.58} />

      <Sparkles
        key={burst}
        count={burst ? 70 : 40}
        scale={[6, 4, 3]}
        size={burst ? 5 : 3}
        speed={burst ? 1.2 : 0.35}
        color="#FFD166"
        opacity={0.9}
      />

      <ContactShadows position={[0, -2.45, 0]} opacity={0.25} scale={12} blur={2.6} far={5} color="#1E293B" />
    </Canvas>
  );
}
