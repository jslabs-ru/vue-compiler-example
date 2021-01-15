const compileVueFile = require("./compileVueFile");
const fs = require("fs");
const path = require("path");
const readVue = name => fs.readFileSync(path.resolve(__dirname, name), "utf-8");

const VUE_DIR = path.resolve(__dirname, "vue");
const RESULT_DIR = path.resolve(__dirname, "result");

// compile a vue file from `vue dir` to `result dir`
function createCase(name, opts) {
  const filename = path.resolve(VUE_DIR, name);
  const result = compileVueFile(readVue(filename), filename, opts);
  fs.writeFileSync(
    path.resolve(RESULT_DIR, name.replace(/\.vue$/, ".js.snap")),
    result.code
  );
}

// simple vue file compile
createCase("a.vue");

// vue file with TS lang
// use third runtime
createCase("b.vue", { withTs: true, withRuntimeImport: true });

// vue file with TS lang
// ❗️ but without TS precompile. the result is wrong
createCase("c.vue");
