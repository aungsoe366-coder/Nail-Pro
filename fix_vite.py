with open('vite.config.ts', 'r') as f:
    text = f.read()

text = text.replace("chunkSizeWarningLimit: 2000", """chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            charts: ['recharts'],
            calendar: ['react-big-calendar', 'moment', 'date-fns'],
            motion: ['motion'],
          }
        }
      }""")

with open('vite.config.ts', 'w') as f:
    f.write(text)
print("Updated vite.config.ts")
