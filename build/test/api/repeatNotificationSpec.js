"use strict";
/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const frisby = require("frisby");
const REST_URL = 'http://localhost:3000/rest';
describe('/rest/repeat-notification', () => {
    it('GET triggers repeating notification without passing a challenge', () => {
        return frisby.get(REST_URL + '/repeat-notification')
            .expect('status', 200);
    });
    it('GET triggers repeating notification passing an unsolved challenge', () => {
        return frisby.get(REST_URL + '/repeat-notification?challenge=Retrieve%20Blueprint')
            .expect('status', 200);
    });
    it('GET triggers repeating notification passing a solved challenge', () => {
        return frisby.get(REST_URL + '/repeat-notification?challenge=Error%20Handling')
            .expect('status', 200);
    });
});
//# sourceMappingURL=repeatNotificationSpec.js.map