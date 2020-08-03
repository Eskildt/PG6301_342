//Core code: https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/tests/client/home-test.jsx

import {NotFound} from "../../src/client/not_found";
import {overrideFetch} from "../mytest-utils";

const React = require('react');
const {mount} = require('enzyme');
const {app} = require('../../src/server/app.js');

const notFoundTxt = "ERROR: the page you requested in not available.";

describe("Should be testing Error not found", () => {
    it("Should not include not be any text", async () => {

        overrideFetch(app);

        const html = mount(<NotFound />).html();

        expect(html.includes(notFoundTxt)).toEqual(true);
    })
})