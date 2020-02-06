# 已经转移整合至新地址，此项目不再更新

## https://github.com/nshen/mini-shed/

---


# @shed/gl

这是一个 webGL 的包装，用于简化webGL的API

## 安装

```
npm install @shed/gl
```

## Hello World

```typescript

import {Color, Context } from "@shed/gl";

let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
let gl = canvas.getContext('webgl');
if (gl) {

    // 创建webgl的包装
    let ctx = new Context(gl);
    // 蓝色背景清空
    ctx.clear(Color.BLUE);     

} else {
    console.log('no webgl');
}

```
