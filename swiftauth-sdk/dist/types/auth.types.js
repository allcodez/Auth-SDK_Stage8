"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthStatus = void 0;
var AuthStatus;
(function (AuthStatus) {
    AuthStatus["AUTHENTICATED"] = "AUTHENTICATED";
    AuthStatus["UNAUTHENTICATED"] = "UNAUTHENTICATED";
    AuthStatus["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    AuthStatus["LOADING"] = "LOADING";
})(AuthStatus || (exports.AuthStatus = AuthStatus = {}));
