import pluginBabel from '@rolldown/plugin-babel';
import { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: true,
  css: { inject: true },
  exports: true,
  sourcemap: true,
  platform: 'browser',
  plugins: [
    pluginBabel({
      presets: [reactCompilerPreset()],
    }),
  ],
});
