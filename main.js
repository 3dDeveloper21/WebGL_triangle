"use strict";

// Vertex Shader
let vertexShaderSource = `#version 300 es

    // an attribute is an input (in) to a vertex shaders.
    // It will recieve data from a buffer
    in vec4 = a_position;

    // All shaders have a main function
    void main()
    {
        // gl_Position is a special variable a vertex shader
        // is responsible for a setting
        gl_Position = a_position;
    }`;


// Fragement Shader
var fragementShaderSource =`#version 300 es

    // fragement shader don't have a default precision so we need
    // to pick one. highp is a good default. It means "high precision"
    precision highp float;

    // we need to declare an output for the fragement shader - out to where? GPU?
    out vec4 outColor;

    void main()
    {
        outColor = vec4(1, 0, 0.5, 1);
    }`;


// WEBGL + JS Code
alert('hi')

let canvas = document.querySelector("#c");

// Create a WebGL2RenderingContext
var gl = canvas.getContext("webgl2");
if(!gl)
{
    // no webgl2
    console.log("No WebGL2!");
}

// Create shader
function createShader(gl, type, source)
{
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success)
    {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

// Create Program
function createProgram(gl, vertexShader, fragmentShader)
{
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success)
    {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}


let vertexShader    = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
let fragementShader = createShader(gl, gl.FRAGMENT_SHADER,  fragementShaderSource);
let program = createProgram(gl, vertexShader, fragementShader);

// Now that we've created a GLSL program on the GPU we need to supply data to it. 
// The majority of the WebGL API is about setting up state to supply data to our GLSL programs. 
// In this case our only input to our GLSL program is a_position which is an attribute. 
// The first thing we should do is look up the location of the attribute for the program we just created
let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// Attributes get their data from buffers so we need to create a buffer
let positionBuffer = gl.createBuffer();

// Bind the position buffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Now we can put data in that buffer by referencing it through the bind point
// three 2s points
let positions = 
[
    0, 0,
    0, 0.5,
    0.7, 0
];
// The last argument, gl.STATIC_DRAW is a hint to WebGL about how we'll use the data. 
// WebGL can try to use that hint to optimize certain things. 
// gl.STATIC_DRAW tells WebGL we are not likely to change this data much.
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Now that we've put data in a buffer we need to tell the attribute how to get data out of it. 
// First we need to create a collection of attribute state called a Vertex Array Object.
let vao = gl.createVertexArray();

// And we need to make that the current vertex array so that all of our attribute settings will apply to that set of attribute state
gl.bindVertexArray(vao);

// Now we finally setup the attributes in the vertex array. First off we need to turn the attribute on. 
// This tells WebGL we want to get data out of a buffer. If we don't turn on the attribute then the attribute will have a constant value.
gl.enableVertexAttribArray(positionAttributeLocation);

// Then we need to specify how to pull the data out
let size = 2; // 2 components per iteration
let type = gl.FLOAT; // the data is 32bit floats
let normalize = false; // don't normalize the data
let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
let offset = 0; // start at the beginning of the buffer
gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset
);

// A hidden part of gl.vertexAttribPointer is that it binds the current ARRAY_BUFFER to the attribute. 
// In other words now this attribute is bound to positionBuffer. That means we're free to bind something else to the ARRAY_BUFFER bind point. 
// The attribute will continue to use positionBuffer.
// Note that from the point of view of our GLSL vertex shader the a_position attribute is a vec4: in vec4 a_position
// vec4 is a 4 float value. In JavaScript you could think of it something like a_position = {x: 0, y: 0, z: 0, w: 0}. 
// Above we set size = 2. Attributes default to 0, 0, 0, 1 so this attribute will get its first 2 values (x and y) from our buffer. 
// The z, and w will be the default 0 and 1 respectively.

// Before we draw we should resize the canvas to match its display size. 
// Canvases just like Images have 2 sizes. The number of pixels actually in them and separately the size they are displayed. 
// CSS determines the size the canvas is displayed. You should always set the size you want a canvas with CSS since it is far far more flexible than any other method.
webglUtils.resizeCanvasToDisplaySize(gl.canvas);

// We need to tell WebGL how to convert from the clip space values we'll be setting gl_Position back into pixels, often called screen space. 
// To do this we call gl.viewport and pass it the current size of the canvas.
// This tells WebGL the -1 +1 clip space maps to 0 <-> gl.canvas.width for x and 0 <-> gl.canvas.height for y:
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// We clear the canvas. 0, 0, 0, 0 are red, green, blue, alpha respectively so in this case we're making the canvas transparent.
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);


// Next we need to tell WebGL which shader program to execute.
// Tell it to use our program(pair of shaders)
gl.useProgram(program);

// Then we need to tell it which set of buffers to use and how to pull data out of those buffers to supply to the attributes
// Bind the attribute/buffer set we want
gl.bindVertexArray(vao);

// After all that we can finally ask WebGL to execute our GLSL program.
let primitiveType = gl.TRIANGLES;
let offsetValue = 0;
let count = 3;
gl.drawArrays(primitiveType, offsetValue, count);

// Because the count is 3 this will execute our vertex shader 3 times. The first time a_position.x and a_position.y 
// in our vertex shader attribute will be set to the first 2 values from the positionBuffer. 
// The 2nd time a_position.xy will be set to the 2nd two values. The last time it will be set to the last 2 values.
// Because we set primitiveType to gl.TRIANGLES, each time our vertex shader is run 3 times WebGL will draw a triangle based 
// on the 3 values we set gl_Position to. No matter what size our canvas is those values are in clip space coordinates that go 
// from -1 to 1 in each direction.
// Because our vertex shader is simply copying our positionBuffer values to gl_Position 
// the triangle will be drawn at clip space coordinates: 0, 0, 0, 0.5, 0.7, 0,

/**
 * Converting from clip space to screen space if the canvas size happened to be 400x300 we'd get something like this:
 * clip space      screen space
   0, 0       ->   200, 150
   0, 0.5     ->   200, 225
   0.7, 0     ->   340, 150
 * 

   WebGL will now render that triangle. For every pixel it is about to draw WebGL will call our fragment shader. 
   Our fragment shader just sets outColor to 1, 0, 0.5, 1. Since the Canvas is an 8bit per channel canvas that means 
   WebGL is going to write the values [255, 0, 127, 255] into the canvas.
 */