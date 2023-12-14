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
        
    ]
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

    


