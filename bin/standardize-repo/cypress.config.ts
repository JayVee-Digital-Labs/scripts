import { defineConfig } from 'cypress';
import { addMatchImageSnapshotPlugin } from '@simonsmith/cypress-image-snapshot/plugin';

const runVR = process.env.RUN_VR === 'true';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1000,
    viewportHeight: 660,
    specPattern: runVR ? '**/*.vr.cy.{ts,tsx}' : '**/*.cy.{ts,tsx}',
    excludeSpecPattern: runVR ? '' : '**/*.vr.cy.{ts,tsx}',
    setupNodeEvents(on) {
      addMatchImageSnapshotPlugin(on);
    }
  }
});
