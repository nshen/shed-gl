import { VertexBuffer, Color, Context, Program } from "../";

let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
let gl = WebGLDebugUtils.makeDebugContext(canvas.getContext('webgl'));
if (gl) {
    let ctx = new Context(gl);
    

} else {
    console.log('no webgl support');
}