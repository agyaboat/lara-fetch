export default {
  input: 'src/index.js',   // your entry file
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm'        // for modern bundlers like Vite, Next.js, etc.
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs'        // for Node.js require() consumers
    }
  ]
};
