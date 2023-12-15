"use strict";

/**
 * Objective: Create a triangle on the screen using WebGL
 */


// Create Vertex and Fragment Shaders - inline
// ------------------------- Create Vertex Shader ---------------------------- //
const vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will recieve data from a buffer
in vec2 a_position;

// all shaders have a main function
void main(){

    // gl_Position is a special variable in a vertex shader, 
    // its responsible for setting position for vertex shader
    gl_Position = a_position;
}`;
// ------------------------- End Block Vertex Shader ---------------------------- //


// ------------------------- Create Fragment Shader ---------------------------- //
let fragmentShaderSourceCode = `#version 300 es

// fragment shaders  don't have default precision so we need to pick one.
// highp is a good default. It means "high precision"
precision highp float;

// we need to declare an output for the fragment shader 
out vec4 outColor;

void main(){
    outColor = vec4(1, 0, 0.5, 1);
}`;
// ------------------------- End Fragment Shader ---------------------------- //


// Function to create shaders, upload shader source, compile the shaders
function createShader(gl, type, source)
{
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success) return shader;

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return undefined;
}

// Create program 

// Main function 
function main()
{
    // Get a WebGL context
    let canvas = document.getElementById('#c');
    let gl = canvas.getContext('webgl2');
    if(!gl) 
    {
        console.log("WebGL2 not supported on your browser");
        return;
    }

    // Create GLSL shaders, upload the GLSL source, compile the shaders
    let vertexShader   = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceCode);


}






