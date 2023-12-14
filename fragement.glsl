#version 300 es

// Fragement shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precison"
precision highp float;

// we need to declare an output for the fragement shader
out vec4 outColor;

void main()
{
    // Just set the output to a constant reddish-purple
    outColor = vec4(1, 0, 0.5, 1);
}