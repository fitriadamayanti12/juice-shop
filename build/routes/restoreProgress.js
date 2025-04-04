"use strict";
/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Hashids = require("hashids/cjs");
const datacache_1 = require("../data/datacache");
const challengeUtils = require('../lib/challengeUtils');
const hashidsAlphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const hashidRegexp = /^[a-zA-Z0-9]+$/;
const invalidContinueCode = 'Invalid continue code.';
module.exports.restoreProgress = function restoreProgress() {
    return ({ params }, res) => {
        const hashids = new Hashids('this is my salt', 60, hashidsAlphabet);
        const continueCode = params.continueCode;
        if (!hashidRegexp.test(continueCode)) {
            return res.status(404).send(invalidContinueCode);
        }
        const ids = hashids.decode(continueCode);
        if (challengeUtils.notSolved(datacache_1.challenges.continueCodeChallenge) && ids.includes(999)) {
            challengeUtils.solve(datacache_1.challenges.continueCodeChallenge);
            res.end();
        }
        else if (ids.length > 0) {
            for (const name in datacache_1.challenges) {
                if (Object.prototype.hasOwnProperty.call(datacache_1.challenges, name)) {
                    if (ids.includes(datacache_1.challenges[name].id)) {
                        challengeUtils.solve(datacache_1.challenges[name], true);
                    }
                }
            }
            res.json({ data: ids.length + ' solved challenges have been restored.' });
        }
        else {
            res.status(404).send(invalidContinueCode);
        }
    };
};
module.exports.restoreProgressFindIt = function restoreProgressFindIt() {
    return async ({ params }, res) => {
        const hashids = new Hashids('this is the salt for findIt challenges', 60, hashidsAlphabet);
        const continueCodeFindIt = params.continueCode;
        if (!hashidRegexp.test(continueCodeFindIt)) {
            return res.status(404).send(invalidContinueCode);
        }
        const idsFindIt = hashids.decode(continueCodeFindIt);
        if (idsFindIt.length > 0) {
            for (const key in datacache_1.challenges) {
                if (Object.prototype.hasOwnProperty.call(datacache_1.challenges, key)) {
                    if (idsFindIt.includes(datacache_1.challenges[key].id)) {
                        await challengeUtils.solveFindIt(key, true);
                    }
                }
            }
            res.json({ data: idsFindIt.length + ' solved challenges have been restored.' });
        }
        else {
            res.status(404).send(invalidContinueCode);
        }
    };
};
module.exports.restoreProgressFixIt = function restoreProgressFixIt() {
    const hashids = new Hashids('yet another salt for the fixIt challenges', 60, hashidsAlphabet);
    return async ({ params }, res) => {
        const continueCodeFixIt = params.continueCode;
        if (!hashidRegexp.test(continueCodeFixIt)) {
            return res.status(404).send(invalidContinueCode);
        }
        const idsFixIt = hashids.decode(continueCodeFixIt);
        if (idsFixIt.length > 0) {
            for (const key in datacache_1.challenges) {
                if (Object.prototype.hasOwnProperty.call(datacache_1.challenges, key)) {
                    if (idsFixIt.includes(datacache_1.challenges[key].id)) {
                        await challengeUtils.solveFixIt(key, true);
                    }
                }
            }
            res.json({ data: idsFixIt.length + ' solved challenges have been restored.' });
        }
        else {
            res.status(404).send(invalidContinueCode);
        }
    };
};
//# sourceMappingURL=restoreProgress.js.map