function helloTriangle()
{
    let canvas = document.getElementById('c');
    if(!canvas)
    {
        console.log(' no canvas');
    }

    // WebGL context
    const gl = canvas.getContext('webgl2');
    if(!gl){
        console.log('no WebGL 2 support');
    }

    // define data GPU will use - vertex positions
    const triangleVertices = 
    [
        // Top middle
        0.0, 0.5,
        // Bottom left
        -0.5, -0.5,
        // Bottom right
        0.5, -0.5
    ];

    // GPU format
    const triangleVerticesGPUBuffer = new Float32Array(triangleVertices);

    // Send data to GPU - create buffer on GPU, bind point, use this data
    const triangleGeoBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer); // ARRAY_BUFFER informs GPU this will be for vertex data
    gl.bufferData(gl.ARRAY_BUFFER, triangleVerticesGPUBuffer, gl.STATIC_DRAW); // now memory is created in GPU

    // Vertex Shader
    const vertexShaderSourceCode = `#version 300 es
    precision mediump float;

    in vec2 vertexPosition;

    void main()
    {
        gl_Position = vec4(vertexPosition, 0.0, 1.0);
    }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
    gl.compileShader(vertexShader);

    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        const compileError = gl.getShaderInfoLog(vertexShader);
        console.log(`Failed to COMPILE vertex shader - ${compileError}`);
        return;
    }

    const fragmentShaderSourceCode = `#version 300 es
    precision mediump float;

    out vec4 outputColor;

    void main(){
        outputColor = vec4(0.294, 0.0, 0.51, 1.0);
    }`;

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
    gl.compileShader(fragmentShader);

    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        const compileError = gl.getShaderInfoLog(fragmentShader);
        console.log(`Failed to COMPILE fragment shader - ${compileError}`);
        return;
    }

    // create program + link
    const triangleShaderProgram = gl.createProgram();
    gl.attachShader(triangleShaderProgram, vertexShader);
    gl.attachShader(triangleShaderProgram, fragmentShader);
    gl.linkProgram(triangleShaderProgram);
    if(!gl.getProgramParameter(triangleShaderProgram, gl.LINK_STATUS)){
        const linkError = gl.getProgramInfoLog(triangleShaderProgram);
        showError(`Failed to LINK Shaders - ${linkError}`);
        return;
    }

    // Get attribute location for vertex positions
    const vertexPositionAttributeLocation = gl.getAttribLocation(triangleShaderProgram, 'vertexPosition');
    if(vertexPositionAttributeLocation < 0)
    {
        console.log('Failed to get the attribute location for vertexPosition');
        return;
    } else{
        console.log('attirbute location found for vertexPosition');
    }

    // Output merger
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    // rasterizer - which pixels are part of the triangle we have via vertex shader
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Set GPU program (vertex + fragment shader pair)
    gl.useProgram(triangleShaderProgram);
    gl.enableVertexAttribArray(vertexPositionAttributeLocation);

    // Input assembler - how to read vertices from our GPU triangle buffer
    // gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
    gl.vertexAttribPointer(
        /* index = which attribute to use */
        vertexPositionAttributeLocation,
        /* size = how many components in that attirbute, this cause position has xy(2)  */ 
        2,
        /* type =  whats the data type stored in the GPU buffer for this attribute? */
        gl.FLOAT,
        /* normalized =  determines how to convert ints to floats, if that's what you're doing */
        0,
        /* stride = how many bytes to move forward in the buffer to find the same attribute for the next vertex  */
        0,
        /* offset =  how many btyes should the input assemble skip into the buffer when reading attributes */
        0
    );

    // Draw call (also configures primitive assembly)
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

try {
    helloTriangle();
} catch (e) {
    console.log(e)
}