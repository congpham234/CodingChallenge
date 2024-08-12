// Map definition with correct syntax

export enum Stage {
  ALPHA = 'alpha',
  PROD = 'prod',
}

export const ALLOW_ORIGIN_STAGE_MAP = new Map<string, string[]>([
  [
    Stage.ALPHA,
    ['http://localhost:3000'],
  ],
]);
