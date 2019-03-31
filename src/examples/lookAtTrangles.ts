import { VertexBuffer, Color, Context, Program } from "../";
import "../debug"

let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
let gl = WebGLDebugUtils.makeDebugContext(canvas.getContext('webgl'));
if (gl) {
    let ctx = new Context(gl);

    const A_POS = 'aPos';
    const A_COLOR = 'aColor';
    const U_V_MATRIX = 'uVMatrix';
    const V_COLOR = 'vColor';

    const VS = `
        attribute vec4 ${A_POS};
        attribute vec4 ${A_COLOR};
        uniform mat4 ${U_V_MATRIX};
        varying vec4 ${V_COLOR};

        void main(){
            gl_Position = ${U_V_MATRIX} * ${A_POS};
            ${V_COLOR} = ${A_COLOR};
        }`;

    const FS = `
        precision mediump float;
        varying vec4 ${V_COLOR};
        void main() {
            gl_FragColor = ${V_COLOR};
        }`;

    let shader = new Program(ctx, VS, FS);
    shader.uMat4(`${U_V_MATRIX}`,new Float32Array([]))
    shader.bind();

    let vb = new VertexBuffer(ctx);
    let verticesColors = new Float32Array([
        // Vertex coordinates and color(RGBA)
        0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // The back green one
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

        0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // The middle yellow one
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

        0.0, 0.5, 0.0, 0.4, 0.4, 1.0,  // The front blue one 
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
    ]);
    vb.setData(verticesColors, false);
    vb.addAttribute(shader.getAttributeLocation(`${A_POS}`), 3);
    vb.addAttribute(shader.getAttributeLocation(`${A_COLOR}`), 3);
    vb.bindAttributes();

    ctx.clear(Color.BLACK);





} else {
    console.log('no webgl support');
}