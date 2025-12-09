const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../');

const config = getDefaultConfig(projectRoot);

// 1. Watch the local SDK folder so changes update immediately
config.watchFolders = [workspaceRoot];

// 2. FORCE Metro to resolve 'react' and 'react-native' from the Example App only
config.resolver.extraNodeModules = {
  'react': path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  'firebase': path.resolve(projectRoot, 'node_modules/firebase'),
  '@firebase/app': path.resolve(projectRoot, 'node_modules/@firebase/app'),
  '@firebase/auth': path.resolve(projectRoot, 'node_modules/@firebase/auth'),
};

// 3. Tell Metro where to look for node_modules (prioritizing the app)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;