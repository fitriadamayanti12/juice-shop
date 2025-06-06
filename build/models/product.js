"use strict";
/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModelInit = exports.ProductModel = void 0;
/* jslint node: true */
const utils = __importStar(require("../lib/utils"));
const challengeUtils = __importStar(require("../lib/challengeUtils"));
const sequelize_1 = require("sequelize");
const datacache_1 = require("../data/datacache");
const security = __importStar(require("../lib/insecurity"));
class Product extends sequelize_1.Model {
}
exports.ProductModel = Product;
const ProductModelInit = (sequelize) => {
    Product.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: sequelize_1.DataTypes.STRING,
        description: {
            type: sequelize_1.DataTypes.STRING,
            set(description) {
                if (utils.isChallengeEnabled(datacache_1.challenges.restfulXssChallenge)) {
                    challengeUtils.solveIf(datacache_1.challenges.restfulXssChallenge, () => {
                        return utils.contains(description, '<iframe src="javascript:alert(`xss`)">');
                    });
                }
                else {
                    description = security.sanitizeSecure(description);
                }
                this.setDataValue('description', description);
            }
        },
        price: sequelize_1.DataTypes.DECIMAL,
        deluxePrice: sequelize_1.DataTypes.DECIMAL,
        image: sequelize_1.DataTypes.STRING
    }, {
        tableName: 'Products',
        sequelize,
        paranoid: true
    });
};
exports.ProductModelInit = ProductModelInit;
//# sourceMappingURL=product.js.map