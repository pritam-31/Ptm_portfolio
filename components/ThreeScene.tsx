'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function seededValue(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

function FloatingWireframes() {
  const groupRef = useRef<THREE.Group>(null)
  const cubes = useMemo(() => {
    return Array.from({ length: 10 }, (_, index) => {
      const xSeed = seededValue(index + 41)
      const ySeed = seededValue(index + 71)
      const zSeed = seededValue(index + 91)

      return {
        position: [(xSeed - 0.5) * 11, (ySeed - 0.5) * 5.8, -1.5 - zSeed * 4] as [number, number, number],
        size: 0.22 + seededValue(index + 121) * 0.35,
        color: index % 3 === 0 ? '#7c3aed' : '#0ea5e9',
        speed: 0.45 + index * 0.04,
      }
    })
  }, [])
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {cubes.map((cube, index) => (
        <Float key={index} speed={cube.speed} rotationIntensity={0.35} floatIntensity={0.28}>
          <mesh position={cube.position}>
            <boxGeometry args={[cube.size, cube.size, cube.size]} />
            <meshStandardMaterial
              color={cube.color}
              emissive={cube.color}
              emissiveIntensity={0.45}
              transparent
              opacity={0.54}
              wireframe={true}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function Web3Grid() {
  const groupRef = useRef<THREE.Group>(null)
  const points = useMemo(() => {
    return Array.from({ length: 56 }, (_, index) => {
      const xSeed = seededValue(index + 1)
      const ySeed = seededValue(index + 101)
      const zSeed = seededValue(index + 201)
      const sizeSeed = seededValue(index + 301)

      return {
        x: (xSeed - 0.5) * 11,
        y: (ySeed - 0.5) * 7,
        z: -2 - zSeed * 5,
        size: 0.018 + sizeSeed * 0.03,
        color: index % 4 === 0 ? '#22d3ee' : '#3b82f6',
      }
    })
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.04
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      <gridHelper args={[14, 14, '#1d4ed8', '#1e3a8a']} position={[0, -2.4, -3]} rotation={[0.92, 0, 0]} />
      {points.map((point, index) => (
        <mesh key={index} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[point.size, 12, 12]} />
          <meshBasicMaterial color={point.color} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  )
}

export default function ThreeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 48 }} className="w-full h-full">
      <ambientLight intensity={0.42} />
      <directionalLight position={[8, 8, 8]} intensity={0.9} />
      <pointLight position={[-6, -4, 2]} intensity={0.8} color="#22d3ee" />
      <Stars radius={90} depth={48} count={2800} factor={3.2} saturation={0} fade speed={0.8} />
      <Web3Grid />
      <FloatingWireframes />
    </Canvas>
  )
}
