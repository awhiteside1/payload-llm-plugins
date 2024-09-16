import {expect} from "vitest";
import {adder} from "../src";

describe('Semantic Search', () => {
    it('should work', () => {

        expect(adder(1,1)).toEqual(2)

    });
});