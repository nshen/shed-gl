import { Context } from "./Context";

export class VertexBuffer {

    protected static BINDING: VertexBuffer | null;

    protected _ctx: Context;
    protected _glBuffer: WebGLBuffer;
    protected _glUsage: number | undefined; // gl.DYNAMIC_DRAW | gl.STATIC_DRAW
    // protected _data: Float32Array;
    protected _attributes: Attribute[] = [];
    protected _stride: number = 0 // 一个点的总 bytes 数

    constructor(ctx: Context) {

        this._ctx = ctx;
        let gl = this._ctx._gl;
        this._glBuffer = gl.createBuffer() as WebGLBuffer;
    }

    setData(data: Float32Array, dynamic: boolean = true): void {
        this.bind();
        let gl = this._ctx._gl;
        this._glUsage = dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
        gl.bufferData(gl.ARRAY_BUFFER, data, this._glUsage)
    }

    /**
     * 
     * @location: 调用 shader.getAttributeLocation("a_position") 获得
     * @numElements: float vec2 vec3 vec4 分别对应1,2,3,4
     */
    addAttribute(location: number, numElements: 1 | 2 | 3 | 4): VertexBuffer {
        let item = new Attribute(location, numElements);
        item.byteOffset = this._stride;
        this._attributes.push(item);
        this._stride += numElements * 4; // 1个 float = 4 bytes
        return this;
    }

    public bindAttributes(): void {
        this.bind()
        let gl = this._ctx._gl;
        let item: Attribute;
        for (let i = 0; i < this._attributes.length; i++) {
            item = this._attributes[i];
            gl.enableVertexAttribArray(item.location);
            gl.vertexAttribPointer(
                item.location,
                item.numElements,
                gl.FLOAT, // item.type
                false,
                this._stride,
                item.byteOffset
            )
        }
    }

    bind() {
        if (VertexBuffer.BINDING === this)
            return;
        let gl = this._ctx._gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._glBuffer);
        VertexBuffer.BINDING = this;
    }

    unbind() {
        if (VertexBuffer.BINDING !== this)
            return;
        let gl = this._ctx._gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        VertexBuffer.BINDING = null;
    }

    dispose() {
        this.unbind();
        this._ctx._gl.deleteBuffer(this._glBuffer);
    }
}

class Attribute {
    byteOffset: number = 0; // 整个元素在开始的byte偏移
    // type = gl.FLOAT
    constructor(public location: number, public numElements: 1 | 2 | 3 | 4) { }
}