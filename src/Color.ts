export class Color {

    static readonly TRANSPARENT = new Color(0.0, 0.0, 0.0, 0.0);
    static readonly WHITE = new Color(1.0, 1.0, 1.0, 1.0);
    static readonly BLACK = new Color(0.0, 0.0, 0.0, 1.0);
    static readonly GRAY = new Color(0.5, 0.5, 0.5, 1.0);
    static readonly DARK_GRAY = new Color(0.3, 0.3, 0.3, 1.0); // 深灰 
    static readonly LIGHT_GRAY = new Color(0.7, 0.7, 0.7, 1.0); // 浅灰
    static readonly RED = new Color(1.0, 0, 0, 1.0);
    static readonly GREEN = new Color(0, 1.0, 0, 1.0);
    static readonly BLUE = new Color(0, 0, 1.0, 1.0);
    static readonly YELLOW = new Color(1.0, 1.0, 0, 1.0);
    static readonly CYAN = new Color(0, 1.0, 1.0, 1.0); // 蓝绿

    /**
     *  颜色混合
     * @static
     * @param {Color} c1
     * @param {Color} c2
     * @param {number} ratio 0~1 之间的值
     * @returns {Color}
     */
    public static Mix(c1: Color, c2: Color, ratio: number): Color {
        let oneMinusR: number = 1 - ratio;
        return new Color(c1.r * oneMinusR + c2.r * ratio,
            c1.g * oneMinusR + c2.g * ratio,
            c1.b * oneMinusR + c2.b * ratio,
            c1.a * oneMinusR + c2.a * ratio);
    }

    public static fromHex(v: number): Color {
        let inv255: number = 1 / 255;
        return new Color(
            ((v & 0xff000000) >>> 24) * inv255,
            ((v & 0x00ff0000) >>> 16) * inv255,
            ((v & 0x0000ff00) >>> 8) * inv255,
            ((v & 0x000000ff)) * inv255
        );
    }

    public static random(): Color {
        return Color.fromHex(Math.random() * 0xffffffff);
        // return new Color(Math.random(), Math.random(), Math.random(), Math.random());
    }

    /**
     * WebGl需要值范围在 0 ~ 1 之间
     * 
     * @type {number}
     */
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    /**
     * Creates an instance of Color.
     * 
     * @param {number} [r=1] 0~1 之间
     * @param {number} [g=1] 0~1 之间
     * @param {number} [b=1] 0~1 之间
     * @param {number} [a=1] 0~1 之间
     */
    constructor(r: number = 1, g: number = 1, b: number = 1, a: number = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public reset(r: number = 1, g: number = 1, b: number = 1, a: number = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public reset255(r: number = 255, g: number = 255, b: number = 255, a: number = 255) {
        this.a255 = a;
        this.r255 = r;
        this.g255 = g;
        this.b255 = b;
    }

    public get r255(): number {
        return Math.round(this.r * 255);
    }

    public set r255(v: number) {
        if (isNaN(v))
            return;

        this.r = v / 255;
    }

    public get g255(): number {
        return Math.round(this.g * 255);
    }

    public set g255(v: number) {
        if (isNaN(v))
            return;

        this.g = v / 255;
    }

    public get b255(): number {
        return Math.round(this.b * 255);
    }

    public set b255(v: number) {
        if (isNaN(v))
            return;

        this.b = v / 255;
    }

    public get a255(): number {
        return Math.round(this.a * 255);
    }

    public set a255(v: number) {
        if (isNaN(v))
            return;

        this.a = v / 255;
    }

    /**
     *  设置 0xRRGGBBAA 格式
     */
    public set hex(v: number) {
        this.r255 = ((v & 0xff000000) >>> 24);
        this.g255 = ((v & 0x00ff0000) >>> 16);
        this.b255 = ((v & 0x0000ff00) >>> 8);
        this.a255 = ((v & 0x000000ff));
    }

    /**
     * 返回 16进制数字 RRGGBBAA 格式
     * 
     * @type {number}
     */
    public get hex(): number {
        return (this.r255 << 24) | (this.g255 << 16) | (this.b255 << 8) | (this.a255);
    }

    public toFloat32Array(target?: Float32Array): Float32Array {
        if (!target) {
            target = new Float32Array(4);
        }
        target[0] = this.r;
        target[1] = this.g;
        target[2] = this.b;
        target[3] = this.a;
        return target;
    }

    public equal(c: Color): boolean {
        let e = 0.001;
        if (Math.abs(this.r - c.r) > e
            || Math.abs(this.g - c.g) > e
            || Math.abs(this.b - c.b) > e
            || Math.abs(this.a - c.a) > e) {
            return false;
        }
        return true;
    }

    public clone(): Color {
        return new Color(this.r, this.g, this.b, this.a);
    }

    public toString() {
        return `rgba(${this.r255}, ${this.g255}, ${this.b255}, ${this.a255})`;
    }


}
