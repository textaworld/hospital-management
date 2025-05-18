import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
