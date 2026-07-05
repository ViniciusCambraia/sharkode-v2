import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, useGLTF } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRapier,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { badgeHitZone, createBadgeTexture, createStrapTexture } from './badgeTexture';

export type BadgeAction = 'whatsapp' | 'save';

extend({ MeshLineGeometry, MeshLineMaterial });

const GLB_URL = '/lanyard-card.glb';
useGLTF.preload(GLB_URL);

interface LanyardProps {
  /** Horizontal hang position (world units). 0.9 = right of copy (desktop), 0 = centered (mobile). */
  offsetX?: number;
  /** Rope anchor height — raise it on mobile so the card hangs in the upper half, clear of the copy. */
  offsetY?: number;
  /** Camera distance — pull back on narrow screens so the card fits. */
  camZ?: number;
  /** Fired when a printed card button is tapped (not dragged). */
  onAction?: (action: BadgeAction) => void;
}

/** Draggable 3D lanyard badge — physics rope + Sharkode card (real GLB clip). */
export default function Lanyard({ offsetX = 0.9, offsetY = 4.4, camZ = 9, onAction }: LanyardProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, camZ], fov: 20 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
    >
      <ambientLight intensity={Math.PI * 0.7} />
      <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <DeviceSwing />
        <Band offsetX={offsetX} offsetY={offsetY} onAction={onAction} />
      </Physics>
      <Environment blur={0.75}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={6} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}

/**
 * Shake-the-phone inertia: gravity stays screen-down at all times (a still
 * phone = a badge hanging quietly, whatever the grip), and the accelerometer
 * applies inertia impulses — move the phone right and the badge lags left,
 * exactly like a real card on a real lanyard. Hand tremor is filtered out.
 * iOS needs motion permission (page-level "Ativar movimento" button);
 * devices without an accelerometer simply never receive events.
 */
function DeviceSwing() {
  const { world } = useRapier();

  useEffect(() => {
    const THRESHOLD = 0.7; // m/s² — below this it's hand tremor, ignore
    const CAP = 14;        // m/s² — cap violent shakes so it never goes frantic
    const SCALE = 40 / 9.81; // world runs on gravity 40, not 9.81

    const onMotion = (e: DeviceMotionEvent) => {
      const a = e.acceleration; // gravity already excluded
      if (!a || a.x == null || a.y == null) return;
      let ax = a.x;
      let ay = a.y;
      const mag = Math.hypot(ax, ay);
      if (mag < THRESHOLD) return;
      if (mag > CAP) {
        ax = (ax / mag) * CAP;
        ay = (ay / mag) * CAP;
      }
      const dt = e.interval && e.interval > 0 && e.interval < 0.1 ? e.interval : 0.016;
      // Pseudo-force in the phone's frame: opposite to the phone's motion
      const fx = -ax * SCALE;
      const fy = -ay * SCALE;
      world.bodies.forEach((body) => {
        if (body.isDynamic()) {
          const m = body.mass();
          body.applyImpulse({ x: fx * m * dt, y: fy * m * dt, z: 0 }, true);
        }
      });
    };

    // Always attached — on iOS events only flow after permission is granted.
    window.addEventListener('devicemotion', onMotion);
    return () => window.removeEventListener('devicemotion', onMotion);
  }, [world]);

  return null;
}

function Band({
  offsetX = 0.9,
  offsetY = 4.4,
  onAction,
}: {
  offsetX?: number;
  offsetY?: number;
  onAction?: (action: BadgeAction) => void;
}) {
  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  // Tap-vs-drag: remember where/when the pointer went down and which printed
  // button (if any) was under it — fire only on a quick, still release.
  const tap = useRef<{ t: number; x: number; y: number; zone: BadgeAction | null }>({
    t: 0, x: 0, y: 0, zone: null,
  });

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const { width, height } = useThree((s) => s.size);
  const bandMatArgs = useMemo(
    () => [{ resolution: new THREE.Vector2(width, height) }] as const,
    [width, height],
  );

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  // Real card + clip/clamp geometry from the GLB; card face uses our texture
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { nodes, materials } = useGLTF(GLB_URL) as any;
  const [texture] = useState(() => {
    const t = createBadgeTexture();
    t.flipY = false; // GLTF UV convention
    return t;
  });
  const [strap] = useState(() => createStrapTexture());

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((r) => {
        const rc = r.current as RapierRigidBody & { lerped?: THREE.Vector3 };
        if (!rc.lerped) rc.lerped = new THREE.Vector3().copy(rc.translation());
        const dist = Math.max(0.1, Math.min(1, rc.lerped.distanceTo(rc.translation())));
        rc.lerped.lerp(rc.translation(), delta * (10 + dist * 40));
      });
      curve.points[0].copy(j3.current!.translation());
      curve.points[0].y += 0.2; // lift strap start above clip geometry to kill z-fighting
      curve.points[1].copy((j2.current as RapierRigidBody & { lerped: THREE.Vector3 }).lerped);
      curve.points[2].copy((j1.current as RapierRigidBody & { lerped: THREE.Vector3 }).lerped);
      curve.points[3].copy(fixed.current.translation());
      (band.current!.geometry as THREE.BufferGeometry & { setPoints: (p: THREE.Vector3[]) => void }).setPoints(
        curve.getPoints(32),
      );
      // Let the card spin freely (drag/fling) but gently steer yaw back so it
      // settles facing the camera. Gravity self-rights roll since COM hangs below
      // the anchor; the on-axis camera keeps it visually straight at rest.
      ang.copy(card.current!.angvel());
      rot.copy(card.current!.rotation());
      card.current!.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  curve.curveType = 'chordal';

  return (
    <>
      <group position={[offsetX, offsetY, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        {/* Entrance: the chain spawns bunched at the anchor with the rope
            slack, so on load the badge DROPS, the strap unfurls and catches,
            and the card bounces into its hang — real physics, no fake tween.
            Small z offsets keep the falling card clear of the rope colliders. */}
        <RigidBody position={[0, -0.2, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -0.35, 0.05]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -0.5, 0.1]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0, -1.95, 0.2]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
              // Quick + still release on a printed button = a real button press
              const t = tap.current;
              const moved = Math.hypot(e.clientX - t.x, e.clientY - t.y);
              if (t.zone && onAction && performance.now() - t.t < 350 && moved < 14) {
                onAction(t.zone);
              }
            }}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              tap.current = {
                t: performance.now(),
                x: e.clientX,
                y: e.clientY,
                zone: e.uv ? badgeHitZone(e.uv.x, e.uv.y) : null,
              };
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={texture}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={bandMatArgs}
          color="white"
          useMap={1}
          map={strap}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
