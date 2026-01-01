export class Vector {
    static #unitX = new Vector(1, 0, 0);
    static #unitY = new Vector(0, 1, 0);
    static #unitZ = new Vector(0, 0, 1);
    static #zero = new Vector(0, 0, 0);

    readonly x: number;
    readonly y: number;
    readonly z: number;

    /**
     * Use: <code>Vector.from(x, y, z)</code>.
     */
    private constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Length (magnitude or norm) of the vector.
     */
    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    static get unitX(): Vector {
        return this.#unitX;
    }

    static get unitY(): Vector {
        return this.#unitY;
    }

    static get unitZ(): Vector {
        return this.#unitZ;
    }

    static get zero(): Vector {
        return this.#zero;
    }

    static add(lhs: Vector, rhs: Vector): Vector {
        return new Vector(lhs.x + rhs.x, lhs.y + rhs.y, lhs.z + rhs.z);
    }

    static subtract(lhs: Vector, rhs: Vector): Vector {
        return new Vector(lhs.x - rhs.x, lhs.y - rhs.y, lhs.z - rhs.z);
    }

    /**
     * Multiplies a vector by a scalar value.
     */
    static multiply(vector: Vector, scalar: number): Vector {
        return new Vector(vector.x * scalar, vector.y * scalar, vector.z * scalar);
    }

    /**
     * Multiplies a vector by a supplied vector using dot (scalar) product.
     */
    static dot(lhs: Vector, rhs: Vector): number {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
    }

    /**
     * Multiplies a vector by the supplied vector using cross (vector) product.
     */
    static cross(lhs: Vector, rhs: Vector): Vector {
        return new Vector(lhs.y * rhs.z - lhs.z * rhs.y, lhs.z * rhs.x - lhs.x * rhs.z, lhs.x * rhs.y - lhs.y * rhs.x);
    }

    static direction(a: Vector, b: Vector, epsilon = 1e-12): Vector {
        return Vector.subtract(b, a).unit(epsilon);
    }

    static distance(a: Vector, b: Vector): number {
        return Vector.subtract(a, b).length;
    }

    static distanceSquared(a: Vector, b: Vector): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return dx * dx + dy * dy + dz * dz;
    }

    static divide(vector: Vector, scalar: number): Vector {
        return new Vector(vector.x / scalar, vector.y / scalar, vector.z / scalar);
    }

    static from(x: number, y: number, z: number): Vector {
        return new Vector(x, y, z);
    }

    static fromArray([x, y, z]: [number, number, number]): Vector {
        return new Vector(x, y, z);
    }

    /**
     * Checks whether two vectors are approximately equal.
     * Uses fast absolute tolerance for small values and relative tolerance for large values.
     */
    approxEquals(vector: Vector, epsilon = 1e-9): boolean {
        const dx = Math.abs(this.x - vector.x);
        const dy = Math.abs(this.y - vector.y);
        const dz = Math.abs(this.z - vector.z);

        // Absolute tolerance
        if (dx < epsilon && dy < epsilon && dz < epsilon) {
            return true;
        }

        // Relative tolerance
        const maxX = Math.max(1, Math.abs(this.x), Math.abs(vector.x));
        const maxY = Math.max(1, Math.abs(this.y), Math.abs(vector.y));
        const maxZ = Math.max(1, Math.abs(this.z), Math.abs(vector.z));

        return dx <= epsilon * maxX && dy <= epsilon * maxY && dz <= epsilon * maxZ;
    }

    equals(vector: Vector): boolean {
        return this.x === vector.x && this.y === vector.y && this.z === vector.z;
    }

    isZero(epsilon = 1e-12): boolean {
        return this.length < epsilon;
    }

    toArray(): [number, number, number] {
        return [this.x, this.y, this.z];
    }

    toString(): string {
        const dp = 5;

        return `[${this.x.toFixed(dp)}, ${this.y.toFixed(dp)}, ${this.z.toFixed(dp)}]`;
    }

    negate(): Vector {
        return new Vector(-this.x, -this.y, -this.z);
    }

    normalize(epsilon = 1e-12): Vector {
        return this.unit(epsilon);
    }

    unit(epsilon = 1e-12): Vector {
        const norm = this.length;

        if (norm === 0) return Vector.zero;
        if (Math.abs(norm - 1) < epsilon) return this;

        return Vector.divide(this, norm);
    }

    angleTo(vector: Vector, normal?: Vector): number {
        const cross = Vector.cross(this, vector);
        let sign = 1;

        if (normal) {
            sign = Vector.dot(cross, normal) >= 0 ? 1 : -1;
        }

        const sinθ = cross.length * sign;
        const cosθ = Vector.dot(this, vector);

        return Math.atan2(sinθ, cosθ);
    }

    /**
     * Rotates a vector using a Rodrigues' rotation formula.
     */
    rotate(axis: Vector, degrees: number, epsilon = 1e-12): Vector {
        const angle = (degrees * Math.PI) / 180;

        const a = axis.unit(epsilon);

        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const t = 1 - c;
        const x = a.x;
        const y = a.y;
        const z = a.z;

        const r = [
            [t * x * x + c, t * x * y - s * z, t * x * z + s * y],
            [t * x * y + s * z, t * y * y + c, t * y * z - s * x],
            [t * x * z - s * y, t * y * z + s * x, t * z * z + c],
        ];

        const rp = [
            r[0][0] * this.x + r[0][1] * this.y + r[0][2] * this.z,
            r[1][0] * this.x + r[1][1] * this.y + r[1][2] * this.z,
            r[2][0] * this.x + r[2][1] * this.y + r[2][2] * this.z,
        ];
        return new Vector(rp[0], rp[1], rp[2]);
    }
}
