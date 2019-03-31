import { VertexBuffer, Color, Context, Program, Texture } from "../";
import { Matrix2D ,topleft2D} from "@shed/math";

const A_POS: string = "aPos";
const A_UV: string = "aUV";
// const U_MODEL_MATRIX: string = "uModel";
// const U_VP_MATRIX: string = "uVP";
const U_MVP_MATRIX: string = "uMVP";
const U_TINT: string = "uTint";
const U_SAPMLER: string = "uSampler";
const V_UV: string = "vUV"

const VS = `
precision mediump float;
attribute vec2 ${A_POS};
attribute vec2 ${A_UV};
uniform mat3 ${U_MVP_MATRIX};
varying vec2 ${V_UV};

void main(void){
    vec3 coords = ${U_MVP_MATRIX} * vec3(${A_POS}, 1.0);
    gl_Position = vec4(coords.xy, 0.0, 1.0);
    ${V_UV} = ${A_UV}.xy;
}`;

const FS = `
precision mediump float;
uniform vec3 ${U_TINT};
uniform sampler2D ${U_SAPMLER};
varying vec2 ${V_UV};

void main(void) {
    vec4 c = texture2D(${U_SAPMLER}, ${V_UV});
    gl_FragColor = vec4(c.rgb * ${U_TINT}.rgb , c.a);
}`;

let img = new Image();
img.src = './leaves.jpg'
img.onload = () => {
    render(img);
}


function render(img: HTMLImageElement) {

    let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
    let gl = WebGLDebugUtils.makeDebugContext(canvas.getContext('webgl',{
        premultipliedAlpha:false

    })) as WebGLRenderingContext;
    if (gl) {
        let ctx = new Context(gl);
        // ctx.flipY();
        ctx.clear(Color.BLUE);
        ctx.adjustSize();
        let shader = new Program(ctx, VS, FS);
        shader.uVec3(U_TINT, 0, 1, 1);
        // let m = Matrix2D.SRT(1, 1, 30*Math.PI/180, 479, -469);
        let m = Matrix2D.SRT(1, 1, 40 * Math.PI / 180, 500, 300);

        let proj = topleft2D(gl.drawingBufferWidth, gl.drawingBufferHeight);
        // let proj = center2D(gl.drawingBufferWidth, gl.drawingBufferHeight);
        // console.log('proj',proj.transformVector(new Vector2D(479, 469)));
        m.append(proj);

        shader.uMat3(U_MVP_MATRIX, m.float32Array);


        let posBuffer = new VertexBuffer(ctx);
        setRectangle(posBuffer, 0, 0, img.width, img.height);
        // setRectangle(posBuffer, 0, 0, 958, 938);
        posBuffer.addAttribute(shader.getAttributeLocation(A_POS), 2);
        posBuffer.addAttribute(shader.getAttributeLocation(A_UV), 2);
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


        let texture = new Texture(ctx, img);
        shader.uSampler2D(U_SAPMLER,texture.bind(0));


        // render

        ctx.adjustSize();
        ctx.clear();

        shader.bind();
        posBuffer.bindAttributes();
        // texCoordBuffer.bindAttributes();



        ctx.drawArrays(gl.TRIANGLES, 0, 6);



    } else {
        console.log('no webgl support');
    }
}

function setRectangle(buffer: VertexBuffer, x: number, y: number, width: number, height: number) {
    var x1 = x - width / 2;
    var x2 = x + width / 2;
    var y1 = y - height / 2;
    var y2 = y + height / 2;
    buffer.setData(new Float32Array([
        x1, y1, 0.0, 0.0,
        x2, y1, 1.0, 0.0,
        x1, y2, 0.0, 1.0,
        x1, y2, 0.0, 1.0,
        x2, y1, 1.0, 0.0,
        x2, y2, 1.0, 1.0
    ]), false)
    console.log(x2, y2)
}

