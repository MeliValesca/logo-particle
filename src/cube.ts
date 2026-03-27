import {Dimensions} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export const GRID = 15;
export const CUBE_VIEW_SIZE = SCREEN_WIDTH - 40;
export const PARTICLE_SIZE = 7;

export const COLORS = [
  '#6C5CE7', '#A29BFE', '#74B9FF', '#55EFC4', '#00B894',
  '#FDCB6E', '#E17055', '#FF7675', '#FD79A8', '#81ECEC',
];

export type Particle = {
  px: number;
  py: number;
  depth: number;
  color: string;
  dist: number;
  size: number;
  face: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
};

// Rotate around Y axis, then tilt on X axis for a nice 3/4 view
function rotateY(x: number, z: number, angle: number) {
  return {
    x: x * Math.cos(angle) - z * Math.sin(angle),
    z: x * Math.sin(angle) + z * Math.cos(angle),
  };
}

function rotateX(y: number, z: number, angle: number) {
  return {
    y: y * Math.cos(angle) - z * Math.sin(angle),
    z: y * Math.sin(angle) + z * Math.cos(angle),
  };
}

// Perspective projection
function projectPoint(
  x: number,
  y: number,
  z: number,
  fov: number,
  viewDist: number,
) {
  const scale = fov / (fov + z + viewDist);
  return {
    px: x * scale,
    py: y * scale,
    scale,
    depth: z,
  };
}

function getFace(
  gx: number,
  gy: number,
  gz: number,
  max: number,
): Particle['face'] {
  if (gz === 0) return 'front';
  if (gz === max) return 'back';
  if (gx === 0) return 'left';
  if (gx === max) return 'right';
  if (gy === 0) return 'top';
  return 'bottom';
}

export function buildParticles(): Particle[] {
  const particles: Particle[] = [];
  const half = (GRID - 1) / 2;
  const spacing = 18;
  const yAngle = 0.62; // ~35 degrees
  const xAngle = 0.42; // ~24 degrees
  const fov = 400;
  const viewDist = 200;

  for (let gx = 0; gx < GRID; gx++) {
    for (let gy = 0; gy < GRID; gy++) {
      for (let gz = 0; gz < GRID; gz++) {
        const isFace =
          gx === 0 || gx === GRID - 1 ||
          gy === 0 || gy === GRID - 1 ||
          gz === 0 || gz === GRID - 1;
        if (!isFace) continue;

        const nx = (gx - half) * spacing;
        const ny = (gy - half) * spacing;
        const nz = (gz - half) * spacing;

        // Rotate for 3D view
        const ry = rotateY(nx, nz, yAngle);
        const rx = rotateX(ny, ry.z, xAngle);

        const {px, py, scale, depth} = projectPoint(
          ry.x,
          rx.y,
          rx.z,
          fov,
          viewDist,
        );

        const dist = Math.sqrt(
          (gx - half) ** 2 + (gy - half) ** 2 + (gz - half) ** 2,
        );

        const face = getFace(gx, gy, gz, GRID - 1);

        // Each face gets its own color
        const FACE_COLORS: Record<string, string> = {
          front: '#6C5CE7',  // purple
          back: '#00B894',   // green
          left: '#E17055',   // coral
          right: '#74B9FF',  // blue
          top: '#FDCB6E',    // yellow
          bottom: '#FD79A8', // pink
        };
        // Size varies by depth for extra perspective
        const depthSize = PARTICLE_SIZE * scale * 1.2;

        particles.push({
          px: px + CUBE_VIEW_SIZE / 2,
          py: py + CUBE_VIEW_SIZE / 2,
          depth,
          color: FACE_COLORS[face],
          dist,
          size: Math.max(3, depthSize),
          face,
        });
      }
    }
  }

  // Sort back-to-front
  particles.sort((a, b) => a.depth - b.depth);
  return particles;
}
