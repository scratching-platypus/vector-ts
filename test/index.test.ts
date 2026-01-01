import * as Public from "../src/index";
import * as Internal from "../src/vector";
import { expect, test } from "vitest";

test("public API", () => {
    expect(Public.Vector).toBe(Internal.Vector);
});
