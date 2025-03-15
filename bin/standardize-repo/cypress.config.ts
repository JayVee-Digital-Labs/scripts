import { defineConfig } from 'cypress';
import { addMatchImageSnapshotPlugin } from '@simonsmith/cypress-image-snapshot/plugin'

const runVR = process.env.RUN_VR === 'true';

export default defineConfig({
  e2e: {
    viewportWidth: 1000,
    viewportHeight: 660,
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    specPattern: runVR ? '**/*.vr.cy.tsx' : '**/*.cy.tsx',
    excludeSpecPattern: runVR ? '' : '**/*.vr.cy.tsx',
    setupNodeEvents(on) {
      addMatchImageSnapshotPlugin(on);
    },
  },
});
