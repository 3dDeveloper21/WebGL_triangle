/* 
    Objective: Create a triangle on the screen.
*/

function drawTriangle()
{
    // Get HTML Canvas object
    const canvas = document.getElementById('c');

    // check if there is a canvas object - if no canvasd object then break out of drawTriangle
    if(!canvas) {console.log("No Canvas Object"); return;}

    // create WebGL Context
    const gl = canvas.getContext('webgl');

    // check if WebGL Context is supported
    if(!gl) { console.log("WebGL2 is not Supported"); return; }

    // Define data GPU will use - Vertex data
    const vertices = 
    [
        // Top middle
        0.0, 0.5,
        // Bottom left
        -0.5, -0.5,
        // Bottom right
        0.5, -0.5
    ];

    // Float32Array for GPU desired format
    const verticesGPU = new Float32Array(vertices);

    // Create buffer - reserve a new id for new buffer
    // make it the active buffer - bind
    // upload data for this buffer object to the GPU - JS data into GPU buffer object
    const dataBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARAAY_BUFFER, dataBuffer);
    gl.bufferData(gl.ARAAY_BUFFER, verticesGPU, gl.STATIC_DRAW);

    /* Create Shaders*/
    // Vertex Shader
    const vertexShaderSourceCode = `#version 300 es
    prescision mediump float;

    void main(){
        in vec2 vertexPosition;

        void main(){
            gl_Position = vec4(vertexPosition, 0.0, 1.0);
        }
    }`;

    // create shader object
    let vertextShader = gl.createShader(gl.VERTEX_SHADER);

    // Put source code into the gl shader object
    gl.shaderSource(vertextShader, vertexShaderSourceCode);

    // Compile the shader code
    gl.compileShader(vertextShader);


    // Fragment Shader
    let fragmentShaderSourceCode = `#version 300 es
    precision mediump float;

    out vec4 outputColor;

    void main(){
        outputColor = vec4(0.4, 0.6, 0.22, 1.0);
    };`

    // Create shader object
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Put source code into the gl shader object
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);

    // Compile shader
    gl.compileShader(fragmentShader);


    /* Create Program */
    // Create a GLSL program 
    let program = gl.createProgram();
    
    // attach both shaders
    gl.attachShader(program, vertextShader);
    gl.attachShader(program, fragmentShader);

    // Link Program
}

// try and catch for errors
try 
{
    drawTriangle();
} 
catch(err)
{
    console.log(err);
}

    


