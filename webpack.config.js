const glob = require("glob");
const path = require("path");

module.exports = (env, arg) => {
  const entryPoints = glob.sync(`./src/**.js`).reduce(function (obj, el) {
    const entryPath = path.parse(el);
    let entryName = entryPath.name;
    obj[entryName] = el;
    return obj;
  }, {});

  return {
    entry: entryPoints,
    mode: arg.mode,
    output: {
      libraryTarget: "umd",
      library: "nibzbstx",
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
    },
  };
};
