import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
// import ViteComponents from 'vite-plugin-components'
import WindiCSS from 'vite-plugin-windicss'

export default {
  plugins: [
    Vue(),
    // ViteComponents(),
    WindiCSS(),
  ],
}
