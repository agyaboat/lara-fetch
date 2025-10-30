export default [
  // esm + cjs
  {
    input: 'src/index.js',
    output: [
      { file: 'dist/index.esm.js', format: 'esm' },
      { file: 'dist/index.cjs.js', format: 'cjs' },
    ]
  },
  // umd
  {
    input: 'src/umd.js',
    output: {
      name: 'laraFetch',
      file: 'dist/index.umd.js',
      format: 'umd',
      exports: 'default', // only one export
    }
  }
];
