import {overrideFetch} from "../mytest-utils";

const React = require("react");
const {mount} = require('enzyme');
const {app} = require('../../src/server/app.js');


const cardsText = "Overview of all the cards in the game";

describe("Testing the Cards component", () => {
    it("Should not include cardsText", async () => {

        overrideFetch(app);

        const html = mount(<Cards />).html();

        expect(html.includes(cardsText)).toEqual(true)
    })
})