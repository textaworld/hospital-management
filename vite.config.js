import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],

//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://hospital-management-tnwh.onrender.com',
//         changeOrigin: true,
//       },
//     },
//   },
// })
