#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var password_prompt_1 = __importDefault(require("password-prompt"));
var fs_extra_1 = require("fs-extra");
var crypto_random_string_1 = __importDefault(require("crypto-random-string"));
var path_1 = require("path");
var rimraf_1 = __importDefault(require("rimraf"));
function allFiles(root, filenames) {
    if (root === void 0) { root = "."; }
    if (filenames === void 0) { filenames = []; }
    return __awaiter(this, void 0, void 0, function () {
        var files, _i, files_1, file, stats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_extra_1.readdir(root)];
                case 1:
                    files = _a.sent();
                    _i = 0, files_1 = files;
                    _a.label = 2;
                case 2:
                    if (!(_i < files_1.length)) return [3 /*break*/, 7];
                    file = files_1[_i];
                    return [4 /*yield*/, fs_extra_1.stat(path_1.join(root, file))];
                case 3:
                    stats = _a.sent();
                    if (!stats.isDirectory()) return [3 /*break*/, 5];
                    return [4 /*yield*/, allFiles(path_1.join(root, file), filenames)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    filenames.push(path_1.join(root, file));
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/, filenames];
            }
        });
    });
}
function encrypt() {
    return __awaiter(this, void 0, void 0, function () {
        var password, key, files, _i, files_2, filename, data, payload, iv, cipher, encryptedData, _loop_1, _a, _b, dir;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, password_prompt_1.default("Password: ", { method: "hide" })];
                case 1:
                    password = _c.sent();
                    if (!password.trim()) {
                        console.log("no password given");
                        process.exit(1);
                    }
                    key = crypto_1.scryptSync(password, "", 32);
                    return [4 /*yield*/, allFiles()];
                case 2:
                    files = _c.sent();
                    _i = 0, files_2 = files;
                    _c.label = 3;
                case 3:
                    if (!(_i < files_2.length)) return [3 /*break*/, 8];
                    filename = files_2[_i];
                    return [4 /*yield*/, fs_extra_1.readFile(filename)];
                case 4:
                    data = _c.sent();
                    payload = {
                        filename: filename,
                        data: data.toString("base64"),
                    };
                    iv = crypto_random_string_1.default(16);
                    cipher = crypto_1.createCipheriv("aes-256-cbc", key, iv);
                    encryptedData = Buffer.concat([
                        cipher.update(JSON.stringify(payload)),
                        cipher.final(),
                    ]);
                    return [4 /*yield*/, fs_extra_1.writeFile(iv, encryptedData)];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, fs_extra_1.remove(filename)];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8:
                    _loop_1 = function (dir) {
                        var stats;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fs_extra_1.stat(dir)];
                                case 1:
                                    stats = _a.sent();
                                    if (stats.isDirectory()) {
                                        new Promise(function (resolve) { return rimraf_1.default(dir, {}, resolve); });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a = 0;
                    return [4 /*yield*/, fs_extra_1.readdir(".")];
                case 9:
                    _b = _c.sent();
                    _c.label = 10;
                case 10:
                    if (!(_a < _b.length)) return [3 /*break*/, 13];
                    dir = _b[_a];
                    return [5 /*yield**/, _loop_1(dir)];
                case 11:
                    _c.sent();
                    _c.label = 12;
                case 12:
                    _a++;
                    return [3 /*break*/, 10];
                case 13: return [2 /*return*/];
            }
        });
    });
}
encrypt()
    .then(function () { return console.log("all done"); })
    .catch(function (e) {
    console.error(e.stack);
});
