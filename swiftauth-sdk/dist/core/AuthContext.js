"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthContext = void 0;
const react_1 = __importDefault(require("react"));
// Create the context with a default undefined value
// We force the type here to avoid checking for 'undefined' everywhere in the app
exports.AuthContext = react_1.default.createContext(undefined);
