#version 450

layout(location=0) in vec2 qt_TexCoord0;

layout(location=0) out vec4 fragColor;

layout(std140, binding=0) uniform buf {
    mat4 qt_Matrix;
    float qt_Opacity;

    float time;
} ubuf;

layout(binding=1) uniform sampler2D source;

float maxIter = 5028.0;
float mandelbrot(vec2 uv) {
    float time = clamp(ubuf.time, 0.0, 30.0);
    vec2 z = vec2(0.0, 0.0);
    vec2 c =  10 * (uv - vec2(0.5, 0.5));
    c = c / pow(time, 4.0) - vec2(0.092, 0.873);
    float iter = pow(2.0, ubuf.time/6.0);
    for (float i = 0.0; i < iter; i+= 0.005) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if (dot(z,z) > 4.0) return i/maxIter;
    }
    return 0.0;
}

vec3 hash13(float m) {
    float x = fract(sin(m * 100));
    float y = fract(sin(m + x) * 100);
    float z = fract(sin(x + y) * 100);
    return vec3(z, 0, y);
}

void main() {
    //MANDELBROT
    float m = mandelbrot(qt_TexCoord0.xy);
    vec3 col = vec3(0.0);
    col += hash13(m);
    fragColor = vec4(col, 1.0);
    //-------------------------------------------------------
}
