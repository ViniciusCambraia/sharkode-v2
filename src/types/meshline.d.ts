import { type ThreeElement } from '@react-three/fiber';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

// Register meshline's custom elements with R3F's JSX namespace so
// <meshLineGeometry /> and <meshLineMaterial /> type-check.
declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}
