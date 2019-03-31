'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class Color {
  // 深灰 
  // 浅灰
  // 蓝绿

  /**
   *  颜色混合
   * @static
   * @param {Color} c1
   * @param {Color} c2
   * @param {number} ratio 0~1 之间的值
   * @returns {Color}
   */
  static Mix(c1, c2, ratio) {
    let oneMinusR = 1 - ratio;
    return new Color(c1.r * oneMinusR + c2.r * ratio, c1.g * oneMinusR + c2.g * ratio, c1.b * oneMinusR + c2.b * ratio, c1.a * oneMinusR + c2.a * ratio);
  }

  static fromHex(v) {
    let inv255 = 1 / 255;
    return new Color(((v & 0xff000000) >>> 24) * inv255, ((v & 0x00ff0000) >>> 16) * inv255, ((v & 0x0000ff00) >>> 8) * inv255, (v & 0x000000ff) * inv255);
  }

  static random() {
    return Color.fromHex(Math.random() * 0xffffffff); // return new Color(Math.random(), Math.random(), Math.random(), Math.random());
  }
  /**
   * WebGl需要值范围在 0 ~ 1 之间
   * 
   * @type {number}
   */


  /**
   * Creates an instance of Color.
   * 
   * @param {number} [r=1] 0~1 之间
   * @param {number} [g=1] 0~1 之间
   * @param {number} [b=1] 0~1 之间
   * @param {number} [a=1] 0~1 之间
   */
  constructor(r = 1, g = 1, b = 1, a = 1) {
    _defineProperty(this, "r", void 0);

    _defineProperty(this, "g", void 0);

    _defineProperty(this, "b", void 0);

    _defineProperty(this, "a", void 0);

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  reset(r = 1, g = 1, b = 1, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  reset255(r = 255, g = 255, b = 255, a = 255) {
    this.a255 = a;
    this.r255 = r;
    this.g255 = g;
    this.b255 = b;
  }

  get r255() {
    return Math.round(this.r * 255);
  }

  set r255(v) {
    if (isNaN(v)) return;
    this.r = v / 255;
  }

  get g255() {
    return Math.round(this.g * 255);
  }

  set g255(v) {
    if (isNaN(v)) return;
    this.g = v / 255;
  }

  get b255() {
    return Math.round(this.b * 255);
  }

  set b255(v) {
    if (isNaN(v)) return;
    this.b = v / 255;
  }

  get a255() {
    return Math.round(this.a * 255);
  }

  set a255(v) {
    if (isNaN(v)) return;
    this.a = v / 255;
  }
  /**
   *  设置 0xRRGGBBAA 格式
   */


  set hex(v) {
    this.r255 = (v & 0xff000000) >>> 24;
    this.g255 = (v & 0x00ff0000) >>> 16;
    this.b255 = (v & 0x0000ff00) >>> 8;
    this.a255 = v & 0x000000ff;
  }
  /**
   * 返回 16进制数字 RRGGBBAA 格式
   * 
   * @type {number}
   */


  get hex() {
    return this.r255 << 24 | this.g255 << 16 | this.b255 << 8 | this.a255;
  }

  toFloat32Array(target) {
    if (!target) {
      target = new Float32Array(4);
    }

    target[0] = this.r;
    target[1] = this.g;
    target[2] = this.b;
    target[3] = this.a;
    return target;
  }

  equal(c) {
    let e = 0.001;

    if (Math.abs(this.r - c.r) > e || Math.abs(this.g - c.g) > e || Math.abs(this.b - c.b) > e || Math.abs(this.a - c.a) > e) {
      return false;
    }

    return true;
  }

  clone() {
    return new Color(this.r, this.g, this.b, this.a);
  }

  toString() {
    return `rgba(${this.r255}, ${this.g255}, ${this.b255}, ${this.a255})`;
  }

}

_defineProperty(Color, "TRANSPARENT", new Color(0.0, 0.0, 0.0, 0.0));

_defineProperty(Color, "WHITE", new Color(1.0, 1.0, 1.0, 1.0));

_defineProperty(Color, "BLACK", new Color(0.0, 0.0, 0.0, 1.0));

_defineProperty(Color, "GRAY", new Color(0.5, 0.5, 0.5, 1.0));

_defineProperty(Color, "DARK_GRAY", new Color(0.3, 0.3, 0.3, 1.0));

_defineProperty(Color, "LIGHT_GRAY", new Color(0.7, 0.7, 0.7, 1.0));

_defineProperty(Color, "RED", new Color(1.0, 0, 0, 1.0));

_defineProperty(Color, "GREEN", new Color(0, 1.0, 0, 1.0));

_defineProperty(Color, "BLUE", new Color(0, 0, 1.0, 1.0));

_defineProperty(Color, "YELLOW", new Color(1.0, 1.0, 0, 1.0));

_defineProperty(Color, "CYAN", new Color(0, 1.0, 1.0, 1.0));

class Context {
  constructor(ctx) {
    _defineProperty(this, "_drawCall", 0);

    _defineProperty(this, "_gl", void 0);

    this._gl = ctx;
    this.clearColor = Color.GRAY;
  }

  get width() {
    return this._gl.drawingBufferWidth;
  }

  get height() {
    return this._gl.drawingBufferHeight;
  } // set color


  set clearColor(c) {
    this._gl.clearColor(c.r, c.g, c.b, c.a);
  }

  cullBackFace() {
    let gl = this._gl;
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
  }

  clear(color = null) {
    if (color) this.clearColor = color;

    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    this._drawCall = 0;
  } // turn off the color channel


  colorMask(r, g, b, a) {
    this._gl.colorMask(r, g, b, a);
  }

  flipY(boole = true) {
    this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, boole ? 1 : 0);
  }

  draw() {} //  gl.drawArrays or gl.drawElements
  // 没有indexbuffer时调用
  // @primitiveType: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl. TRIANGLE_FAN.


  drawArrays(primitiveType, offset, count) {
    this._gl.drawArrays(primitiveType, offset, count);
  }

  drawArraysPoints(offset, count) {
    let gl = this._gl;
    gl.drawArrays(gl.POINTS, offset, count);
  }

  drawArraysLines(offset, count) {
    let gl = this._gl;
    gl.drawArrays(gl.LINES, offset, count);
  }

  drawArraysLineStrip(offset, count) {
    let gl = this._gl;
    gl.drawArrays(gl.LINE_STRIP, offset, count);
  }

  drawArraysLineLoop(offset, count) {
    let gl = this._gl;
    gl.drawArrays(gl.LINE_LOOP, offset, count);
  }

  drawArraysTriangles(offset, count) {
    let gl = this._gl;
    gl.drawArrays(gl.TRIANGLES, offset, count);
  }

  drawArraysTriangleStrip(offset, count) {
    let gl = this._gl;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, count);
  }

  drawArraysTriangleFan(offset, count) {
    let gl = this._gl;
    gl.drawArrays(gl.TRIANGLE_FAN, offset, count);
  }

  drawElementsTriangle(count, offset = 0) {
    let gl = this._gl;
    gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, offset);
  }

  viewport(x, y, width, height) {
    this._gl.viewport(x, y, width, height);
  } // 根据css大小设置 drawingbuffer大小 微信环境不支持！！！


  adjustSize() {
    let canvas = this._gl.canvas; // Lookup the size the browser is displaying the canvas.

    var displayWidth = canvas.clientWidth;
    var displayHeight = canvas.clientHeight; // Check if the canvas is not the same size.

    if (canvas.width != displayWidth || canvas.height != displayHeight) {


      canvas.width = displayWidth;
      canvas.height = displayHeight;

      this._gl.viewport(0, 0, displayWidth, displayHeight);
    }
  }

  adjustHDSize(realToCSSPixels = window.devicePixelRatio) {
    let canvas = this._gl.canvas; // Lookup the size the browser is displaying the canvas in CSS pixels
    // and compute a size needed to make our drawingbuffer match it in
    // device pixels.

    var displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels);
    var displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels); // Check if the canvas is not the same size.

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      // Make the canvas the same size
      canvas.width = displayWidth;
      canvas.height = displayHeight;

      this._gl.viewport(0, 0, displayWidth, displayHeight);
    }
  }

  registMouseDown(fun) {
    let gl = this._gl;
    let canvas = gl.canvas;

    canvas.onmousedown = ev => {
      let x = ev.clientX;
      let y = ev.clientY;
      let rect = canvas.getBoundingClientRect();
      fun(x - rect.left, y - rect.top);
    };
  }

}

class Program {
  constructor(ctx, vsSource, fsSource) {
    _defineProperty(this, "_ctx", void 0);

    _defineProperty(this, "_glProgram", void 0);

    _defineProperty(this, "_vsSource", void 0);

    _defineProperty(this, "_fsSource", void 0);

    _defineProperty(this, "_uniformLocationMap", {});

    _defineProperty(this, "_attributeLocationMap", {});

    this._ctx = ctx;
    this._vsSource = vsSource;
    this._fsSource = fsSource;
    this._glProgram = this._createGLProgram(vsSource, fsSource); //  gets all uniforms location

    let gl = this._ctx._gl;
    const numUniforms = gl.getProgramParameter(this._glProgram, gl.ACTIVE_UNIFORMS);
    let uniformInfo;

    for (let i = 0; i < numUniforms; i++) {
      uniformInfo = gl.getActiveUniform(this._glProgram, i);

      if (!uniformInfo) {
        continue;
      }

      var name = uniformInfo.name; // remove the array suffix.

      if (name.substr(-3) === "[0]") {
        name = name.substr(0, name.length - 3);
      }

      this._uniformLocationMap[name] = gl.getUniformLocation(this._glProgram, uniformInfo.name); // uniformInfo.type  , uniformInfo.size
    }

    let numAttribs = gl.getProgramParameter(this._glProgram, gl.ACTIVE_ATTRIBUTES);
    let attribInfo;

    for (let i = 0; i < numAttribs; i++) {
      attribInfo = gl.getActiveAttrib(this._glProgram, i);

      if (!attribInfo) {
        continue;
      }

      this._attributeLocationMap[attribInfo.name] = gl.getAttribLocation(this._glProgram, attribInfo.name);
    }
  }

  getAttributeLocation(attribute) {

    return this._attributeLocationMap[attribute];
  }

  getUniformLocation(uniform) {

    return this._uniformLocationMap[uniform];
  }

  uniformi(uniform, value) {
    this.bind();

    this._ctx._gl.uniform1i(this.getUniformLocation(uniform), value);
  }

  uniform1f(uniform, value) {
    this.bind();

    this._ctx._gl.uniform1f(this.getUniformLocation(uniform), value);
  }
  /**
   * uniform float u_kernel[9] => uniform1fv('u_kernel',[1,1,1,1,1,1,1,1,1])
   * @param uniform 
   * @param value array
   */


  uniform1fv(uniform, value) {
    this.bind();

    this._ctx._gl.uniform1fv(this.getUniformLocation(uniform), value);
  }

  uVec2(uniform, value, value2) {
    this.bind();

    this._ctx._gl.uniform2f(this.getUniformLocation(uniform), value, value2);
  }

  uVec3(uniform, value, value2, value3) {
    this.bind();

    this._ctx._gl.uniform3f(this.getUniformLocation(uniform), value, value2, value3);
  }

  uVec4(uniform, value, value2, value3, value4) {
    this.bind();

    this._ctx._gl.uniform4f(this.getUniformLocation(uniform), value, value2, value3, value4);
  }

  uMat2(uniform, array4) {
    this.bind();

    this._ctx._gl.uniformMatrix2fv(this.getUniformLocation(uniform), false, array4);
  }
  /**
   * upload 3x3 uniform
   * uniform mat3 mvp;
   * uniformMat3('mvp',new Float32Array([1,2,3,4,5,6,7,8,9]))
   * @param uniform 
   * @param array9 
   */


  uMat3(uniform, array9) {
    this.bind();

    this._ctx._gl.uniformMatrix3fv(this.getUniformLocation(uniform), false, array9);
  }

  uMat4(uniform, array16) {
    this.bind();

    this._ctx._gl.uniformMatrix4fv(this.getUniformLocation(uniform), false, array16);
  }
  /**
   * set texture unit n to the sampler
   * @param uniform 
   * @param n 
   *  uniform sampler2D u_Sampler
   *  ctx.uSampler('u_Sampler',0);
   */


  uSampler2D(uniform, n) {
    this.bind();

    this._ctx._gl.uniform1i(this.getUniformLocation(uniform), n);
  }

  bind() {
    if (Program.BINDING === this) {
      return this;
    }

    this._ctx._gl.useProgram(this._glProgram);

    Program.BINDING = this;
    return this;
  }

  unbind() {
    if (Program.BINDING !== this) return;

    this._ctx._gl.useProgram(null);

    Program.BINDING = null;
  }

  _createGLProgram(vsSource, fsSource) {
    let gl = this._ctx._gl;
    let vsShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vsShader, vsSource);
    gl.compileShader(vsShader);

    let fsShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fsShader, fsSource);
    gl.compileShader(fsShader);

    let pm = gl.createProgram();
    gl.attachShader(pm, vsShader);
    gl.attachShader(pm, fsShader);
    gl.linkProgram(pm);


    gl.deleteShader(vsShader);
    gl.deleteShader(fsShader);
    return pm;
  }

  dispose() {
    this.unbind();

    this._ctx._gl.deleteProgram(this._glProgram);
  }

}

_defineProperty(Program, "BINDING", void 0);

class VertexBuffer {
  // gl.DYNAMIC_DRAW | gl.STATIC_DRAW
  // protected _data: Float32Array;
  // 一个点的总 bytes 数
  constructor(ctx) {
    _defineProperty(this, "_ctx", void 0);

    _defineProperty(this, "_glBuffer", void 0);

    _defineProperty(this, "_glUsage", void 0);

    _defineProperty(this, "_attributes", []);

    _defineProperty(this, "_stride", 0);

    this._ctx = ctx;
    let gl = this._ctx._gl;
    this._glBuffer = gl.createBuffer();
  }

  setData(data, dynamic = true) {
    this.bind();
    let gl = this._ctx._gl;
    this._glUsage = dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
    gl.bufferData(gl.ARRAY_BUFFER, data, this._glUsage);
  }
  /**
   * 
   * @location: 调用 shader.getAttributeLocation("a_position") 获得
   * @numElements: float vec2 vec3 vec4 分别对应1,2,3,4
   */


  addAttribute(location, numElements) {
    let item = new Attribute(location, numElements);
    item.byteOffset = this._stride;

    this._attributes.push(item);

    this._stride += numElements * 4; // 1个 float = 4 bytes

    return this;
  }

  bindAttributes() {
    this.bind();
    let gl = this._ctx._gl;
    let item;

    for (let i = 0; i < this._attributes.length; i++) {
      item = this._attributes[i];
      gl.enableVertexAttribArray(item.location);
      gl.vertexAttribPointer(item.location, item.numElements, gl.FLOAT, // item.type
      false, this._stride, item.byteOffset);
    }
  }

  bind() {
    if (VertexBuffer.BINDING === this) return;
    let gl = this._ctx._gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this._glBuffer);
    VertexBuffer.BINDING = this;
  }

  unbind() {
    if (VertexBuffer.BINDING !== this) return;
    let gl = this._ctx._gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    VertexBuffer.BINDING = null;
  }

  dispose() {
    this.unbind();

    this._ctx._gl.deleteBuffer(this._glBuffer);
  }

}

_defineProperty(VertexBuffer, "BINDING", void 0);

class Attribute {
  // 整个元素在开始的byte偏移
  // type = gl.FLOAT
  constructor(location, numElements) {
    this.location = location;
    this.numElements = numElements;

    _defineProperty(this, "byteOffset", 0);
  }

}

class IndexBuffer {
  // gl.DYNAMIC_DRAW | gl.STATIC_DRAW
  constructor(ctx, dynamic = false) {
    _defineProperty(this, "_ctx", void 0);

    _defineProperty(this, "_glBuffer", void 0);

    _defineProperty(this, "_glUsage", void 0);

    this._ctx = ctx;
    let gl = this._ctx._gl;
    this._glBuffer = gl.createBuffer();
    this._glUsage = dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
  }

  setData(data) {
    this.bind();
    let gl = this._ctx._gl;
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, this._glUsage);
  }

  bind() {
    if (IndexBuffer.BINDING === this) return;
    let gl = this._ctx._gl;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glBuffer);
    IndexBuffer.BINDING = this;
  }

  unbind() {
    if (IndexBuffer.BINDING !== this) return;
    let gl = this._ctx._gl;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    IndexBuffer.BINDING = null;
  }

  dispose() {
    this.unbind();

    this._ctx._gl.deleteBuffer(this._glBuffer);
  }

}

_defineProperty(IndexBuffer, "BINDING", void 0);

// TODO: gl.TEXTURE_CUBE_MAP
class Texture {
  constructor(ctx, image, useMipMaps = false) {
    _defineProperty(this, "_ctx", void 0);

    _defineProperty(this, "_glTexture", void 0);

    _defineProperty(this, "_boundUnit", 0);

    _defineProperty(this, "_useMipMaps", false);

    this._ctx = ctx;
    this._glTexture = ctx._gl.createTexture();
    this._useMipMaps = useMipMaps;
    if (image) this.image = image;
  }

  set image(image) {

    this.bind(this._boundUnit);
    let gl = this._ctx._gl;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); // To prevent texture wrappings

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    if (this._useMipMaps && this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // For pixel-graphics where you want the texture to look "sharp" do the following:
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    }
  }

  bind(unit = 0) {
    if (Texture.BINDING === this && unit === this._boundUnit) return unit;
    let gl = this._ctx._gl;
    this._boundUnit = unit;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
    Texture.BINDING = this;
    return unit;
  }

  unbind() {
    if (Texture.BINDING !== this) return;
    let gl = this._ctx._gl;
    gl.activeTexture(gl.TEXTURE0 + this._boundUnit);
    gl.bindTexture(gl.TEXTURE_2D, null);
    Texture.BINDING = null;
  }
  /**
   * 
   * 只有三个值合法
   * 
      gl.MIRRORED_REPEAT
      gl.CLAMP_TO_EDGE;
      gl.REPEAT
   */


  setWraps(uWrap, vWrap) {
    this.bind(this._boundUnit);
    let gl = this._ctx._gl;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, uWrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, vWrap);
  } // NEAREST = choose 1 pixel from the biggest mip
  // LINEAR = choose 4 pixels from the biggest mip and blend them
  // NEAREST_MIPMAP_NEAREST = choose the best mip, then pick one pixel from that mip
  // LINEAR_MIPMAP_NEAREST = choose the best mip, then blend 4 pixels from that mip
  // NEAREST_MIPMAP_LINEAR = choose the best 2 mips, choose 1 pixel from each, blend them
  // LINEAR_MIPMAP_LINEAR = choose the best 2 mips.choose 4 pixels from each, blend them


  setFilters(minFilter, magFilter) {
    let gl = this._ctx._gl;
    this.bind(this._boundUnit);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  }

  isPowerOf2(n) {
    return (n & n - 1) === 0;
  }

}

_defineProperty(Texture, "BINDING", void 0);

let img = new Image();
img.src = './leaves.jpg';

img.onload = () => {
  console.log(img);
  render(img);
};

function render(img) {
  let canvas = document.getElementById('c');
  let gl = WebGLDebugUtils.makeDebugContext(canvas.getContext('webgl'));

  if (gl) {
    let ctx = new Context(gl);
    ctx.clear(Color.BLUE);
    let vs = `
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
        }`;
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
        `;
    let shader = new Program(ctx, vs, convolution_matrix_fs);
    shader.uVec2('u_resolution', canvas.width, canvas.height);
    shader.uVec2('u_textureSize', img.width, img.height);
    let edgeDetectKernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];
    shader.uniform1fv('u_kernel', edgeDetectKernel);
    shader.uniform1f('u_kernelWeight', computeKernelWeight(edgeDetectKernel));
    let posBuffer = new VertexBuffer(ctx);
    setRectangle(posBuffer, 0, 0, img.width, img.height);
    posBuffer.addAttribute(shader.getAttributeLocation("a_position"), 2);
    posBuffer.bindAttributes();
    let texCoordBuffer = new VertexBuffer(ctx);
    texCoordBuffer.setData(new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]));
    texCoordBuffer.addAttribute(shader.getAttributeLocation('a_texCoord'), 2);
    texCoordBuffer.bindAttributes();
    let texture = new Texture(ctx, img); // render

    ctx.adjustSize();
    shader.bind();
    posBuffer.bindAttributes();
    ctx.drawArrays(gl.TRIANGLES, 0, 6);
  } else {
    console.log('no webgl support');
  }
}

function setRectangle(buffer, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  buffer.setData(new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), false);
}

function computeKernelWeight(kernel) {
  let weight = kernel.reduce((prev, curr) => {
    return prev + curr;
  });
  return weight <= 0 ? 1 : weight;
}
//# sourceMappingURL=image_processing.js.map
