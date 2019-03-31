import { VertexBuffer, Color, Context, Program, Texture } from "../";
import { Matrix2D } from "@shed/math";
import { topleft2D, center2D } from "@shed/math";
import { Vector2D } from "@shed/math";

const A_POS: string = "aPos";
const A_COLOR: string = "aColor";
const U_MVP_MATRIX: string = "uMVP";
const U_TINT: string = "uTint";
const U_SAPMLER: string = "uSampler";
const V_COLOR: string = "vColor";

const VS = `
precision mediump float;
attribute vec2 ${A_POS};
attribute vec4 ${A_COLOR};
uniform mat3 ${U_MVP_MATRIX};
varying vec4 ${V_COLOR};

void main(void){
    vec3 coords = ${U_MVP_MATRIX} * vec3(${A_POS}, 1.0);
    gl_Position = vec4(coords.xy, 0.0, 1.0);
    ${V_COLOR} = ${A_COLOR};
}`;

const FS = `
precision mediump float;
uniform vec3 ${U_TINT};
varying vec4 ${V_COLOR};

void main(void) {
    gl_FragColor = ${V_COLOR};
}`;

let img = new Image();
img.src = './leaves.jpg'
img.onload = () => {
    render(img);
}


function render(img: HTMLImageElement) {

    let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
    let gl = WebGLDebugUtils.makeDebugContext(canvas.getContext('webgl', {
        premultipliedAlpha: false

    })) as WebGLRenderingContext;
    if (gl) {
        let ctx = new Context(gl);
        ctx.registMouseDown((x: number, y: number) => {
            console.log(x, y);
        })

        // ctx.flipY();
        ctx.clear(Color.BLUE);
        ctx.adjustSize();
        let shader = new Program(ctx, VS, FS);
        shader.uVec3(U_TINT, 1, 1, 1);

        let m = Matrix2D.SRT(1, 1, 0 * Math.PI / 180, 0, 0);
        let proj = topleft2D(gl.drawingBufferWidth, gl.drawingBufferHeight);
        m.append(proj);
        shader.uMat3(U_MVP_MATRIX, m.float32Array);


        let posBuffer = new VertexBuffer(ctx);
        // setRectangle(posBuffer, 0, 0, 958, 938);
        posBuffer.addAttribute(shader.getAttributeLocation(A_POS), 2);
        posBuffer.addAttribute(shader.getAttributeLocation(A_COLOR), 4);
        posBuffer.bindAttributes();

        // let texCoordBuffer = new VertexBuffer(ctx, false);
        // texCoordBuffer.setData(
        //     new Float32Array([
        //         0.0, 0.0,
        //         1.0, 0.0,
        //         0.0, 1.0,
        //         0.0, 1.0,
        //         1.0, 0.0,
        //         1.0, 1.0]))
        // texCoordBuffer.addAttribute(shader.getAttributeLocation(A_UV), 2);
        // texCoordBuffer.bindAttributes();


        // let texture = new Texture(ctx, img);


        // render

        ctx.adjustSize();
        ctx.clear();

        shader.bind();
        posBuffer.bindAttributes();
        // texCoordBuffer.bindAttributes();


        // drawRect(0, 0, img.width, img.height, Color.RED);
        for (let i = 0; i < 88; i++) {
            drawRect(Math.random() * ctx.width, Math.random() * ctx.height, Math.random() * 400, Math.random() * 300, Color.random());
        }
        console.log('idx', idx);
        posBuffer.setData(bigArray.subarray(0, idx))
        ctx.drawArrays(gl.TRIANGLES, 0, idx / 6);



    } else {
        console.log('no webgl support');
    }
}

let bigArray = new Float32Array(10920 * 6);
let idx = 0;

function drawRect(x: number, y: number, width: number, height: number, color: Color) {
    var x1 = x - width / 2;
    var x2 = x + width / 2;
    var y1 = y - height / 2;
    var y2 = y + height / 2;
    vertex(x1, y1, color);
    vertex(x2, y1, color);
    vertex(x1, y2, color);
    vertex(x1, y2, color);
    vertex(x2, y1, color);
    vertex(x2, y2, color);
}

function vertex(x: number, y: number, color: Color) {
    bigArray[idx++] = x;
    bigArray[idx++] = y;
    bigArray[idx++] = color.r;
    bigArray[idx++] = color.g;
    bigArray[idx++] = color.b;
    bigArray[idx++] = color.a;
}

function flush() {

}



function setRectangle(buffer: VertexBuffer, x: number, y: number, width: number, height: number) {
    var x1 = x - width / 2;
    var x2 = x + width / 2;
    var y1 = y - height / 2;
    var y2 = y + height / 2;
    buffer.setData(new Float32Array([
        x1, y1, 1.0, 0.0, 0.0, 1.0,
        x2, y1, 1.0, 0.0, 0.0, 1.0,
        x1, y2, 1.0, 0.0, 0.0, 1.0,
        x1, y2, 1.0, 0.0, 0.0, 1.0,
        x2, y1, 1.0, 0.0, 0.0, 1.0,
        x2, y2, 1.0, 0.0, 0.0, 1.0
    ]), false)
    console.log(x2, y2)
}

