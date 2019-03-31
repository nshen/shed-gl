import { VertexBuffer, Color, Context, Program } from "../";
import Wireframe from "./Wireframe";
import { topleft2D, center2D, Matrix2D, Vector2D } from "@shed/math";

let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
let gl = WebGLDebugUtils.makeDebugContext(canvas.getContext('webgl'));

if (gl) {
    let ctx = new Context(gl);
    ctx.adjustSize();
    let renderer = new Wireframe(ctx, 99999);
    renderer.penColor = Color.YELLOW;


    // let m = Matrix2D.SRT(1, 1, 0 * Math.PI / 180, 0, 0);
    let proj = center2D(gl.drawingBufferWidth, gl.drawingBufferHeight);
    // m.append(proj);

    renderer.mvpMatrix = proj;

    ctx.clear();
    renderer.penColor = Color.RED;
    renderer.drawLine(0, 0, 500, 0);
    renderer.penColor = Color.random();
    renderer.drawLine(0, 0, 500, 200);
    renderer.penColor = Color.random();
    renderer.drawLine(500, 0, 500, 200);
    renderer.penColor = Color.random();
    renderer.drawLine(0, 0, 0, 200);
    renderer.penColor = Color.random();
    // renderer.drawLine(0, 200, 500, 200);

    renderer.penColor = Color.random();
    renderer.drawLine(500, 0, 0, 200);
    renderer.drawTriangle(0, -100, -100, 100, 100, 100);
    renderer.drawRect(10,10,300,400,Color.GREEN);

    renderer.penColor = Color.RED;
    renderer.drawRectline(0, 0, -200, -200, 300);

    renderer.drawX(-300, -300, 50);
    renderer.drawCircle(0, 0, 300, 10);
    renderer.drawCurve(-300, 0,
        -100, -300,
        100, -600,
        300, 0
        , 50)

    renderer.flush();
} else {
    console.log('no webgl support');
}

