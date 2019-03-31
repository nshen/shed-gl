import {VertexBuffer, Color, Context, Program } from "../";

let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
let gl = canvas.getContext('webgl');
if (gl) {

    let ctx = new Context(gl);
    ctx.clear(Color.BLUE);

    let vs: string = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    void main() {
        vec2 zeroToOne = a_position.xy / u_resolution;
        vec2 zeroToTwo = zeroToOne.xy * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace.xy * vec2(1,-1),0,1);
    }`

    let fs: string = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1,0,0.5,1);
    }
    `
    let shader = new Program(ctx, vs, fs);
    shader.bind();
    shader.uVec2('u_resolution', canvas.width, canvas.height)

    let posBuffer = new VertexBuffer(ctx);
    posBuffer.addAttribute(shader.getAttributeLocation("a_position"), 2);
    posBuffer.setData(new Float32Array([
        0, 0, 
        80, 20, 
        10, 30, 
       ]));

    // render

    ctx.adjustSize();
    shader.bind();
    posBuffer.bindAttributes();
    ctx.drawArraysTriangles(0,3)


} else {
    console.log('no webgl');
}