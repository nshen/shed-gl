import { Context } from "./Context";

export class IndexBuffer {

    protected static BINDING: IndexBuffer | null;
    protected _ctx: Context;
    protected _glBuffer: WebGLBuffer;
    protected _glUsage: number; // gl.DYNAMIC_DRAW | gl.STATIC_DRAW

    constructor(ctx: Context, dynamic: boolean = false) {

        this._ctx = ctx;
        let gl = this._ctx._gl;
        this._glBuffer = gl.createBuffer() as WebGLBuffer;
        this._glUsage = dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
    }

    setData(data: Uint16Array) {
        this.bind();
        let gl = this._ctx._gl;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, this._glUsage)

    }

    bind() {
        if (IndexBuffer.BINDING === this)
            return;
        let gl = this._ctx._gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glBuffer);
        IndexBuffer.BINDING = this;
    }

    unbind() {
        if (IndexBuffer.BINDING !== this)
            return;
        let gl = this._ctx._gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        IndexBuffer.BINDING = null;
    }

    dispose() {
        this.unbind();
        this._ctx._gl.deleteBuffer(this._glBuffer);
    }
}