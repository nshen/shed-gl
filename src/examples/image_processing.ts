import { VertexBuffer, Color, Context, Program, Texture } from "../";

let img = new Image();
img.src = './leaves.jpg'
img.onload = () => {
    console.log(img)
    render(img);
}

declare var WebGLDebugUtils:any;

// https://webglfundamentals.org/webgl/lessons/webgl-image-processing.html

function render(img: HTMLImageElement) {

    let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
    let gl = WebGLDebugUtils.makeDebugContext(canvas.getContext('webgl'));
    if (gl) {
        let ctx = new Context(gl);

        ctx.clear(Color.BLUE);

        let vs: string = `
        attribute vec2 a_position;
        uniform vec2 u_resolution;

        attribute vec2 a_texCoord; //
        varying vec2 v_texCoord; //

        void main() {

            vec2 zeroToOne = a_position.xy / u_resolution;
            vec2 zeroToTwo = zeroToOne.xy * 2.0;

            vec2 clipSpace = zeroToTwo - 1.0;
            gl_Position = vec4(clipSpace.xy * vec2(1,-1),0,1);
            // pass the texCoord to the fragment shader
            // The GPU will interpolate this value between points.
            v_texCoord = a_texCoord;
        }`

        let fs: string = `
        precision mediump float;
        uniform sampler2D u_image; //
        uniform vec2 u_textureSize;
        varying vec2 v_texCoord;   //

        void main(){
             // compute 1 pixel in texture coordinates.
             vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
 
             // average the left, middle, and right pixels.
            gl_FragColor = ( texture2D(u_image, v_texCoord) +
            texture2D(u_image, v_texCoord + vec2(onePixel.x, 0.0)) +
            texture2D(u_image, v_texCoord + vec2(-onePixel.x, 0.0))) / 3.0;
            
        }
        `

        let convolution_matrix_fs = `
        precision mediump float;

        // our texture
        uniform sampler2D u_image;
        uniform vec2 u_textureSize;
        uniform float u_kernel[9];
        uniform float u_kernelWeight;

        // the texCoords passed in from the vertex shader.
        varying vec2 v_texCoord;

        void main() {
        vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
        vec4 colorSum =
            texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
            texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
            texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;

        gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1);
            }
        `

        let shader = new Program(ctx, vs, convolution_matrix_fs);
        shader.uVec2('u_resolution', canvas.width, canvas.height)
        shader.uVec2('u_textureSize', img.width, img.height);
        let edgeDetectKernel = [
            -1, -1, -1,
            -1, 8, -1,
            -1, -1, -1
        ];
        shader.uniform1fv('u_kernel', edgeDetectKernel);
        shader.uniform1f('u_kernelWeight', computeKernelWeight(edgeDetectKernel));

        let posBuffer = new VertexBuffer(ctx);
        setRectangle(posBuffer, 0, 0, img.width, img.height);
        posBuffer.addAttribute(shader.getAttributeLocation("a_position"), 2);
        posBuffer.bindAttributes();

        let texCoordBuffer = new VertexBuffer(ctx);
        texCoordBuffer.setData(
            new Float32Array([
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0,
                0.0, 1.0,
                1.0, 0.0,
                1.0, 1.0]))
        texCoordBuffer.addAttribute(shader.getAttributeLocation('a_texCoord'), 2);
        texCoordBuffer.bindAttributes();


        let texture = new Texture(ctx, img);


        // render

        ctx.adjustSize();
        shader.bind();
        posBuffer.bindAttributes();
        ctx.drawArrays(gl.TRIANGLES, 0, 6);



    } else {
        console.log('no webgl support');
    }
}

function setRectangle(buffer: VertexBuffer, x: number, y: number, width: number, height: number) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    buffer.setData(new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), false)
}

function computeKernelWeight(kernel: number[]) {

    let weight = kernel.reduce((prev, curr) => {
        return prev + curr
    })
    return weight <= 0 ? 1 : weight
}