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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.start = void 0;
/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
const dataErasure_1 = __importDefault(require("./routes/dataErasure"));
const fs = require("fs");
const models_1 = require("./models");
const user_1 = require("./models/user");
const quantity_1 = require("./models/quantity");
const card_1 = require("./models/card");
const privacyRequests_1 = require("./models/privacyRequests");
const address_1 = require("./models/address");
const securityAnswer_1 = require("./models/securityAnswer");
const securityQuestion_1 = require("./models/securityQuestion");
const recycle_1 = require("./models/recycle");
const complaint_1 = require("./models/complaint");
const challenge_1 = require("./models/challenge");
const basketitem_1 = require("./models/basketitem");
const feedback_1 = require("./models/feedback");
const product_1 = require("./models/product");
const wallet_1 = require("./models/wallet");
const logger_1 = __importDefault(require("./lib/logger"));
const config_1 = __importDefault(require("config"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const safe_1 = __importDefault(require("colors/safe"));
const utils = __importStar(require("./lib/utils"));
const Prometheus = __importStar(require("prom-client"));
const datacreator_1 = __importDefault(require("./data/datacreator"));
const validatePreconditions_1 = __importDefault(require("./lib/startup/validatePreconditions"));
const cleanupFtpFolder_1 = __importDefault(require("./lib/startup/cleanupFtpFolder"));
const validateConfig_1 = __importDefault(require("./lib/startup/validateConfig"));
const restoreOverwrittenFilesWithOriginals_1 = __importDefault(require("./lib/startup/restoreOverwrittenFilesWithOriginals"));
const registerWebsocketEvents_1 = __importDefault(require("./lib/startup/registerWebsocketEvents"));
const customizeApplication_1 = __importDefault(require("./lib/startup/customizeApplication"));
const customizeEasterEgg_1 = __importDefault(require("./lib/startup/customizeEasterEgg")); // vuln-code-snippet hide-line
const authenticatedUsers_1 = __importDefault(require("./routes/authenticatedUsers"));
const startTime = Date.now();
const finale = require('finale-rest');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const featurePolicy = require('feature-policy');
const errorhandler = require('errorhandler');
const cookieParser = require('cookie-parser');
const serveIndex = require('serve-index');
const bodyParser = require('body-parser');
const cors = require('cors');
const securityTxt = require('express-security.txt');
const robots = require('express-robots-txt');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const RateLimit = require('express-rate-limit');
const ipfilter = require('express-ipfilter').IpFilter;
const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yml', 'utf8'));
const { ensureFileIsPassed, handleZipFileUpload, checkUploadSize, checkFileType, handleXmlUpload, handleYamlUpload } = require('./routes/fileUpload');
const profileImageFileUpload = require('./routes/profileImageFileUpload');
const profileImageUrlUpload = require('./routes/profileImageUrlUpload');
const redirect = require('./routes/redirect');
const vulnCodeSnippet = require('./routes/vulnCodeSnippet');
const vulnCodeFixes = require('./routes/vulnCodeFixes');
const angular = require('./routes/angular');
const easterEgg = require('./routes/easterEgg');
const premiumReward = require('./routes/premiumReward');
const privacyPolicyProof = require('./routes/privacyPolicyProof');
const appVersion = require('./routes/appVersion');
const repeatNotification = require('./routes/repeatNotification');
const continueCode = require('./routes/continueCode');
const restoreProgress = require('./routes/restoreProgress');
const fileServer = require('./routes/fileServer');
const quarantineServer = require('./routes/quarantineServer');
const keyServer = require('./routes/keyServer');
const logFileServer = require('./routes/logfileServer');
const metrics = require('./routes/metrics');
const currentUser = require('./routes/currentUser');
const login = require('./routes/login');
const changePassword = require('./routes/changePassword');
const resetPassword = require('./routes/resetPassword');
const securityQuestion = require('./routes/securityQuestion');
const search = require('./routes/search');
const coupon = require('./routes/coupon');
const basket = require('./routes/basket');
const order = require('./routes/order');
const verify = require('./routes/verify');
const recycles = require('./routes/recycles');
const b2bOrder = require('./routes/b2bOrder');
const showProductReviews = require('./routes/showProductReviews');
const createProductReviews = require('./routes/createProductReviews');
const checkKeys = require('./routes/checkKeys');
const nftMint = require('./routes/nftMint');
const web3Wallet = require('./routes/web3Wallet');
const updateProductReviews = require('./routes/updateProductReviews');
const likeProductReviews = require('./routes/likeProductReviews');
const security = require('./lib/insecurity');
const app = express();
const server = require('http').Server(app);
const appConfiguration = require('./routes/appConfiguration');
const captcha = require('./routes/captcha');
const trackOrder = require('./routes/trackOrder');
const countryMapping = require('./routes/countryMapping');
const basketItems = require('./routes/basketItems');
const saveLoginIp = require('./routes/saveLoginIp');
const userProfile = require('./routes/userProfile');
const updateUserProfile = require('./routes/updateUserProfile');
const videoHandler = require('./routes/videoHandler');
const twoFactorAuth = require('./routes/2fa');
const languageList = require('./routes/languages');
const imageCaptcha = require('./routes/imageCaptcha');
const dataExport = require('./routes/dataExport');
const address = require('./routes/address');
const payment = require('./routes/payment');
const wallet = require('./routes/wallet');
const orderHistory = require('./routes/orderHistory');
const delivery = require('./routes/delivery');
const deluxe = require('./routes/deluxe');
const memory = require('./routes/memory');
const chatbot = require('./routes/chatbot');
const locales = require('./data/static/locales.json');
const i18n = require('i18n');
const antiCheat = require('./lib/antiCheat');
const appName = config_1.default.get('application.customMetricsPrefix');
const startupGauge = new Prometheus.Gauge({
    name: `${appName}_startup_duration_seconds`,
    help: `Duration ${appName} required to perform a certain task during startup`,
    labelNames: ['task']
});
// Wraps the function and measures its (async) execution time
const collectDurationPromise = (name, func) => {
    return async (...args) => {
        const end = startupGauge.startTimer({ task: name });
        try {
            const res = await func(...args);
            end();
            return res;
        }
        catch (err) {
            console.error('Error in timed startup function: ' + name, err);
            throw err;
        }
    };
};
/* Sets view engine to hbs */
app.set('view engine', 'hbs');
void collectDurationPromise('validatePreconditions', validatePreconditions_1.default)();
void collectDurationPromise('cleanupFtpFolder', cleanupFtpFolder_1.default)();
void collectDurationPromise('validateConfig', validateConfig_1.default)({});
// Function called first to ensure that all the i18n files are reloaded successfully before other linked operations.
(0, restoreOverwrittenFilesWithOriginals_1.default)().then(() => {
    /* Locals */
    app.locals.captchaId = 0;
    app.locals.captchaReqId = 1;
    app.locals.captchaBypassReqTimes = [];
    app.locals.abused_ssti_bug = false;
    app.locals.abused_ssrf_bug = false;
    /* Compression for all requests */
    app.use(compression());
    /* Bludgeon solution for possible CORS problems: Allow everything! */
    app.options('*', cors());
    app.use(cors());
    /* Security middleware */
    app.use(helmet.noSniff());
    app.use(helmet.frameguard());
    // app.use(helmet.xssFilter()); // = no protection from persisted XSS via RESTful API
    app.disable('x-powered-by');
    app.use(featurePolicy({
        features: {
            payment: ["'self'"]
        }
    }));
    /* Hiring header */
    app.use((req, res, next) => {
        res.append('X-Recruiting', config_1.default.get('application.securityTxt.hiring'));
        next();
    });
    /* Remove duplicate slashes from URL which allowed bypassing subsequent filters */
    app.use((req, res, next) => {
        req.url = req.url.replace(/[/]+/g, '/');
        next();
    });
    /* Increase request counter metric for every request */
    app.use(metrics.observeRequestMetricsMiddleware());
    /* Security Policy */
    const securityTxtExpiration = new Date();
    securityTxtExpiration.setFullYear(securityTxtExpiration.getFullYear() + 1);
    app.get(['/.well-known/security.txt', '/security.txt'], verify.accessControlChallenges());
    app.use(['/.well-known/security.txt', '/security.txt'], securityTxt({
        contact: config_1.default.get('application.securityTxt.contact'),
        encryption: config_1.default.get('application.securityTxt.encryption'),
        acknowledgements: config_1.default.get('application.securityTxt.acknowledgements'),
        'Preferred-Languages': [...new Set(locales.map((locale) => locale.key.substr(0, 2)))].join(', '),
        hiring: config_1.default.get('application.securityTxt.hiring'),
        csaf: config_1.default.get('server.baseUrl') + config_1.default.get('application.securityTxt.csaf'),
        expires: securityTxtExpiration.toUTCString()
    }));
    /* robots.txt */
    app.use(robots({ UserAgent: '*', Disallow: '/ftp' }));
    /* Check for any URLs having been called that would be expected for challenge solving without cheating */
    app.use(antiCheat.checkForPreSolveInteractions());
    /* Checks for challenges solved by retrieving a file implicitly or explicitly */
    app.use('/assets/public/images/padding', verify.accessControlChallenges());
    app.use('/assets/public/images/products', verify.accessControlChallenges());
    app.use('/assets/public/images/uploads', verify.accessControlChallenges());
    app.use('/assets/i18n', verify.accessControlChallenges());
    /* Checks for challenges solved by abusing SSTi and SSRF bugs */
    app.use('/solve/challenges/server-side', verify.serverSideChallenges());
    /* Create middleware to change paths from the serve-index plugin from absolute to relative */
    const serveIndexMiddleware = (req, res, next) => {
        const origEnd = res.end;
        // @ts-expect-error FIXME assignment broken due to seemingly void return value
        res.end = function () {
            if (arguments.length) {
                const reqPath = req.originalUrl.replace(/\?.*$/, '');
                const currentFolder = reqPath.split('/').pop();
                arguments[0] = arguments[0].replace(/a href="([^"]+?)"/gi, function (matchString, matchedUrl) {
                    let relativePath = path_1.default.relative(reqPath, matchedUrl);
                    if (relativePath === '') {
                        relativePath = currentFolder;
                    }
                    else if (!relativePath.startsWith('.') && currentFolder !== '') {
                        relativePath = currentFolder + '/' + relativePath;
                    }
                    else {
                        relativePath = relativePath.replace('..', '.');
                    }
                    return 'a href="' + relativePath + '"';
                });
            }
            // @ts-expect-error FIXME passed argument has wrong type
            origEnd.apply(this, arguments);
        };
        next();
    };
    // vuln-code-snippet start directoryListingChallenge accessLogDisclosureChallenge
    /* /ftp directory browsing and file download */ // vuln-code-snippet neutral-line directoryListingChallenge
    app.use('/ftp', serveIndexMiddleware, serveIndex('ftp', { icons: true })); // vuln-code-snippet vuln-line directoryListingChallenge
    app.use('/ftp(?!/quarantine)/:file', fileServer()); // vuln-code-snippet vuln-line directoryListingChallenge
    app.use('/ftp/quarantine/:file', quarantineServer()); // vuln-code-snippet neutral-line directoryListingChallenge
    app.use('/.well-known', serveIndexMiddleware, serveIndex('.well-known', { icons: true, view: 'details' }));
    app.use('/.well-known', express.static('.well-known'));
    /* /encryptionkeys directory browsing */
    app.use('/encryptionkeys', serveIndexMiddleware, serveIndex('encryptionkeys', { icons: true, view: 'details' }));
    app.use('/encryptionkeys/:file', keyServer());
    /* /logs directory browsing */ // vuln-code-snippet neutral-line accessLogDisclosureChallenge
    app.use('/support/logs', serveIndexMiddleware, serveIndex('logs', { icons: true, view: 'details' })); // vuln-code-snippet vuln-line accessLogDisclosureChallenge
    app.use('/support/logs', verify.accessControlChallenges()); // vuln-code-snippet hide-line
    app.use('/support/logs/:file', logFileServer()); // vuln-code-snippet vuln-line accessLogDisclosureChallenge
    /* Swagger documentation for B2B v2 endpoints */
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(express.static(path_1.default.resolve('frontend/dist/frontend')));
    app.use(cookieParser('kekse'));
    // vuln-code-snippet end directoryListingChallenge accessLogDisclosureChallenge
    /* Configure and enable backend-side i18n */
    i18n.configure({
        locales: locales.map((locale) => locale.key),
        directory: path_1.default.resolve('i18n'),
        cookie: 'language',
        defaultLocale: 'en',
        autoReload: true
    });
    app.use(i18n.init);
    app.use(bodyParser.urlencoded({ extended: true }));
    /* File Upload */
    app.post('/file-upload', uploadToMemory.single('file'), ensureFileIsPassed, metrics.observeFileUploadMetricsMiddleware(), checkUploadSize, checkFileType, handleZipFileUpload, handleXmlUpload, handleYamlUpload);
    app.post('/profile/image/file', uploadToMemory.single('file'), ensureFileIsPassed, metrics.observeFileUploadMetricsMiddleware(), profileImageFileUpload());
    app.post('/profile/image/url', uploadToMemory.single('file'), profileImageUrlUpload());
    app.post('/rest/memories', uploadToDisk.single('image'), ensureFileIsPassed, security.appendUserId(), metrics.observeFileUploadMetricsMiddleware(), memory.addMemory());
    app.use(bodyParser.text({ type: '*/*' }));
    app.use(function jsonParser(req, res, next) {
        // @ts-expect-error FIXME intentionally saving original request in this property
        req.rawBody = req.body;
        if (req.headers['content-type']?.includes('application/json')) {
            if (!req.body) {
                req.body = {};
            }
            if (req.body !== Object(req.body)) { // Expensive workaround for 500 errors during Frisby test run (see #640)
                req.body = JSON.parse(req.body);
            }
        }
        next();
    });
    /* HTTP request logging */
    const accessLogStream = require('file-stream-rotator').getStream({
        filename: path_1.default.resolve('logs/access.log'),
        frequency: 'daily',
        verbose: false,
        max_logs: '2d'
    });
    app.use((0, morgan_1.default)('combined', { stream: accessLogStream }));
    // vuln-code-snippet start resetPasswordMortyChallenge
    /* Rate limiting */
    app.enable('trust proxy');
    app.use('/rest/user/reset-password', new RateLimit({
        windowMs: 5 * 60 * 1000,
        max: 100,
        keyGenerator({ headers, ip }) { return headers['X-Forwarded-For'] ?? ip; } // vuln-code-snippet vuln-line resetPasswordMortyChallenge
    }));
    // vuln-code-snippet end resetPasswordMortyChallenge
    // vuln-code-snippet start changeProductChallenge
    /** Authorization **/
    /* Checks on JWT in Authorization header */ // vuln-code-snippet hide-line
    app.use(verify.jwtChallenges()); // vuln-code-snippet hide-line
    /* Baskets: Unauthorized users are not allowed to access baskets */
    app.use('/rest/basket', security.isAuthorized(), security.appendUserId());
    /* BasketItems: API only accessible for authenticated users */
    app.use('/api/BasketItems', security.isAuthorized());
    app.use('/api/BasketItems/:id', security.isAuthorized());
    /* Feedbacks: GET allowed for feedback carousel, POST allowed in order to provide feedback without being logged in */
    app.use('/api/Feedbacks/:id', security.isAuthorized());
    /* Users: Only POST is allowed in order to register a new user */
    app.get('/api/Users', security.isAuthorized());
    app.route('/api/Users/:id')
        .get(security.isAuthorized())
        .put(security.denyAll())
        .delete(security.denyAll());
    /* Products: Only GET is allowed in order to view products */ // vuln-code-snippet neutral-line changeProductChallenge
    app.post('/api/Products', security.isAuthorized()); // vuln-code-snippet neutral-line changeProductChallenge
    // app.put('/api/Products/:id', security.isAuthorized()) // vuln-code-snippet vuln-line changeProductChallenge
    app.delete('/api/Products/:id', security.denyAll());
    /* Challenges: GET list of challenges allowed. Everything else forbidden entirely */
    app.post('/api/Challenges', security.denyAll());
    app.use('/api/Challenges/:id', security.denyAll());
    /* Complaints: POST and GET allowed when logged in only */
    app.get('/api/Complaints', security.isAuthorized());
    app.post('/api/Complaints', security.isAuthorized());
    app.use('/api/Complaints/:id', security.denyAll());
    /* Recycles: POST and GET allowed when logged in only */
    app.get('/api/Recycles', recycles.blockRecycleItems());
    app.post('/api/Recycles', security.isAuthorized());
    /* Challenge evaluation before finale takes over */
    app.get('/api/Recycles/:id', recycles.getRecycleItem());
    app.put('/api/Recycles/:id', security.denyAll());
    app.delete('/api/Recycles/:id', security.denyAll());
    /* SecurityQuestions: Only GET list of questions allowed. */
    app.post('/api/SecurityQuestions', security.denyAll());
    app.use('/api/SecurityQuestions/:id', security.denyAll());
    /* SecurityAnswers: Only POST of answer allowed. */
    app.get('/api/SecurityAnswers', security.denyAll());
    app.use('/api/SecurityAnswers/:id', security.denyAll());
    /* REST API */
    app.use('/rest/user/authentication-details', security.isAuthorized());
    app.use('/rest/basket/:id', security.isAuthorized());
    app.use('/rest/basket/:id/order', security.isAuthorized());
    /* Challenge evaluation before finale takes over */ // vuln-code-snippet hide-start
    app.post('/api/Feedbacks', verify.forgedFeedbackChallenge());
    /* Captcha verification before finale takes over */
    app.post('/api/Feedbacks', captcha.verifyCaptcha());
    /* Captcha Bypass challenge verification */
    app.post('/api/Feedbacks', verify.captchaBypassChallenge());
    /* User registration challenge verifications before finale takes over */
    app.post('/api/Users', (req, res, next) => {
        if (req.body.email !== undefined && req.body.password !== undefined && req.body.passwordRepeat !== undefined) {
            if (req.body.email.length !== 0 && req.body.password.length !== 0) {
                req.body.email = req.body.email.trim();
                req.body.password = req.body.password.trim();
                req.body.passwordRepeat = req.body.passwordRepeat.trim();
            }
            else {
                res.status(400).send(res.__('Invalid email/password cannot be empty'));
            }
        }
        next();
    });
    app.post('/api/Users', verify.registerAdminChallenge());
    app.post('/api/Users', verify.passwordRepeatChallenge()); // vuln-code-snippet hide-end
    app.post('/api/Users', verify.emptyUserRegistration());
    /* Unauthorized users are not allowed to access B2B API */
    app.use('/b2b/v2', security.isAuthorized());
    /* Check if the quantity is available in stock and limit per user not exceeded, then add item to basket */
    app.put('/api/BasketItems/:id', security.appendUserId(), basketItems.quantityCheckBeforeBasketItemUpdate());
    app.post('/api/BasketItems', security.appendUserId(), basketItems.quantityCheckBeforeBasketItemAddition(), basketItems.addBasketItem());
    /* Accounting users are allowed to check and update quantities */
    app.delete('/api/Quantitys/:id', security.denyAll());
    app.post('/api/Quantitys', security.denyAll());
    app.use('/api/Quantitys/:id', security.isAccounting(), ipfilter(['123.456.789'], { mode: 'allow' }));
    /* Feedbacks: Do not allow changes of existing feedback */
    app.put('/api/Feedbacks/:id', security.denyAll());
    /* PrivacyRequests: Only allowed for authenticated users */
    app.use('/api/PrivacyRequests', security.isAuthorized());
    app.use('/api/PrivacyRequests/:id', security.isAuthorized());
    /* PaymentMethodRequests: Only allowed for authenticated users */
    app.post('/api/Cards', security.appendUserId());
    app.get('/api/Cards', security.appendUserId(), payment.getPaymentMethods());
    app.put('/api/Cards/:id', security.denyAll());
    app.delete('/api/Cards/:id', security.appendUserId(), payment.delPaymentMethodById());
    app.get('/api/Cards/:id', security.appendUserId(), payment.getPaymentMethodById());
    /* PrivacyRequests: Only POST allowed for authenticated users */
    app.post('/api/PrivacyRequests', security.isAuthorized());
    app.get('/api/PrivacyRequests', security.denyAll());
    app.use('/api/PrivacyRequests/:id', security.denyAll());
    app.post('/api/Addresss', security.appendUserId());
    app.get('/api/Addresss', security.appendUserId(), address.getAddress());
    app.put('/api/Addresss/:id', security.appendUserId());
    app.delete('/api/Addresss/:id', security.appendUserId(), address.delAddressById());
    app.get('/api/Addresss/:id', security.appendUserId(), address.getAddressById());
    app.get('/api/Deliverys', delivery.getDeliveryMethods());
    app.get('/api/Deliverys/:id', delivery.getDeliveryMethod());
    // vuln-code-snippet end changeProductChallenge
    /* Verify the 2FA Token */
    app.post('/rest/2fa/verify', new RateLimit({ windowMs: 5 * 60 * 1000, max: 100 }), twoFactorAuth.verify());
    /* Check 2FA Status for the current User */
    app.get('/rest/2fa/status', security.isAuthorized(), twoFactorAuth.status());
    /* Enable 2FA for the current User */
    app.post('/rest/2fa/setup', new RateLimit({ windowMs: 5 * 60 * 1000, max: 100 }), security.isAuthorized(), twoFactorAuth.setup());
    /* Disable 2FA Status for the current User */
    app.post('/rest/2fa/disable', new RateLimit({ windowMs: 5 * 60 * 1000, max: 100 }), security.isAuthorized(), twoFactorAuth.disable());
    /* Verifying DB related challenges can be postponed until the next request for challenges is coming via finale */
    app.use(verify.databaseRelatedChallenges());
    // vuln-code-snippet start registerAdminChallenge
    /* Generated API endpoints */
    finale.initialize({ app, sequelize: models_1.sequelize });
    const autoModels = [
        { name: 'User', exclude: ['password', 'totpSecret'], model: user_1.UserModel },
        { name: 'Product', exclude: [], model: product_1.ProductModel },
        { name: 'Feedback', exclude: [], model: feedback_1.FeedbackModel },
        { name: 'BasketItem', exclude: [], model: basketitem_1.BasketItemModel },
        { name: 'Challenge', exclude: [], model: challenge_1.ChallengeModel },
        { name: 'Complaint', exclude: [], model: complaint_1.ComplaintModel },
        { name: 'Recycle', exclude: [], model: recycle_1.RecycleModel },
        { name: 'SecurityQuestion', exclude: [], model: securityQuestion_1.SecurityQuestionModel },
        { name: 'SecurityAnswer', exclude: [], model: securityAnswer_1.SecurityAnswerModel },
        { name: 'Address', exclude: [], model: address_1.AddressModel },
        { name: 'PrivacyRequest', exclude: [], model: privacyRequests_1.PrivacyRequestModel },
        { name: 'Card', exclude: [], model: card_1.CardModel },
        { name: 'Quantity', exclude: [], model: quantity_1.QuantityModel }
    ];
    for (const { name, exclude, model } of autoModels) {
        const resource = finale.resource({
            model,
            endpoints: [`/api/${name}s`, `/api/${name}s/:id`],
            excludeAttributes: exclude,
            pagination: false
        });
        // create a wallet when a new user is registered using API
        if (name === 'User') { // vuln-code-snippet neutral-line registerAdminChallenge
            resource.create.send.before((req, res, context) => {
                wallet_1.WalletModel.create({ UserId: context.instance.id }).catch((err) => {
                    console.log(err);
                });
                return context.continue; // vuln-code-snippet neutral-line registerAdminChallenge
            }); // vuln-code-snippet neutral-line registerAdminChallenge
        } // vuln-code-snippet neutral-line registerAdminChallenge
        // vuln-code-snippet end registerAdminChallenge
        // translate challenge descriptions and hints on-the-fly
        if (name === 'Challenge') {
            resource.list.fetch.after((req, res, context) => {
                for (let i = 0; i < context.instance.length; i++) {
                    let description = context.instance[i].description;
                    if (utils.contains(description, '<em>(This challenge is <strong>')) {
                        const warning = description.substring(description.indexOf(' <em>(This challenge is <strong>'));
                        description = description.substring(0, description.indexOf(' <em>(This challenge is <strong>'));
                        context.instance[i].description = req.__(description) + req.__(warning);
                    }
                    else {
                        context.instance[i].description = req.__(description);
                    }
                    if (context.instance[i].hint) {
                        context.instance[i].hint = req.__(context.instance[i].hint);
                    }
                }
                return context.continue;
            });
            resource.read.send.before((req, res, context) => {
                context.instance.description = req.__(context.instance.description);
                if (context.instance.hint) {
                    context.instance.hint = req.__(context.instance.hint);
                }
                return context.continue;
            });
        }
        // translate security questions on-the-fly
        if (name === 'SecurityQuestion') {
            resource.list.fetch.after((req, res, context) => {
                for (let i = 0; i < context.instance.length; i++) {
                    context.instance[i].question = req.__(context.instance[i].question);
                }
                return context.continue;
            });
            resource.read.send.before((req, res, context) => {
                context.instance.question = req.__(context.instance.question);
                return context.continue;
            });
        }
        // translate product names and descriptions on-the-fly
        if (name === 'Product') {
            resource.list.fetch.after((req, res, context) => {
                for (let i = 0; i < context.instance.length; i++) {
                    context.instance[i].name = req.__(context.instance[i].name);
                    context.instance[i].description = req.__(context.instance[i].description);
                }
                return context.continue;
            });
            resource.read.send.before((req, res, context) => {
                context.instance.name = req.__(context.instance.name);
                context.instance.description = req.__(context.instance.description);
                return context.continue;
            });
        }
        // fix the api difference between finale (fka epilogue) and previously used sequlize-restful
        resource.all.send.before((req, res, context) => {
            context.instance = {
                status: 'success',
                data: context.instance
            };
            return context.continue;
        });
    }
    /* Custom Restful API */
    app.post('/rest/user/login', login());
    app.get('/rest/user/change-password', changePassword());
    app.post('/rest/user/reset-password', resetPassword());
    app.get('/rest/user/security-question', securityQuestion());
    app.get('/rest/user/whoami', security.updateAuthenticatedUsers(), currentUser());
    app.get('/rest/user/authentication-details', (0, authenticatedUsers_1.default)());
    app.get('/rest/products/search', search());
    app.get('/rest/basket/:id', basket());
    app.post('/rest/basket/:id/checkout', order());
    app.put('/rest/basket/:id/coupon/:coupon', coupon());
    app.get('/rest/admin/application-version', appVersion());
    app.get('/rest/admin/application-configuration', appConfiguration());
    app.get('/rest/repeat-notification', repeatNotification());
    app.get('/rest/continue-code', continueCode.continueCode());
    app.get('/rest/continue-code-findIt', continueCode.continueCodeFindIt());
    app.get('/rest/continue-code-fixIt', continueCode.continueCodeFixIt());
    app.put('/rest/continue-code-findIt/apply/:continueCode', restoreProgress.restoreProgressFindIt());
    app.put('/rest/continue-code-fixIt/apply/:continueCode', restoreProgress.restoreProgressFixIt());
    app.put('/rest/continue-code/apply/:continueCode', restoreProgress.restoreProgress());
    app.get('/rest/admin/application-version', appVersion());
    app.get('/rest/captcha', captcha());
    app.get('/rest/image-captcha', imageCaptcha());
    app.get('/rest/track-order/:id', trackOrder());
    app.get('/rest/country-mapping', countryMapping());
    app.get('/rest/saveLoginIp', saveLoginIp());
    app.post('/rest/user/data-export', security.appendUserId(), imageCaptcha.verifyCaptcha());
    app.post('/rest/user/data-export', security.appendUserId(), dataExport());
    app.get('/rest/languages', languageList());
    app.get('/rest/order-history', orderHistory.orderHistory());
    app.get('/rest/order-history/orders', security.isAccounting(), orderHistory.allOrders());
    app.put('/rest/order-history/:id/delivery-status', security.isAccounting(), orderHistory.toggleDeliveryStatus());
    app.get('/rest/wallet/balance', security.appendUserId(), wallet.getWalletBalance());
    app.put('/rest/wallet/balance', security.appendUserId(), wallet.addWalletBalance());
    app.get('/rest/deluxe-membership', deluxe.deluxeMembershipStatus());
    app.post('/rest/deluxe-membership', security.appendUserId(), deluxe.upgradeToDeluxe());
    app.get('/rest/memories', memory.getMemories());
    app.get('/rest/chatbot/status', chatbot.status());
    app.post('/rest/chatbot/respond', chatbot.process());
    /* NoSQL API endpoints */
    app.get('/rest/products/:id/reviews', showProductReviews());
    app.put('/rest/products/:id/reviews', createProductReviews());
    app.patch('/rest/products/reviews', security.isAuthorized(), updateProductReviews());
    app.post('/rest/products/reviews', security.isAuthorized(), likeProductReviews());
    /* Web3 API endpoints */
    app.post('/rest/web3/submitKey', checkKeys.checkKeys());
    app.get('/rest/web3/nftUnlocked', checkKeys.nftUnlocked());
    app.get('/rest/web3/nftMintListen', nftMint.nftMintListener());
    app.post('/rest/web3/walletNFTVerify', nftMint.walletNFTVerify());
    app.post('/rest/web3/walletExploitAddress', web3Wallet.contractExploitListener());
    /* B2B Order API */
    app.post('/b2b/v2/orders', b2bOrder());
    /* File Serving */
    app.get('/the/devs/are/so/funny/they/hid/an/easter/egg/within/the/easter/egg', easterEgg());
    app.get('/this/page/is/hidden/behind/an/incredibly/high/paywall/that/could/only/be/unlocked/by/sending/1btc/to/us', premiumReward());
    app.get('/we/may/also/instruct/you/to/refuse/all/reasonably/necessary/responsibility', privacyPolicyProof());
    /* Route for dataerasure page */
    app.use('/dataerasure', dataErasure_1.default);
    /* Route for redirects */
    app.get('/redirect', redirect());
    /* Routes for promotion video page */
    app.get('/promotion', videoHandler.promotionVideo());
    app.get('/video', videoHandler.getVideo());
    /* Routes for profile page */
    app.get('/profile', security.updateAuthenticatedUsers(), userProfile());
    app.post('/profile', updateUserProfile());
    /* Route for vulnerable code snippets */
    app.get('/snippets', vulnCodeSnippet.serveChallengesWithCodeSnippet());
    app.get('/snippets/:challenge', vulnCodeSnippet.serveCodeSnippet());
    app.post('/snippets/verdict', vulnCodeSnippet.checkVulnLines());
    app.get('/snippets/fixes/:key', vulnCodeFixes.serveCodeFixes());
    app.post('/snippets/fixes', vulnCodeFixes.checkCorrectFix());
    app.use(angular());
    /* Error Handling */
    app.use(verify.errorHandlingChallenge());
    app.use(errorhandler());
}).catch((err) => {
    console.error(err);
});
const multer = require('multer');
const uploadToMemory = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200000 } });
const mimeTypeMap = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const uploadToDisk = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const isValid = mimeTypeMap[file.mimetype];
            let error = new Error('Invalid mime type');
            if (isValid) {
                error = null;
            }
            cb(error, path_1.default.resolve('frontend/dist/frontend/assets/public/images/uploads/'));
        },
        filename: (req, file, cb) => {
            const name = security.sanitizeFilename(file.originalname)
                .toLowerCase()
                .split(' ')
                .join('-');
            const ext = mimeTypeMap[file.mimetype];
            cb(null, name + '-' + Date.now() + '.' + ext);
        }
    })
});
const expectedModels = ['Address', 'Basket', 'BasketItem', 'Captcha', 'Card', 'Challenge', 'Complaint', 'Delivery', 'Feedback', 'ImageCaptcha', 'Memory', 'PrivacyRequestModel', 'Product', 'Quantity', 'Recycle', 'SecurityAnswer', 'SecurityQuestion', 'User', 'Wallet'];
while (!expectedModels.every(model => Object.keys(models_1.sequelize.models).includes(model))) {
    logger_1.default.info(`Entity models ${safe_1.default.bold(Object.keys(models_1.sequelize.models).length.toString())} of ${safe_1.default.bold(expectedModels.length.toString())} are initialized (${safe_1.default.yellow('WAITING')})`);
}
logger_1.default.info(`Entity models ${safe_1.default.bold(Object.keys(models_1.sequelize.models).length.toString())} of ${safe_1.default.bold(expectedModels.length.toString())} are initialized (${safe_1.default.green('OK')})`);
// vuln-code-snippet start exposedMetricsChallenge
/* Serve metrics */
let metricsUpdateLoop;
const Metrics = metrics.observeMetrics(); // vuln-code-snippet neutral-line exposedMetricsChallenge
app.get('/metrics', metrics.serveMetrics()); // vuln-code-snippet vuln-line exposedMetricsChallenge
errorhandler.title = `${config_1.default.get('application.name')} (Express ${utils.version('express')})`;
async function start(readyCallback) {
    const datacreatorEnd = startupGauge.startTimer({ task: 'datacreator' });
    await models_1.sequelize.sync({ force: true });
    await (0, datacreator_1.default)();
    datacreatorEnd();
    const port = process.env.PORT ?? config_1.default.get('server.port');
    process.env.BASE_PATH = process.env.BASE_PATH ?? config_1.default.get('server.basePath');
    metricsUpdateLoop = Metrics.updateLoop(); // vuln-code-snippet neutral-line exposedMetricsChallenge
    server.listen(port, () => {
        logger_1.default.info(safe_1.default.cyan(`Server listening on port ${safe_1.default.bold(`${port}`)}`));
        startupGauge.set({ task: 'ready' }, (Date.now() - startTime) / 1000);
        if (process.env.BASE_PATH !== '') {
            logger_1.default.info(safe_1.default.cyan(`Server using proxy base path ${safe_1.default.bold(`${process.env.BASE_PATH}`)} for redirects`));
        }
        (0, registerWebsocketEvents_1.default)(server);
        if (readyCallback) {
            readyCallback();
        }
    });
    void collectDurationPromise('customizeApplication', customizeApplication_1.default)(); // vuln-code-snippet hide-line
    void collectDurationPromise('customizeEasterEgg', customizeEasterEgg_1.default)(); // vuln-code-snippet hide-line
}
exports.start = start;
function close(exitCode) {
    if (server) {
        clearInterval(metricsUpdateLoop);
        server.close();
    }
    if (exitCode !== undefined) {
        process.exit(exitCode);
    }
}
exports.close = close;
// vuln-code-snippet end exposedMetricsChallenge
// stop server on sigint or sigterm signals
process.on('SIGINT', () => { close(0); });
process.on('SIGTERM', () => { close(0); });
//# sourceMappingURL=server.js.map