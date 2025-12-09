"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordInput = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const PasswordInput = ({ styles, ...props }) => {
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    return (react_1.default.createElement(react_native_1.View, { style: [defaultStyles.container, styles?.inputContainer] },
        react_1.default.createElement(react_native_1.TextInput, { ...props, style: [defaultStyles.input, styles?.input, { flex: 1, borderWidth: 0, marginBottom: 0 }], secureTextEntry: !isVisible, placeholderTextColor: "#999" }),
        react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: () => setIsVisible(!isVisible), style: defaultStyles.iconContainer },
            react_1.default.createElement(react_native_1.Text, { style: [defaultStyles.iconText, styles?.eyeIcon] }, isVisible ? "👁️‍🗨️" : "👁️"))));
};
exports.PasswordInput = PasswordInput;
const defaultStyles = react_native_1.StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 12,
        overflow: 'hidden',
    },
    input: {
        padding: 15,
        fontSize: 16,
        backgroundColor: 'transparent',
    },
    iconContainer: {
        padding: 15,
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 18,
    }
});
