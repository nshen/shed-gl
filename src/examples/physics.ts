import { VertexBuffer, Color, Context, Program } from "../";
import { topleft2D, center2D } from "@shed/math";
import Wireframe from "./Wireframe";
import { Engine, Render, World, Bodies } from "matter-js";

function init(gl: WebGLRenderingContext) {

    let ctx = new Context(gl);

    let pyEngine = Engine.create();
    let world = pyEngine.world;

    // create a renderer
    var render = Render.create({
        canvas: document.getElementById('d') as HTMLCanvasElement,
        engine: pyEngine,
        options: {
            background: 'transparent',
            width: ctx.width,
            height: ctx.height,

        }
    });
    render.options.wireframeBackground = 'transparent';
    render.options.background = 'transparent';

    //---------------------------
    // physics

    // create two boxes and a ground
    var boxA = Bodies.rectangle(400, 200, 80, 80);
    var boxB = Bodies.rectangle(450, 50, 80, 80);
    var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    // add all of the bodies to the world
    World.add(world, [boxA, boxB, ground]);

    // run the engine
    // Engine.run(pyEngine);
    // run the renderer
    // Render.run(render);


    //----------------------------  
    // my render
    //-------------------------------

    let renderer = new Wireframe(ctx, 99999);
    renderer.mvpMatrix = topleft2D(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.penColor = Color.YELLOW;
    renderer.backgroundColor = Color.BLACK

    

    // -------------------------
    // loop


    let timePrev: number = 0;
    let delta: number = 1000 / 60; // 16.6
    let deltaMin = delta;
    let deltaMax = 1000 / 30;

    function loop(time: number) {
        delta = time - timePrev;
        // limit delta 30 ~ 60
        delta = delta < deltaMin ? deltaMin : delta;
        delta = delta > deltaMax ? deltaMax : delta;
        timePrev = time;
        Engine.update(pyEngine, delta);
        Render.world(render);

        renderer.clear();
        renderer.drawRect(boxA.position.x - 80 / 2, boxA.position.y - 80 / 2, 80, 80);
        renderer.drawRect(boxB.position.x - 80 / 2, boxB.position.y - 80 / 2, 80, 80);
        renderer.drawRect(ground.position.x - 810 / 2, ground.position.y - 60 / 2, 810, 60);
        renderer.drawArrow(0,0,500,500,Color.WHITE);

        renderer.drawEllipse(500,500,500,200,100);
        renderer.drawCircle(500,500,300,8);
        renderer.flush();

        // requestAnimationFrame(loop);
        // console.log(delta);
    }

    let loopId = requestAnimationFrame(loop)
}


let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
let gl = WebGLDebugUtils.makeDebugContext(canvas.getContext('webgl'));
if (gl) {

    init(gl)
} else {
    console.log('no webgl support');
}

