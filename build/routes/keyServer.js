"use strict";
/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
module.exports = function serveKeyFiles() {
    return ({ params }, res, next) => {
        const file = params.file;
        if (!file.includes('/')) {
            res.sendFile(path.resolve('encryptionkeys/', file));
        }
        else {
            res.status(403);
            next(new Error('File names cannot contain forward slashes!'));
        }
    };
};
//# sourceMappingURL=keyServer.js.map