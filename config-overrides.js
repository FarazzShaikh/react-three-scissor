const path = require("path");
const rewireReactHotLoader = require("react-app-rewire-hot-loader");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const {
  removeModuleScopePlugin,
  override,
  babelInclude,
  addWebpackAlias,
} = require("customize-cra");

module.exports = {
  paths: function (paths, env) {
    paths.appIndexJs = path.resolve(__dirname, "example/index.tsx");
    paths.appSrc = path.resolve(__dirname, "example");
    return paths;
  },

  webpack: override(
    removeModuleScopePlugin(), //
    babelInclude([
      path.resolve(__dirname, "src"), //
      path.resolve(__dirname, "example"), //
    ]),
    (config, env) => {
      config = rewireReactHotLoader(config, env);

      return config;
    }
  ),
};
