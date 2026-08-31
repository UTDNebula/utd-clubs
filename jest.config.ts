import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  extensionsToTreatAsEsm: ['.ts'],
  coverageProvider: 'v8',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: {
          rootDir: '.',
        },
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  detectOpenHandles: true,
  forceExit: true,
  testPathIgnorePatterns: ['<rootDir>/src/nebula-library'],
};

export default config;
