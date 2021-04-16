"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var fs = require('fs');
var path = require('path');
var imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminPngquant = require('imagemin-pngquant');
var imageminGifsicle = require('imagemin-gifsicle');
var imageminSvgo = require('imagemin-svgo');
var currentFolder = './images/';
var compressionFolder = './compressionImages/';
var jpegOption = {
    quality: 50
};
var pngOption = {
    quality: [0.3, 0.5]
};
var gifOption = {
    colors: 128
};
var convertFileList = [];
var getFileType = function (path) {
    try {
        var stat = fs.statSync(path);
        switch (true) {
            case stat.isFile():
                return 'File';
            case stat.isDirectory():
                return 'Directory';
            default:
                return 'Other';
        }
    }
    catch (_e) {
        throw new Error('File type unknown.');
    }
};
var listFiles = function (dirPath) {
    var fileName = fs.readdirSync(dirPath);
    fileName.forEach(function (image) {
        var absPath = dirPath + "/" + image;
        switch (getFileType(absPath)) {
            case 'File':
                if (absPath.includes('.jpg') ||
                    absPath.includes('.jpeg') ||
                    absPath.includes('.png') ||
                    absPath.includes('.gif') ||
                    absPath.includes('.svg')) {
                    convertFileList.push(absPath);
                }
                break;
            case 'Directory':
                listFiles(absPath);
                break;
            default:
                break;
        }
    });
};
function searchFiles() {
    return new Promise(function (resolve, reject) {
        try {
            var dirPath = path.resolve(currentFolder);
            resolve(listFiles(dirPath));
        }
        catch (e) {
            reject(e);
        }
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchFiles()];
                case 1:
                    _a.sent();
                    imagemin(convertFileList, {
                        destination: compressionFolder,
                        plugins: [
                            imageminMozjpeg(jpegOption),
                            imageminPngquant(pngOption),
                            imageminGifsicle(gifOption),
                            imageminSvgo(),
                        ],
                    });
                    return [2 /*return*/];
            }
        });
    });
}
init();
//# sourceMappingURL=compressionImages.js.map