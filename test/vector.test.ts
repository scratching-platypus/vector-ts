import { describe, expect, test, vi } from "vitest";
import { Vector } from "../src/vector";

const unitCoord = 1 / Math.sqrt(3);
const one = Vector.from(unitCoord, unitCoord, unitCoord);
const diagonal = Vector.from(1, 1, 1);

test("length", () => {
    expect(Vector.zero.length).toBe(0);
    expect(diagonal.length).toBe(Math.sqrt(3));
    expect(Vector.from(1, 2, 2).length).toBe(3);
    expect(Vector.from(1, 2, 3).length).toBe(Math.sqrt(14));
});

test("unitX", () => {
    expect(Vector.unitX).toEqual(Vector.from(1, 0, 0));
});

test("unitY", () => {
    expect(Vector.unitY).toEqual(Vector.from(0, 1, 0));
});

test("unitZ", () => {
    expect(Vector.unitZ).toEqual(Vector.from(0, 0, 1));
});

test("zero", () => {
    expect(Vector.zero).toEqual(Vector.from(0, 0, 0));
});

test("add", () => {
    const a = Vector.from(1, 2, 3);
    const b = Vector.from(4, 5, 6);

    expect(Vector.add(a, b)).toEqual(Vector.from(5, 7, 9));
});

test("subtract", () => {
    const a = Vector.from(5, 7, 9);
    const b = Vector.from(1, 2, 3);

    expect(Vector.subtract(a, b)).toEqual(Vector.from(4, 5, 6));
});

test("multiply", () => {
    expect(Vector.multiply(Vector.from(2, 3, 4), 3)).toEqual(Vector.from(6, 9, 12));
    expect(Vector.multiply(Vector.from(-2, -3, -4), 3)).toEqual(Vector.from(-6, -9, -12));
});

test("dot", () => {
    expect(Vector.dot(Vector.zero, diagonal)).toBe(0);
    expect(Vector.dot(diagonal, diagonal)).toBe(3);
    expect(Vector.dot(Vector.from(1, 2, 3), Vector.from(4, 5, 6))).toBe(32);

    expect(Vector.dot(diagonal, Vector.from(-1, -1, -1))).toBe(-3);
    expect(Vector.dot(Vector.from(-1, -1, -1), Vector.from(-1, -1, -1))).toBe(3);
});

test("cross", () => {
    expect(Vector.cross(Vector.from(1, 2, 3), Vector.from(4, 5, 6))).toEqual(Vector.from(-3, 6, -3));
    expect(Vector.cross(Vector.from(-3, -6, -9), Vector.from(2, 4, 8))).toEqual(Vector.from(-12, 6, 0));
    expect(Vector.cross(Vector.from(-3, -6, -10), Vector.from(2, 4, 6))).toEqual(Vector.from(4, -2, 0));
    expect(Vector.cross(Vector.from(-2, -4, -6), Vector.from(3, 5, 7))).toEqual(Vector.from(2, -4, 2));
    expect(Vector.cross(Vector.from(-7, -15, -25), Vector.from(2, 5, 9))).toEqual(Vector.from(-10, 13, -5));
});

test("direction", () => {
    expect(Vector.direction(Vector.zero, Vector.zero)).toBe(Vector.zero);
    expect(Vector.direction(Vector.zero, diagonal)).toEqual(one);
    expect(Vector.direction(diagonal, Vector.zero)).toEqual(one.negate());
    expect(Vector.direction(one, one)).toBe(Vector.zero);
});

test("distance", () => {
    expect(Vector.distance(Vector.zero, Vector.zero)).toBe(0);
    expect(Vector.distance(Vector.zero, one)).toBe(1);
    expect(Vector.distance(one, Vector.zero)).toBe(1);
    expect(Vector.distance(one, one)).toBe(0);
});

test("distanceSquared", () => {
    expect(Vector.distanceSquared(Vector.zero, Vector.zero)).toBe(0);
    expect(Vector.distanceSquared(Vector.zero, one)).toBeCloseTo(1, 12);
    expect(Vector.distanceSquared(one, Vector.zero)).toBeCloseTo(1, 12);
    expect(Vector.distanceSquared(one, one)).toBe(0);
});

test("divide", () => {
    expect(Vector.divide(Vector.from(2, 3, 4), 2)).toEqual(Vector.from(1, 1.5, 2));
    expect(Vector.divide(Vector.from(-2, -3, -4), 2)).toEqual(Vector.from(-1, -1.5, -2));
});

test("from", () => {
    expect(Vector.from(1, 2, 3) instanceof Vector).toBe(true);
});

test("fromArray", () => {
    const vector = Vector.fromArray([1, 2, 3]);

    expect(vector instanceof Vector).toBe(true);
    expect(vector).toEqual(Vector.from(1, 2, 3));
});

test("approxEquals", () => {
    expect(diagonal.approxEquals(diagonal)).toBe(true);
    expect(Vector.zero.approxEquals(Vector.zero)).toBe(true);
    expect(Vector.from(1, 1, 0).approxEquals(diagonal)).toBe(false);

    expect(diagonal.approxEquals(Vector.from(1 + 1e-9, 1 + 1e-9, 1 + 1e-9))).toBe(false);
    expect(diagonal.approxEquals(Vector.from(1 + 1e-10, 1 + 1e-10, 1 + 1e-10))).toBe(true);

    expect(Vector.zero.approxEquals(Vector.from(1e-8, 1e-8, 1e-8))).toBe(false);
    expect(Vector.zero.approxEquals(Vector.from(1e-9, 1e-9, 1e-9))).toBe(true);

    expect(Vector.zero.approxEquals(Vector.from(1e-9, 1e-9, 1e-9), 1e-12)).toBe(false);
    expect(Vector.zero.approxEquals(diagonal, 1)).toBe(true);
});

test("equals", () => {
    expect(diagonal.equals(diagonal)).toBe(true);
    expect(Vector.zero.equals(Vector.zero)).toBe(true);

    expect(Vector.from(1, 1, 0).equals(diagonal)).toBe(false);
    expect(diagonal.equals(Vector.from(1 + 1e-9, 1 + 1e-9, 1 + 1e-9))).toBe(false);

    expect(Vector.zero.equals(Vector.from(1e-9, 1e-9, 1e-9))).toBe(false);
    expect(Vector.zero.equals(Vector.from(1e-12, 1e-12, 1e-12))).toBe(false);
});

test("isZero", () => {
    expect(Vector.zero.isZero()).toBe(true);
    expect(Vector.from(0, 0, 0).isZero()).toBe(true);

    expect(Vector.from(1e-9, 1e-9, 1e-9).isZero()).toBe(false);
    expect(Vector.from(1e-12, 1e-12, 1e-12).isZero()).toBe(false);

    expect(Vector.from(1e-13, 1e-13, 1e-13).isZero()).toBe(true);
    expect(Vector.from(1e-12, 1e-12, 1e-12).isZero(1e-9)).toBe(true);
});

test("toArray", () => {
    expect(Vector.zero.toArray()).toEqual([0, 0, 0]);
    expect(Vector.from(1, 2, 3).toArray()).toEqual([1, 2, 3]);
});

test("toString", () => {
    expect(Vector.from(1, 2, 3).toString()).toBe("[1.00000, 2.00000, 3.00000]");
    expect(Vector.from(1.0005, 2.0006, 3.141595).toString()).toBe("[1.00050, 2.00060, 3.14160]");
});

test("negate", () => {
    expect(Vector.from(1, 2, 3).negate()).toEqual(Vector.from(-1, -2, -3));
    expect(Vector.from(0, -2, -3).negate()).toEqual(Vector.from(-0, 2, 3));
    expect(Vector.from(0, -0, -Infinity).negate()).toEqual(Vector.from(-0, 0, Infinity));
});

test("normalize", () => {
    const epsilon = 1;
    const vector = Vector.zero;
    const expected = vector.unit(epsilon);

    const spy = vi.spyOn(vector, "unit");
    const result = vector.normalize(1);

    expect(result).toEqual(expected);
    expect(spy).toHaveBeenCalledWith(1);
});

describe("unit", () => {
    test("norm = 0", () => {
        expect(Vector.zero.unit()).toBe(Vector.zero);
        expect(Vector.from(0, 0, 0).unit()).toBe(Vector.zero);
    });

    describe("norm ~= 1", () => {
        test("vector with norm exactly 1 stays unit", () => {
            const u = one.unit();

            expect(u.length).toBe(1);
            expect(u.equals(one)).toBe(true);
        });

        test("vector within default epsilon (1e-12) is treated as unit", () => {
            const a = unitCoord + 1e-13;
            const v = Vector.from(a, a, a);
            const u = v.unit();

            expect(u.length).toBeCloseTo(1, 12);
            expect(u.approxEquals(v, 1e-12)).toBe(true);
        });

        test("vector outside default epsilon (1e-12) gets normalized", () => {
            const a = unitCoord + 5e-12;
            const v = Vector.from(a, a, a);
            const u = v.unit();

            expect(u.length).toBeCloseTo(1, 12);
            expect(u.approxEquals(v, 1e-12)).toBe(false);
        });

        test("custom epsilon allows looser tolerance", () => {
            const a = unitCoord + 5e-12;
            const v = Vector.from(a, a, a);
            const u = v.unit(1e-9);

            expect(u.length).toBeCloseTo(1, 10);
            expect(u.approxEquals(v, 1e-12)).toBe(true);
        });
    });

    test("norm > 1", () => {
        expect(Vector.from(1, 0, 0)).toEqual(Vector.from(1, 0, 0));
        expect(Vector.from(0, 1, 0)).toEqual(Vector.from(0, 1, 0));
        expect(Vector.from(0, 0, 1)).toEqual(Vector.from(0, 0, 1));

        const v = Vector.from(2, 3, 5);
        const norm = v.length;

        expect(v.unit()).toEqual(Vector.from(2 / norm, 3 / norm, 5 / norm));
    });
});

test("angleTo", () => {
    expect(Vector.zero.angleTo(Vector.zero)).toBe(0);
    expect(diagonal.angleTo(diagonal)).toBe(0);
    expect(diagonal.angleTo(Vector.from(2, 2, 2))).toBe(0);
    expect(Vector.from(1, 2, 3).angleTo(Vector.from(2, 2, 2))).toBe(0.3875966866551806);

    expect(Vector.zero.angleTo(Vector.zero, Vector.zero)).toBe(0);
    expect(diagonal.angleTo(diagonal, diagonal)).toBe(0);
    expect(diagonal.angleTo(Vector.from(2, 2, 2), Vector.from(3, 3, 3))).toBe(0);
    expect(Vector.from(-7, -15, -25).angleTo(Vector.from(2, 5, 9), Vector.from(2, -4, 2))).toBe(-3.087040373825513);
});

test("rotate", () => {
    expect(Vector.zero.rotate(Vector.zero, 0)).toEqual(Vector.zero);
    expect(Vector.zero.rotate(Vector.zero, 90)).toEqual(Vector.zero);
    expect(Vector.zero.rotate(Vector.zero, 180)).toEqual(Vector.zero);
    expect(Vector.zero.rotate(Vector.zero, 270)).toEqual(Vector.zero);
    expect(Vector.zero.rotate(Vector.zero, 360)).toEqual(Vector.zero);

    expect(Vector.zero.rotate(diagonal, 0)).toEqual(Vector.zero);
    expect(Vector.zero.rotate(diagonal, 90)).toEqual(Vector.zero);
    expect(Vector.zero.rotate(diagonal, 180)).toEqual(Vector.zero);
    expect(Vector.zero.rotate(diagonal, 270)).toEqual(Vector.zero);
    expect(Vector.zero.rotate(diagonal, 360)).toEqual(Vector.zero);

    expect(diagonal.rotate(diagonal, 0)).toEqual(diagonal);
    expect(diagonal.rotate(diagonal, 90).approxEquals(diagonal)).toBe(true);
    expect(diagonal.rotate(diagonal, 180).approxEquals(diagonal)).toBe(true);
    expect(diagonal.rotate(diagonal, 270).approxEquals(diagonal)).toBe(true);
    expect(diagonal.rotate(diagonal, 360).approxEquals(diagonal)).toBe(true);

    expect(Vector.from(0, 1, -1).rotate(Vector.from(1, 0, -1), 0)).toEqual(Vector.from(0, 1, -1));
    expect(Vector.from(0, 1, -1).rotate(Vector.from(1, 0, -1), 90)).toEqual(
        Vector.from(1.2071067811865472, 0.7071067811865476, 0.20710678118654757)
    );
    expect(
        Vector.from(0, 1, -1)
            .rotate(Vector.from(1, 0, -1), 180)
            .approxEquals(Vector.from(1, -1, 0))
    ).toBe(true);

    expect(Vector.from(0, 1, -1).rotate(Vector.from(1, 0, -1), 270)).toEqual(
        Vector.from(-0.20710678118654746, -0.7071067811865477, -1.2071067811865472)
    );
    expect(
        Vector.from(0, 1, -1)
            .rotate(Vector.from(1, 0, -1), 360)
            .approxEquals(Vector.from(0, 1, -1))
    ).toBe(true);

    const epsilon = 1e-6;
    const spy = vi.spyOn(Vector.zero, "unit");

    Vector.zero.rotate(Vector.zero, 0, epsilon);
    expect(spy).toHaveBeenCalledWith(epsilon);
});
