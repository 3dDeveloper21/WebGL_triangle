Fragement information:

The fragment shader in graphics programming, particularly in OpenGL or similar systems, has “out” variables because its primary purpose
 is to provide color and depth values for each pixel fragment that will be rendered on the screen.

	1.	Purpose of Fragment Shader: The fragment shader runs for each pixel fragment that might be drawn to the screen. 
    Its job is to determine the final color and other attributes of each fragment.

	2.	Output Data: The “out” variables in the fragment shader are used to output these calculated values. 
    They are not going “out” to another shader, but rather to the next stage in the rendering pipeline.

	3.	Rendering Pipeline: After the fragment shader, the next stages typically involve tests (like depth testing) and blending. 

    These stages use the output from the fragment shader to determine what actually gets drawn on the screen.
	4.	Final Destination: Ultimately, the output from the fragment shader is used to update the pixels in the framebuffer, which is then displayed on the screen.

So, in summary, the “out” data from the fragment shader is going to the subsequent stages of the rendering pipeline, 
ultimately determining the appearance of pixels on the screen.