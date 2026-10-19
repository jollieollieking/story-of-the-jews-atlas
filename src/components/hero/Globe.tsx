/**
 * The hero's WebGL globe. Loaded with React.lazy so three.js and React Three Fiber live in their
 * own chunk. Everything visual is hand-written shader work so the look stays restrained:
 * engraved-looking land dots, a warm fresnel rim, a faint graticule, softly glowing markers and
 * one gold arc from the Pale of Settlement to New York.
 */
import { useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  CAMERA_FOV,
  GLOBE_MARKERS,
  cameraDistance,
  globeLayout,
  lngLatToVec,
  loadLandMask,
  migrationArc,
  sampleLandDots,
  viewLonAt,
  type LandDots,
} from './globeGeo'

const DEG = Math.PI / 180
/** Dot spacing on the sphere. ~0.72° gives roughly 22k land dots. */
const DOT_SPACING = 0.72

export interface GlobeProps {
  /** False while the hero is off-screen or the tab is hidden: rendering stops completely. */
  active: boolean
  /** Reduced motion: no sway, no breathing, no travelling light. One static frame. */
  still: boolean
  /** Called once the land has been drawn, so the stage can cross-fade from the fallback. */
  onReady: () => void
  /** Called if the WebGL context is lost. */
  onContextLost: () => void
}

export default function Globe({ active, still, onReady, onContextLost }: GlobeProps) {
  const lostRef = useRef(onContextLost)
  useLayoutEffect(() => {
    lostRef.current = onContextLost
  })

  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={still ? 'demand' : active ? 'always' : 'never'}
      camera={{ fov: CAMERA_FOV, near: 0.1, far: 100, position: [0, 0, 6] }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor('#080b10', 1)
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          lostRef.current()
        })
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Scene still={still} onReady={onReady} />
    </Canvas>
  )
}

/* ---------------------------------------------------------------------------------------------- */

function Scene({ still, onReady }: { still: boolean; onReady: () => void }) {
  const size = useThree((s) => s.size)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const invalidate = useThree((s) => s.invalidate)
  const layout = useMemo(() => globeLayout(size.width, size.height), [size.width, size.height])

  // Place the camera so the unit sphere appears with radius `layout.r` px, then shift the lens
  // (setViewOffset) so it sits at (cx, cy) without the distortion of moving the globe off-axis.
  useLayoutEffect(() => {
    camera.position.set(0, 0, cameraDistance(layout, size.height))
    camera.lookAt(0, 0, 0)
    camera.setViewOffset(
      size.width,
      size.height,
      size.width / 2 - layout.cx,
      size.height / 2 - layout.cy,
      size.width,
      size.height,
    )
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, size.width, size.height, layout, invalidate])

  const [dots, setDots] = useState<LandDots | null>(null)
  useEffect(() => {
    let cancelled = false
    loadLandMask()
      .then((mask) => {
        if (!cancelled) setDots(sampleLandDots(mask, DOT_SPACING))
      })
      .catch(() => {
        /* Without the land data the globe still shows its sphere, graticule, markers and arc. */
        if (!cancelled) setDots({ positions: new Float32Array(), warmth: new Float32Array(), shade: new Float32Array(), count: 0 })
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Re-render once when switching between animated and still (frameloop "demand").
  useEffect(() => invalidate(), [still, dots, invalidate])

  const spin = useRef<THREE.Group>(null)
  const clock = useRef(0)
  const readyFired = useRef(false)
  const dotMaterial = useRef<THREE.ShaderMaterial>(null)
  const markerMaterial = useRef<THREE.ShaderMaterial>(null)
  const arcCore = useRef<THREE.ShaderMaterial>(null)
  const arcHalo = useRef<THREE.ShaderMaterial>(null)

  // All per-frame state lives here. useFrame only runs for frames that are actually rendered, so
  // when the hero is off-screen or the tab is hidden nothing is computed at all.
  useFrame((state, delta) => {
    // Our own clock, clamped, so resuming after a pause never causes a jump.
    if (!still) clock.current += Math.min(delta, 0.25)
    const t = still ? 0 : clock.current
    const dpr = state.viewport.dpr
    if (spin.current) spin.current.rotation.y = -viewLonAt(t, layout) * DEG

    const drawn = Math.min(1, Math.max(0, (t - 0.5) / 2.2))
    for (const m of [arcCore.current, arcHalo.current]) {
      setUniform(m, 'uTime', t)
      setUniform(m, 'uDraw', still ? 1 : 1 - Math.pow(1 - drawn, 3))
      setUniform(m, 'uTravel', still ? 0 : 1)
    }
    setUniform(markerMaterial.current, 'uTime', t)
    setUniform(markerMaterial.current, 'uSize', Math.max(16, layout.r * 0.075))
    setUniform(markerMaterial.current, 'uPixelRatio', dpr)
    // Dot diameter ≈ half the on-screen spacing between dots at the centre of the disc.
    setUniform(dotMaterial.current, 'uSize', Math.max(1.3, layout.r * DOT_SPACING * DEG * 0.5))
    setUniform(dotMaterial.current, 'uPixelRatio', dpr)

    if (dots && !readyFired.current) {
      readyFired.current = true
      // Fire after this frame has been presented.
      requestAnimationFrame(() => onReady())
    }
  })

  return (
    <group rotation={[layout.lat * DEG, 0, 0]}>
      <group ref={spin} rotation={[0, -viewLonAt(0, layout) * DEG, 0]}>
        <Planet />
        <Graticule />
        {dots && dots.count > 0 && <LandPoints dots={dots} materialRef={dotMaterial} />}
        <MigrationArc coreRef={arcCore} haloRef={arcHalo} />
        <Markers materialRef={markerMaterial} />
      </group>
      <Atmosphere />
    </group>
  )
}

type MaterialRef = RefObject<THREE.ShaderMaterial | null>

function setUniform(material: THREE.ShaderMaterial | null, name: string, value: number) {
  const u = material?.uniforms[name]
  if (u) u.value = value
}

/* ---------------------------------------------------------------------------------------------- */

const LIGHT_DIR = 'normalize(vec3(-0.55, 0.6, 0.62))'

function Planet() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vec3 n = normalize(vNormal);
            float light = dot(n, ${LIGHT_DIR});
            vec3 deep = vec3(0.016, 0.024, 0.040);
            vec3 lit = vec3(0.058, 0.080, 0.112);
            vec3 col = mix(deep, lit, smoothstep(-0.35, 1.0, light));
            float rim = pow(1.0 - max(dot(n, normalize(vView)), 0.0), 3.2);
            col += vec3(0.78, 0.64, 0.42) * rim * 0.22;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  )
  return (
    <mesh material={material} renderOrder={0}>
      <sphereGeometry args={[1, 96, 64]} />
    </mesh>
  )
}

function Atmosphere() {
  const R = 1.16
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uEdge: { value: Math.sqrt(1 - 1 / (R * R)) } },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uEdge;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            // Back faces only: 0 at the outer edge of the shell, uEdge where it meets the planet's limb.
            float f = clamp(-dot(normalize(vNormal), normalize(vView)) / uEdge, 0.0, 1.0);
            float glow = pow(f, 4.0);
            // Warmer and brighter on the lit side.
            float side = 0.5 + 0.5 * smoothstep(-0.4, 0.6, dot(normalize(vNormal), ${LIGHT_DIR}));
            vec3 col = mix(vec3(0.86, 0.72, 0.50), vec3(0.95, 0.91, 0.84), glow * 0.5);
            gl_FragColor = vec4(col * glow * 0.32 * side, 1.0);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [],
  )
  return (
    <mesh material={material} renderOrder={5}>
      <sphereGeometry args={[R, 96, 64]} />
    </mesh>
  )
}

function Graticule() {
  const geometry = useMemo(() => {
    const pts: number[] = []
    const r = 1.0015
    const push = (a: [number, number], b: [number, number]) => {
      pts.push(...lngLatToVec(a, r), ...lngLatToVec(b, r))
    }
    for (let lon = -180; lon < 180; lon += 15) {
      for (let lat = -80; lat < 80; lat += 2) push([lon, lat], [lon, lat + 2])
    }
    for (let lat = -75; lat <= 75; lat += 15) {
      for (let lon = -180; lon < 180; lon += 2) push([lon, lat], [lon + 2, lat])
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [])
  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#c7a46a', transparent: true, opacity: 0.075, depthWrite: false }),
    [],
  )
  return <lineSegments geometry={geometry} material={material} renderOrder={1} />
}

function LandPoints({ dots, materialRef }: { dots: LandDots; materialRef: MaterialRef }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const p = new Float32Array(dots.positions.length)
    for (let i = 0; i < p.length; i++) p[i] = dots.positions[i] * 1.003
    g.setAttribute('position', new THREE.BufferAttribute(p, 3))
    g.setAttribute('aWarm', new THREE.BufferAttribute(dots.warmth, 1))
    g.setAttribute('aShade', new THREE.BufferAttribute(dots.shade, 1))
    return g
  }, [dots])
  useEffect(() => () => geometry.dispose(), [geometry])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uSize: { value: 2 }, uPixelRatio: { value: 1 } },
        vertexShader: /* glsl */ `
          uniform float uSize;
          uniform float uPixelRatio;
          attribute float aWarm;
          attribute float aShade;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vec3 n = normalize((modelViewMatrix * vec4(position, 0.0)).xyz);
            float facing = dot(n, normalize(-mv.xyz));
            float light = dot(n, ${LIGHT_DIR});
            vec3 ivory = vec3(0.86, 0.83, 0.77);
            vec3 gold = vec3(0.90, 0.72, 0.42);
            vColor = mix(ivory, gold, aWarm * 0.85) * aShade * mix(0.42, 1.12, smoothstep(-0.45, 0.9, light));
            vAlpha = smoothstep(0.02, 0.38, facing) * mix(0.62, 0.95, aWarm);
            gl_PointSize = uSize * uPixelRatio * mix(0.55, 1.0, smoothstep(0.0, 0.6, facing));
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.28, d) * vAlpha;
            if (a < 0.01) discard;
            gl_FragColor = vec4(vColor, a);
          }
        `,
        transparent: true,
        depthWrite: false,
      }),
    [],
  )
  useImperativeHandle(materialRef, () => material, [material])
  useEffect(() => () => material.dispose(), [material])
  return <points geometry={geometry} material={material} renderOrder={2} />
}

function arcMaterial(strength: number, headBoost: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDraw: { value: 0 },
      uTravel: { value: 1 },
      uStrength: { value: strength },
      uHeadBoost: { value: headBoost },
    },
    vertexShader: /* glsl */ `
      varying float vU;
      void main() {
        vU = uv.x;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uDraw;
      uniform float uTravel;
      uniform float uStrength;
      uniform float uHeadBoost;
      varying float vU;
      void main() {
        if (vU > uDraw) discard;
        float ends = smoothstep(0.0, 0.04, vU) * smoothstep(1.0, 0.96, vU);
        // A slow light leaves the Pale every 9 seconds and fades as it reaches New York.
        float head = fract(uTime / 9.0) * 1.35 - 0.15;
        float behind = head - vU;
        float trail = behind >= 0.0 ? exp(-behind / 0.09) : exp(behind / 0.012);
        float light = trail * uTravel * uHeadBoost;
        vec3 gold = vec3(0.82, 0.66, 0.40);
        vec3 ivory = vec3(1.0, 0.94, 0.82);
        vec3 col = gold * uStrength + ivory * light;
        gl_FragColor = vec4(col * ends, 1.0);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
}

function MigrationArc({ coreRef, haloRef }: { coreRef: MaterialRef; haloRef: MaterialRef }) {
  const [core, halo] = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(migrationArc().map(([x, y, z]) => new THREE.Vector3(x, y, z)))
    return [new THREE.TubeGeometry(curve, 320, 0.0032, 8, false), new THREE.TubeGeometry(curve, 320, 0.011, 8, false)]
  }, [])

  const coreMaterial = useMemo(() => arcMaterial(0.85, 1.3), [])
  const haloMaterial = useMemo(() => arcMaterial(0.12, 0.28), [])
  useImperativeHandle(coreRef, () => coreMaterial, [coreMaterial])
  useImperativeHandle(haloRef, () => haloMaterial, [haloMaterial])

  return (
    <group renderOrder={3}>
      <mesh geometry={halo} material={haloMaterial} renderOrder={3} />
      <mesh geometry={core} material={coreMaterial} renderOrder={4} />
    </group>
  )
}

function Markers({ materialRef }: { materialRef: MaterialRef }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos: number[] = []
    const phase: number[] = []
    GLOBE_MARKERS.forEach((m, i) => {
      pos.push(...lngLatToVec(m.coordinates, 1.006))
      phase.push(i * 1.7)
    })
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('aPhase', new THREE.Float32BufferAttribute(phase, 1))
    return g
  }, [])
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uSize: { value: 20 }, uPixelRatio: { value: 1 } },
        vertexShader: /* glsl */ `
          uniform float uSize;
          uniform float uPixelRatio;
          uniform float uTime;
          attribute float aPhase;
          varying float vFacing;
          varying float vBreath;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vec3 n = normalize((modelViewMatrix * vec4(position, 0.0)).xyz);
            vFacing = smoothstep(0.05, 0.3, dot(n, normalize(-mv.xyz)));
            vBreath = 0.5 + 0.5 * sin(uTime * 0.9 + aPhase);
            gl_PointSize = uSize * uPixelRatio;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vFacing;
          varying float vBreath;
          void main() {
            float d = length(gl_PointCoord - 0.5) * 2.0;
            if (d > 1.0 || vFacing < 0.01) discard;
            float core = smoothstep(0.16, 0.06, d);
            float halo = exp(-d * d * 7.0) * (0.38 + 0.18 * vBreath);
            vec3 gold = vec3(0.90, 0.73, 0.45);
            vec3 ivory = vec3(1.0, 0.96, 0.88);
            vec3 col = gold * halo + ivory * core;
            gl_FragColor = vec4(col * vFacing, 1.0);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      }),
    [],
  )
  useImperativeHandle(materialRef, () => material, [material])
  return <points geometry={geometry} material={material} renderOrder={6} />
}
