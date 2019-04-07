import { Color } from "./Color";
import { VertexBuffer } from "./VertexBuffer";

export class Context {

    protected _drawCall: number = 0;
    // 
    public _gl: WebGLRenderingContext;

    constructor(ctx: WebGLRenderingContext) {
        this._gl = ctx;
        this.clearColor = Color.GRAY;
    }

    get width() {
        return this._gl.drawingBufferWidth;
    }

    get height() {
        return this._gl.drawingBufferHeight;
    }
    // set color
    set clearColor(c: Color) {
        this._gl.clearColor(c.r, c.g, c.b, c.a);
    }

    set depthTest(b: boolean) {
        let gl = this._gl;
        if (b)
            gl.enable(gl.DEPTH_TEST);
        else
            gl.disable(gl.DEPTH_TEST);
    }

    cullFace(face: 'BACK' | 'FRONT' | 'BOTH' | 'NONE') {
        let gl = this._gl
        switch (face) {
            case 'BACK':
                gl.enable(gl.CULL_FACE);
                gl.cullFace(gl.BACK);
                break;
            case 'FRONT':
                gl.enable(gl.CULL_FACE);
                gl.cullFace(gl.FRONT);
                break;
            case 'BOTH':
                gl.enable(gl.CULL_FACE);
                gl.cullFace(gl.FRONT_AND_BACK);
                break;
            case 'NONE':
                gl.disable(gl.CULL_FACE);
                break;
        }
    }

    clear(color: Color | null = null): void {
        if (color)
            this.clearColor = color;
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
        this._drawCall = 0;
    }

    // turn off the color channel
    colorMask(r: boolean, g: boolean, b: boolean, a: boolean): void {
        this._gl.colorMask(r, g, b, a);
    }

    flipY(boole: boolean = true) {
        this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, boole ? 1 : 0);
    }

    // draw() {
        //  gl.drawArrays or gl.drawElements
    // }

    // 没有indexbuffer时调用
    // @primitiveType: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl. TRIANGLE_FAN.
    drawArrays(primitiveType: number, offset: number, count: number) {
        this._gl.drawArrays(primitiveType, offset, count)
    }
    drawArraysPoints(offset: number, count: number) {
        let gl = this._gl;
        gl.drawArrays(gl.POINTS, offset, count);
    }
    drawArraysLines(offset: number, count: number) {
        let gl = this._gl;
        gl.drawArrays(gl.LINES, offset, count);
    }
    drawArraysLineStrip(offset: number, count: number) {
        let gl = this._gl;
        gl.drawArrays(gl.LINE_STRIP, offset, count);

    }
    drawArraysLineLoop(offset: number, count: number) {
        let gl = this._gl;
        gl.drawArrays(gl.LINE_LOOP, offset, count);

    }
    drawArraysTriangles(offset: number, count: number) {
        let gl = this._gl;
        gl.drawArrays(gl.TRIANGLES, offset, count)
    }
    drawArraysTriangleStrip(offset: number, count: number) {
        let gl = this._gl;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, count);
    }
    drawArraysTriangleFan(offset: number, count: number) {
        let gl = this._gl;
        gl.drawArrays(gl.TRIANGLE_FAN, offset, count);
    }

    drawElementsTriangle(count: number, offset: number = 0) {
        let gl = this._gl;
        gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, offset);
    }

    viewport(x: number, y: number, width: number, height: number) {
        this._gl.viewport(x, y, width, height);
    }

    // 根据css大小设置 drawingbuffer大小 微信环境不支持！！！
    adjustSize() {
        let canvas = this._gl.canvas;
        // Lookup the size the browser is displaying the canvas.
        var displayWidth = canvas.clientWidth;
        var displayHeight = canvas.clientHeight;

        // Check if the canvas is not the same size.
        if (canvas.width != displayWidth ||
            canvas.height != displayHeight) {
            if (__DEBUG__) {
                console.log('context.adjustSize:', displayWidth, displayHeight);
            }

            // Make the canvas the same size
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            this._gl.viewport(0, 0, displayWidth, displayHeight);
        }
    }

    adjustHDSize(realToCSSPixels: number = window.devicePixelRatio) {
        let canvas = this._gl.canvas;

        // Lookup the size the browser is displaying the canvas in CSS pixels
        // and compute a size needed to make our drawingbuffer match it in
        // device pixels.
        var displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels);
        var displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);

        // Check if the canvas is not the same size.
        if (canvas.width !== displayWidth ||
            canvas.height !== displayHeight) {

            // Make the canvas the same size
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            this._gl.viewport(0, 0, displayWidth, displayHeight);
        }
    }

    registMouseDown(fun: (x: number, y: number) => any) {
        let gl = this._gl;
        let canvas = gl.canvas;
        canvas.onmousedown = (ev) => {
            let x = ev.clientX;
            let y = ev.clientY;
            let rect = canvas.getBoundingClientRect();
            fun(x - rect.left, y - rect.top);
        }

    }

}