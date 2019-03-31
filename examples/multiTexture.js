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

function _defineProperty$1(obj, key, value) {
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

class Vector2D {
  constructor(x = 0, y = 0) {
    _defineProperty$1(this, "x", void 0);

    _defineProperty$1(this, "y", void 0);

    this.x = x;
    this.y = y;
  }
  /**
   * 两点间线性插值
   * @param t t 为 0 ~ 1 之间的小数，为 0 则结果为 v1，为 1 则结果为 v2
   * @param out 省略则返回一个新创建的 Vector2D 否则复制到 out 向量
   */


  static Lerp(v1, v2, t = 0, out) {
    let nx = v1.x + (v2.x - v1.x) * t;
    let ny = v1.y + (v2.y - v1.y) * t; // same as
    // nx = v1.x * (1 - t) + v2.x * t;
    // ny = v1.y * (1 - t) + v2.y * t;

    if (out) {
      out.x = nx;
      out.y = ny;
      return out;
    }

    return new Vector2D(nx, ny);
  }
  /**
   * 返回一个指定长度的随机方向向量
   * @static
   * @param scale 向量长度，默认为1
   * @param out 省略则返回一个新创建的 Vector2D 否则复制到 out 向量
   */


  static Random(scale = 1, out) {
    let r = Math.random() * 2 * Math.PI;
    let nx = Math.cos(r) * scale;
    let ny = Math.sin(r) * scale;

    if (out) {
      out.x = nx;
      out.y = ny;
      return out;
    }

    return new Vector2D(nx, ny);
  }
  /**
   * 取得两向量之间夹角的弧度值，逆时针为正    
   * @static 
   * @param {Vector2D} v1
   * @param {Vector2D} v2
   * @returns {number} 两向量之间夹角，单位为弧度得
   * 
   * @memberOf Vector2D
   */


  static AngleBetween(v1, v2) {
    return Math.atan2(v1.cross(v2), v1.dot(v2)); //  tan = sin / cos
  }
  /**
   * 极坐标转换为笛卡尔坐标 
   * 
   * @static
   * @param {number} len 半径长度
   * @param {number} radians 弧度值
   * @returns
   * 
   * @memberOf Vector2D
   */


  static fromPolar(len, radians, out) {
    let nx = len * Math.cos(radians);
    let ny = len * Math.sin(radians);

    if (out) {
      out.x = nx;
      out.y = ny;
      return out;
    }

    return new Vector2D(nx, ny);
  } // getter
  // ------------------------------------------

  /**
   * 取向量长度
   * @type {number}
   * @memberOf Vector2D
   */


  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  /**
   * 设置向量长度
   * @memberOf Vector2D
   */


  set length(value) {
    let angle = Math.atan2(this.y, this.x);
    this.x = Math.cos(angle) * value;
    this.y = Math.sin(angle) * value;
  }
  /**
   * 取向量长度的平方，由于不用开方运算，效率更高
   * @readonly
   * @type {number}
   * @memberOf Vector2D
   */


  get lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }
  /**
   * 是否为0向量
   * @readonly
   * @type {boolean}
   * @memberOf Vector2D
   */


  get isZero() {
    return this.x === 0 && this.y === 0;
  } // public methods
  // ----------------------------------------

  /**
   * 向量相加
   * 
   * @param {Vector2D} v
   * @returns {Vector2D} this = this + v
   * 
   * @memberOf Vector2D
   */


  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  /**
   * 向量相减
   * @param {Vector2D} v
   * @return {Vector2D} this = this - v
   */


  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  /**
   * 向量相乘
   * @param {Vector2D} v
   * @returns {Vector2D} this = this multiply v 
   * 
   * @memberOf Vector2D
   */


  multiply(v) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }
  /**
   * 向量相除
   * 
   * @param {Vector2D} v
   * @returns {Vector2D} this  = this / v
   * 
   * @memberOf Vector2D
   */


  divide(v) {
    this.x /= v.x;
    this.y /= v.y;
    return this;
  }
  /**
   * 缩放向量
   * 
   * @param {number} s
   * @returns {Vector2D} this = this * s
   * 
   * @memberOf Vector2D
   */


  scale(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }
  /**
   * 基于某个点缩放
   * todo: 图形实例
   * @param {Vector2D} point 基于该点缩放
   * @param {number} sx (description)
   * @param {number} sy (description)
   * @returns {Vector2D} (description)
   */


  scaleAbout(point, sx, sy) {
    ///////////////////////////
    // |sx  0  px(1-sx)|     x
    // |0  sy  py(1-sy)|  *  y
    // |0   0      1   |     1
    ////////////////////////////
    this.x = sx * this.x + point.x * (1 - sx);
    this.y = sy * this.y + point.y * (1 - sy);
    return this;
  }
  /**
   * 与缩放过的v相加
   * @param {Vector2D} v
   * @param {number} scale
   * @returns {Vector2D}
   * 
   * @memberOf Vector2D
   */


  scaleAndAdd(v, scale) {
    this.x = this.x + v.x * scale;
    this.y = this.y + v.y * scale;
    return this;
  }
  /**
   * 返回从此点到p2点之间的距离
   */


  distanceTo(p2) {
    let x = p2.x - this.x;
    let y = p2.y - this.y;
    return Math.sqrt(x * x + y * y);
  }
  /**
   * 此点到p2距离的平方
   */


  squaredDistanceTo(p2) {
    let x = p2.x - this.x;
    let y = p2.y - this.y;
    return x * x + y * y;
  }
  /**
   * x,y取负
   * @returns {Vector2D}
   * 
   * @memberOf Vector2D
   */


  negate() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }
  /**
   * 转为单位向量,数学上经常在向量上加个小帽子表示 :)
   * @warning 修改自身
   * @returns {Vector2D}
   * 
   * @memberOf Vector2D
   */


  normalize() {
    let len = this.x * this.x + this.y * this.y;

    if (len === 0) {
      this.x = 1;
      this.y = 0;
    } else {
      len = 1 / Math.sqrt(len);
      this.x *= len;
      this.y *= len;
    }

    return this;
  } // ----------------------点乘的性质--------------------------//
  // a点乘b == 0 ，两向量垂直
  // a点乘b > 0 ，同向（夹角小于90度）
  // a点乘b < 0 ,反向（夹角大于90度）
  // a点乘b ==  length(a) * length(b)，共线且同向 (如果a与b都为单位向量则等于 +1)
  // a点乘b == -length(a) * length(b) ,共线且逆向（如果a与b都为单位向量则等于 -1）
  // a点乘a == a长度的平方
  // --------------------------------------------------------//

  /**
   * 点乘
   * 结果等于|a||b|cos夹角
   * @param v
   * @returns {number}
   */


  dot(v) {
    return this.x * v.x + this.y * v.y;
  } // ----------------------2d cross--------------------------//
  //
  //    http://allenchou.net/2013/07/cross-product-of-2d-vectors/
  //
  //    the sign of the cross product of 2D vectors tells you whether the second vector is on the left or right side of the first vector .
  //
  // not the most efficient implementation
  //   float cross(const Vec2 &a, const Vec2 &b)
  //    {
  ////       Vec3 v1(a.x, a.y, 0.0f);
  ////       Vec3 v2(b.x, b.y, 0.0f);
  //
  //        return cross(v1, v2).z;
  //    }
  //
  // --------------------------------------------------------//

  /**
   * 2d叉乘
   * 2d叉乘并不常见，与3d不同，结果是一个数值，相当于3d叉乘的z轴
   * 
   * @param {Vector2D} v
   * @returns {number}
   * 
   * @memberOf Vector2D
   */


  cross(v) {
    return this.x * v.y - this.y * v.x;
  }
  /**
   * 返回左垂直向量
   * 
   * @returns {Vector2D} 非单位向量
   * @memberOf Vector2D
   */


  leftHandNormal() {
    let xx = this.x;
    this.x = -this.y;
    this.y = xx;
    return this;
  }
  /**
   * 返回右垂直向量
   * 
   * @returns {Vector2D} 非单位向量
   * @memberOf Vector2D
   */


  rightHandNormal() {
    let xx = this.x;
    this.x = this.y;
    this.y = -xx;
    return this;
  }
  /**
   * 将极坐标转为笛卡尔坐标
   * 
   * @warning 修改自身
   * @param len 半径长度
   * @param radians 弧度值 ,逆时针正角度
   * @param return 返回自身
   */


  fromPolar(len, radians) {
    this.x = len * Math.cos(radians);
    this.y = len * Math.sin(radians);
    return this;
  }
  /**
    * 将此向量转为极坐标输出
    * 
    * @returns {{ len: number; radians: number }} 角度为弧度值表示
    * 
    * @memberOf Vector2D
    */


  toPolar() {
    let len = Math.sqrt(this.x * this.x + this.y * this.y);
    let radians = Math.atan2(this.y, this.x);
    return {
      len: len,
      radians: radians
    };
  }
  /**
   * 按最大长度夹断 
   * 
   * @warning 修改本身
   * @param {number} max 最大长度
   * @returns {Vector2D}
   * 
   * @memberOf Vector2D
   */


  clampMax(max) {
    let l = Math.sqrt(this.x * this.x + this.y * this.y);

    if (l > max) {
      l = max / l;
      this.x *= l;
      this.y *= l;
    }

    return this;
  }
  /**
    * 绕原点旋转一个角度 ，逆时针为正，浮点数计算会有误差
    * 
    * @param {number} radians 弧度值
    * @returns {Vector2D} 旋转后的向量
    * 
    * @memberOf Vector2D
    */


  rotate(radians) {
    // （矩阵乘法） 
    ////////////////////////////////
    //  |cos  -sin  0|      x
    //  |sin   cos  0|  *   y
    //  | 0     0   1|      1
    let cos = Math.cos(radians);
    let sin = Math.sin(radians);
    let _x = this.x;
    let _y = this.y;
    this.x = _x * cos - _y * sin;
    this.y = _x * sin + _y * cos;
    return this;
  }
  /**
   * 绕某个点旋转
   * todo: example
   * 
   * @param {number} radians 弧度值表示的角度
   * @param {Vector2D} point
   * @returns {Vector2D}
   * 
   * @memberOf Vector2D
   */


  rotateAbout(radians, point) {
    let c = this.clone();
    this.sub(point).rotate(radians).add(c);
    return this;
  }
  /**
   * 旋转一个向量表示的角度，与rotate方法类似，但节省了计算sin/cos所以效率更高
   * 要注意如果v非单位向量则旋转后向量长度会改变
   * 
   * @param {Vector2D} v
   * @param {Vector2D} [out]
   * @returns {Vector2D}
   * 
   * @memberOf Vector2D
   */


  rotateByVector(v) {
    let _x = this.x;
    let _y = this.y;
    this.x = _x * v.x - _y * v.y;
    this.y = _x * v.y + _y * v.x;
    return this;
  }
  /**
   *  取得此向量在v向量上的投影向量
   * 
   * @param {Vector2D} v
   * @returns {Vector2D}
   * 
   * @memberOf Vector2D
   */


  getProjV(v) {
    //
    //         /|
    //   this / | 
    //       /  |
    //      --------  v
    //      ProjV
    //
    // -------------------------
    //
    //     |a||b|cos
    //    ----------- b
    let dp = this.x * v.x + this.y * v.y; // this.dot(v)

    let f = dp / (v.x * v.x + v.y * v.y); // divide by |b|^2

    this.x = f * v.x;
    this.y = f * v.y;
    return this;
  }
  /**
    * 
    * 取得此向量在v法线上的投影向量
    * 
    * @param {Vector2D} v
    * @returns {Vector2D}
    * 
    * @memberOf Vector2D
    */


  getPerpV(v) {
    //---------------------------------
    //           /|
    //     this / | PerpV
    //         /  |
    //        --------
    //            v
    // --------------------------------
    // var v:Vector2D = this.getProjV(v);
    let dp = this.x * v.x + this.y * v.y; // this.dot(v)

    let f = dp / (v.x * v.x + v.y * v.y); // divide by |b|^2

    this.x = f * v.x;
    this.y = f * v.y;
    return this;
  }
  /**
   * 根据入射角 = 反射角理论，计算此向量经过法向量反射后的向量
   * @param n 单位法向量
   * @returns {Vector2D} 反射后得到的向量
   */


  reflect(n) {
    //  ---------------------------
    //  tail\  |  / head
    //       \ |n/
    //   head \|/ tail
    //    ------------
    //  --------------------------  
    // v = u - 2(u.n)n
    let nc = n.clone(); // 不能改变 n

    this.sub(nc.scale(2 * this.dot(nc)));
    return this;
  }
  /**
   * 从另一个向量拷贝 xy 值
   * 
   * @param {Vector2D} v
   * @returns {Vector2D}
   * 
   * @memberOf Vector2D
   */


  copyFrom(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
  /**
   * 重设 xy 值 
   * 
   * @warning 此方法修改自身
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @returns {Vector2D}
   * 
   * @memberOf Vector2D
   */


  reset(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    return this;
  }
  /**
   * 复制一个向量
   * 
   * @returns {Vector2D}
   * 
   * @memberOf Vector2D
   */


  clone() {
    return new Vector2D(this.x, this.y);
  }
  /**
   * 输出字符串
   * 
   * @returns {string}
   * 
   * @memberOf Vector2D
   */


  toString() {
    return "[Vector2D] (x:" + this.x + " ,y:" + this.y + ")";
  }

}

class Vector3D {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    _defineProperty$1(this, "x", void 0);

    _defineProperty$1(this, "y", void 0);

    _defineProperty$1(this, "z", void 0);

    _defineProperty$1(this, "w", void 0);

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  get length() {
    return Math.sqrt(this.lengthSquared);
  }

  get lengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  static angleBetween(a, b) {
    return Math.acos(a.dotProduct(b) / (a.length * b.length));
  }
  /**
   * [static] Returns the distance between two points.
   */


  static distance(pt1, pt2) {
    var x = pt1.x - pt2.x;
    var y = pt1.y - pt2.y;
    var z = pt1.z - pt2.z;
    return Math.sqrt(x * x + y * y + z * z);
  }

  add(a) {
    this.x += a.x;
    this.y += a.y;
    this.z += a.z;
    return this;
  }

  sub(a) {
    this.x -= a.x;
    this.y -= a.y;
    this.z -= a.z;
    return this;
  }
  /**
   * 是否为0向量
   */


  get isZero() {
    return this.x === 0 && this.y === 0 && this.z === 0;
  }

  equals(toCompare, allFour = false) {
    return this.x === toCompare.x && this.y === toCompare.y && this.z === toCompare.z && (allFour ? this.w === toCompare.w : true);
  }

  nearEquals(toCompare, tolerance = 0.0001, allFour = false) {
    let abs = Math.abs;
    return abs(this.x - toCompare.x) < tolerance && abs(this.y - toCompare.y) < tolerance && abs(this.z - toCompare.z) < tolerance && (allFour ? abs(this.w - toCompare.w) < tolerance : true);
  }

  clone() {
    return new Vector3D(this.x, this.y, this.z, this.w);
  }
  /**
   * Copies all of vector data from the source Vector3D object into the calling Vector3D object.
   */


  copyFrom(sourceVector3D) {
    this.x = sourceVector3D.x;
    this.y = sourceVector3D.y;
    this.z = sourceVector3D.z;
    this.w = sourceVector3D.w;
  }
  /**
   * Sets the members of Vector3D to the specified values
   */


  setTo(xa, ya, za) {
    this.x = xa;
    this.y = ya;
    this.z = za;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
  }

  scaleBy(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
  }

  normalize() {
    var leng = this.length;
    if (leng != 0) this.scaleBy(1 / leng);
    return leng;
  }

  crossProduct(a) {
    return new Vector3D(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x);
  }

  dotProduct(a) {
    return this.x * a.x + this.y * a.y + this.z * a.z;
  }

  project() {
    if (this.w == 0) return;
    this.x /= this.w;
    this.y /= this.w;
    this.z /= this.w;
  }

  toString() {
    return "[Vector3D] (x:" + this.x + " ,y:" + this.y + ", z:" + this.z + ", w:" + this.w + ")";
  }

}

_defineProperty$1(Vector3D, "X_AXIS", new Vector3D(1, 0, 0));

_defineProperty$1(Vector3D, "Y_AXIS", new Vector3D(0, 1, 0));

_defineProperty$1(Vector3D, "Z_AXIS", new Vector3D(0, 0, 1));

class Matrix2D {
  /**
   * 创建一个3*3矩阵
   * 
   * 使用矩阵后乘列向量的方式执行变换，与 glsl 里顺序一致
  ```
  |  a   b   tx |      x
  |  c   d   ty |  *   y
  |  0   0   1  |      1
  ```
  可以使用静态方法更方便的创建矩阵
  Matrix2D.FromRotation(rad: number)
  Matrix2D.FromTranslation(posX: number, posY: number)
  Matrix2D.FromScaling()
  Matrix2D.SRT()
   */
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    _defineProperty$1(this, "a", void 0);

    _defineProperty$1(this, "b", void 0);

    _defineProperty$1(this, "c", void 0);

    _defineProperty$1(this, "d", void 0);

    _defineProperty$1(this, "tx", void 0);

    _defineProperty$1(this, "ty", void 0);

    _defineProperty$1(this, "_temp", new Float32Array(9));

    _defineProperty$1(this, "multiply", this.prepend);

    // 使用矩阵后乘列向量的方式执行变换，与glsl里顺序一致
    // |  a   b   tx |      x
    // |  c   d   ty |  *   y
    // |  0   0   1  |      1
    // 变换后的新坐标为 
    // x' = ax + by + tx
    // y' = cx + dy + ty
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
  }
  /**
    * 创建一个新的矩阵，顺序执行 scale -> rotate -> translate
    * 
    * @static
    * @param {number} [scaleX=1]
    * @param {number} [scaleY=1]
    * @param {number} [rad=0]
    * @param {number} [tx=0]
    * @param {number} [ty=0]
    * @param {Matrix2D} [out]
    * @returns {Matrix2D}
    * 
    * @memberOf Matrix2D
    */


  static SRT(scaleX = 1, scaleY = 1, rad = 0, tx = 0, ty = 0, out) {
    // 相当于
    // let m: Matrix2D = new Matrix2D();
    // m.scale(scaleX, scaleY);
    // m.rotate(rotation);
    // m.translate(tx, ty);
    let cos = Math.cos(rad);
    let sin = Math.sin(rad);

    if (out) {
      out.a = cos * scaleX;
      out.b = -sin * scaleY;
      out.c = sin * scaleX;
      out.d = cos * scaleY;
      out.tx = tx;
      out.ty = ty;
      return out;
    }

    return new Matrix2D(cos * scaleX, -sin * scaleY, sin * scaleX, cos * scaleY, tx, ty);
  }
  /**
   * 创建缩放矩阵
   * 
   * @static
   * @param {number} scaleX (description)
   * @param {number} scaleY (description)
   * @returns {Matrix2D} (description)
   */


  static FromScaling(scaleX, scaleY) {
    return new Matrix2D(scaleX, 0, 0, scaleY, 0, 0);
  }
  /**
   * 创建位置矩阵
   * 
   * @static
   * @param {number} posX (description)
   * @param {number} posY (description)
   * @returns {Matrix2D} (description)
   */


  static FromTranslation(posX, posY) {
    return new Matrix2D(1, 0, 0, 1, posX, posY);
  }

  /**
   * 创建旋转矩阵
   * 
   * @static
   * @param {number} rad 弧度值
   * @returns {Matrix2D} (description)
   */
  static FromRotation(rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    return new Matrix2D(c, -s, s, c, 0, 0);
  }

  get float32Array() {
    return this.toArray(this._temp, true);
  }
  /**
   * 2*2矩阵行列式，非零则矩阵可逆
   * @returns {number}
   */


  get determinant() {
    return this.a * this.d - this.b * this.c;
  }
  /**
   * identity
   * 
   * @returns {Matrix2D}
   * 
   * @memberOf Matrix2D
   */


  identity() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;
    return this;
  }
  /**
   * 添加一个移动变换
   * 
   * @param {number} tx (description)
   * @param {number} ty (description)
   * @returns {Matrix2D} (description)
   */


  translate(tx, ty) {
    //  1   0   tx     
    //  0   1   ty  *  原矩阵
    //  0   0   1     
    this.tx += tx;
    this.ty += ty;
    return this;
  }
  /**
   * 添加一个缩放变换
   * 
   * @param {number} sx (description)
   * @param {number} sy (description)
   * @returns {Matrix2D} (description)
   */


  scale(sx, sy) {
    //  sx  0   0    
    //  0   sy  0  *  原矩阵
    //  0   0   1     
    this.a *= sx;
    this.b *= sx;
    this.c *= sy;
    this.d *= sy;
    this.tx *= sx;
    this.ty *= sy;
    return this;
  }
  /**
   * 增加一个旋转变换
   * 
   * @param {number} angle (弧度值)
   * @returns {Matrix2D} (description)
   */


  rotate(angle) {
    // |  cos -sin  0|     
    // |  sin  cos  0|  *  原矩阵
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    let _a = this.a;
    let _b = this.b;
    let _c = this.c;
    let _d = this.d;
    let _tx = this.tx;
    let _ty = this.ty;
    this.a = _a * cos - _c * sin;
    this.b = _b * cos - _d * sin;
    this.c = _a * sin + _c * cos;
    this.d = _b * sin + _d * cos;
    this.tx = _tx * cos - _ty * sin;
    this.ty = _tx * sin + _ty * cos;
    return this;
  }
  /**
   * 在此变换矩阵之前增加一个变换
   * 
   * this = this * m
   * 
   * @param {Matrix2D} m (description)
   * @returns {Matrix2D} (description)
   */


  prepend(m) {
    let _a = this.a;
    let _b = this.b;
    let _c = this.c;
    let _d = this.d;
    let _tx = this.tx;
    let _ty = this.ty;
    this.a = _a * m.a + _b * m.c;
    this.b = _a * m.b + _b * m.d;
    this.c = _c * m.a + _d * m.c;
    this.d = _c * m.b + _d * m.d;
    this.tx = _a * m.tx + _b * m.ty + _tx;
    this.ty = _c * m.tx + _d * m.ty + _ty;
    return this;
  }
  /**
   * 后乘矩阵，在此变换矩阵之前增加一个变换
   * 
   * this = this * m
   * 
   * @memberOf Matrix2D
   */


  /**
   * 前乘一个矩阵，在此变换矩阵之后增加一个变换
   * 
   *  this = m * this
   * 
   * @param {Matrix2D} m (description)
   * @returns {Matrix2D} this
   */
  append(m) {
    let _a = this.a;
    let _b = this.b;
    let _c = this.c;
    let _d = this.d;
    let _tx = this.tx;
    let _ty = this.ty;
    this.a = m.a * _a + m.b * _c;
    this.b = m.a * _b + m.b * _d;
    this.c = m.c * _a + m.d * _c;
    this.d = m.c * _b + m.d * _d;
    this.tx = m.a * _tx + m.b * _ty + m.tx;
    this.ty = m.c * _tx + m.d * _ty + m.ty;
    return this;
  }
  /**
   * 用此矩阵转换一个Vector2D表示的点
   * 
   * @param {Vector2D} p (description)
   * @param {Vector2D} [out] (description)
   * @returns {Vector2D} (description)
   */


  transformPoint(p, out) {
    // |  a   b   tx |     x
    // |  c   d   ty |  *  y
    let nx = this.a * p.x + this.b * p.y + this.tx;
    let ny = this.c * p.x + this.d * p.y + this.ty;

    if (out) {
      out.x = nx;
      out.y = ny;
      return out;
    }

    return new Vector2D(nx, ny);
  }
  /**
   * 用此矩阵转换一个向量(仅方向，不包含平移)
   * 
   * @param {Vector2D} v (description)
   * @param {Vector2D} [out=undefined] (description)
   * @returns {Vector2D} (description)
   */


  transformVector(v, out) {
    // |  a   b   tx |     x
    // |  c   d   ty |  *  y
    let nx = this.a * v.x + this.b * v.y;
    let ny = this.c * v.x + this.d * v.y;

    if (out) {
      out.x = nx;
      out.y = ny;
      return out;
    }

    return new Vector2D(nx, ny);
  }
  /**
   * 矩阵求逆
   * 
   * @returns {Matrix2D} (description)
   */
  // todo: 错的貌似


  invert() {
    let det = this.a * this.d - this.b * this.c;

    if (det !== 0) {
      det = 1 / det;
      let _a = this.a;
      let _b = this.b;
      let _c = this.c;
      let _d = this.d;
      let _tx = this.tx;
      let _ty = this.ty;
      this.a = _d * det;
      this.b = -_b * det;
      this.c = -_c * det;
      this.d = _a * det;
      this.tx = (_c * _ty - _d * _tx) * det;
      this.ty = (_b * _tx - _a * _ty) * det;
      return this;
    }

    return null;
  }
  /**
   * copyFrom
   * 
   * @param {Matrix2D} m (description)
   * @returns {Matrix2D} 返回this
   */


  copyFrom(m) {
    this.a = m.a;
    this.b = m.b;
    this.c = m.c;
    this.d = m.d;
    this.tx = m.tx;
    this.ty = m.ty;
    return this;
  }
  /**
   * copyTo
   * 
   * @param {Matrix2D} out (description)
   */


  copyTo(out) {
    out.a = this.a;
    out.b = this.b;
    out.c = this.c;
    out.d = this.d;
    out.tx = this.tx;
    out.ty = this.ty;
    return out;
  }
  /**
   * clone
   * 
   * @returns {Matrix2D} (description)
   */


  clone() {
    return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
  }
  /**
   * 转为Float32Array, 之后可以用 gl.uniformMatrix3fv 上传
   * @param {boolean} [columnMajor=true] WebGL默认需要column major,所以默认会转置
   * @param {Float32Array} [out=undefined] (description)
   * @returns {Float32Array} (description)
   */


  toArray(out, columnMajor = true) {
    if (out === undefined) {
      out = new Float32Array(9);
    } // webGL 默认需要column major这种格式的矩阵
    // [a,c,0,b,d,0,tx,ty,1]
    //
    // | a  c  0 |
    // | b  d  0 |
    // | tx ty 1 |
    //
    // 而我们的矩阵是
    //
    // | a  b  tx|
    // | c  d  ty|
    // | 0  0  1 |
    //
    // 所以默认需要转置


    if (columnMajor) {
      out[0] = this.a;
      out[1] = this.c;
      out[2] = 0;
      out[3] = this.b;
      out[4] = this.d;
      out[5] = 0;
      out[6] = this.tx;
      out[7] = this.ty;
      out[8] = 1;
    } else {
      out[0] = this.a;
      out[1] = this.b;
      out[2] = this.tx;
      out[3] = this.c;
      out[4] = this.d;
      out[5] = this.ty;
      out[6] = 0;
      out[7] = 0;
      out[8] = 1;
    }

    return out;
  }
  /**
   * toString
   * 
   * @returns {string} (description)
   */


  toString() {
    return "[Matrix2D] (a:" + this.a + " ,b:" + this.b + " ,c:" + this.c + " ,d:" + this.d + " ,tx:" + this.tx + " ,ty:" + this.ty + ")";
  }

}

/**
 * 中心为原点,忽略z
 * @param width 
 * @param height 
 * @param flipY 如果为 false 则y轴向上为正，并且 rotation 逆时针为正。并且需要调用flipY确保贴图正确
 */

function center2D(width, height, flipY = true) {
  return new Matrix2D(2 / width, 0, 0, (flipY ? -2 : 2) / height, 0, 0);
}

const A_POS = "aPos";
const A_UV = "aUV";
const U_MVP_MATRIX = "uMVP";
const U_SAPMLER = "uSampler";
const U_SAPMLER1 = "uSampler1";
const V_UV = "vUV";
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
uniform sampler2D ${U_SAPMLER};
uniform sampler2D ${U_SAPMLER1};
varying vec2 ${V_UV};

void main(void) {
    vec4 color0 = texture2D(${U_SAPMLER},${V_UV});
    vec4 color1 = texture2D(${U_SAPMLER1},${V_UV});
    gl_FragColor = color0 * color1;
}`;
let imgLoaded = 0;
let img = new Image();
img.src = './leaves.jpg';

img.onload = () => {
  if (++imgLoaded === 2) render();
};

let img1 = new Image();
img1.src = './tx.jpg';

img1.onload = () => {
  if (++imgLoaded === 2) render();
};

function render() {
  let canvas = document.getElementById('c');
  let gl = WebGLDebugUtils.makeDebugContext(canvas.getContext('webgl', {
    premultipliedAlpha: false
  }));

  if (gl) {
    let ctx = new Context(gl);
    ctx.adjustSize(); // ctx.flipY();

    ctx.clear(Color.BLUE);
    let shader = new Program(ctx, VS, FS); // let m = Matrix2D.SRT(1, 1, 30*Math.PI/180, 479, -469);

    let m = Matrix2D.SRT(1, 1, 0 * Math.PI / 180, 0, 0); // let proj = topleft2D(gl.drawingBufferWidth, gl.drawingBufferHeight);

    let proj = center2D(gl.drawingBufferWidth, gl.drawingBufferHeight); // console.log('proj',proj.transformVector(new Vector2D(479, 469)));

    m.append(proj);
    shader.uMat3(U_MVP_MATRIX, m.float32Array);
    let posBuffer = new VertexBuffer(ctx);
    setRectangle(posBuffer, 0, 0, img.width, img.height); // setRectangle(posBuffer, 0, 0, 958, 938);

    posBuffer.addAttribute(shader.getAttributeLocation(A_POS), 2);
    posBuffer.addAttribute(shader.getAttributeLocation(A_UV), 2);
    posBuffer.bindAttributes();
    let texture = new Texture(ctx, img);
    shader.uSampler2D(U_SAPMLER, texture.bind(0));
    let texture1 = new Texture(ctx, img1);
    shader.uSampler2D(U_SAPMLER1, texture.bind(1)); // render

    ctx.adjustSize();
    ctx.clear();
    shader.bind();
    posBuffer.bindAttributes(); // texCoordBuffer.bindAttributes();

    ctx.drawArrays(gl.TRIANGLES, 0, 6);
  } else {
    console.log('no webgl support');
  }
}

function setRectangle(buffer, x, y, width, height) {
  var x1 = x - width / 2;
  var x2 = x + width / 2;
  var y1 = y - height / 2;
  var y2 = y + height / 2;
  buffer.setData(new Float32Array([x1, y1, 0.0, 0.0, x2, y1, 1.0, 0.0, x1, y2, 0.0, 1.0, x1, y2, 0.0, 1.0, x2, y1, 1.0, 0.0, x2, y2, 1.0, 1.0]), false);
  console.log(x2, y2);
}
//# sourceMappingURL=multiTexture.js.map
