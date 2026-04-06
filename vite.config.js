import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        work: resolve(__dirname, 'work.html'),
        experience: resolve(__dirname, 'experience.html'),
        features: resolve(__dirname, 'features.html'),
        blog: resolve(__dirname, 'blog.html'),
        post: resolve(__dirname, 'post.html'),
        admin: resolve(__dirname, 'admin.html'),
        editor: resolve(__dirname, 'editor.html'),
        cvDownload: resolve(__dirname, 'cv-download.html'),
      },
    },
  },
});
