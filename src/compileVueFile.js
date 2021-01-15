const { assemble, createDefaultCompiler } = require("@vue/component-compiler");
const ts = require("typescript");

function compileVueFile(content, filename, opts = {}) {
  const { withTs, withRuntimeImport } = {
    // compile TypeScript
    withTs: false,
    // use third runtime lib
    withRuntimeImport: false,
    ...opts
  };
  const compiler = createDefaultCompiler();
  const descriptor = compiler.compileToDescriptor(filename, content);

  // assemble can only resolve js by default
  // use TS precompile to support
  if (withTs) {
    descriptor.script.code = ts.transpile(
      descriptor.script.code,
      {
        // set tsconfig options
        target: ts.ScriptTarget.ES2015,
        module: ts.ModuleKind.ESNext,
        importHelpers: true
      },
      filename
    );
  }

  const result = assemble(
    compiler,
    filename,
    descriptor,
    withRuntimeImport
      ? {
          normalizer: "~vue-runtime-helpers/dist/normalize-component.js",
          styleInjector: "~vue-runtime-helpers/dist/inject-style/browser.js",
          styleInjectorSSR: "~vue-runtime-helpers/dist/inject-style/server.js"
        }
      : {}
  );

  return result;
}

module.exports = compileVueFile;
