#version 450
layout(location=0) out vec4 fragColor;
layout(location=0) in vec2 qt_TexCoord0;

layout(std140, binding=0) uniform buf {
    mat4 qt_Matrix;
    float qt_Opacity;

    float time;
} ubuf;

layout(binding=1) uniform sampler2D source;

vec3 gradient(float t) {
    vec3 param = vec3(0.263, 0.416, 0.557);
    float val = 6.2;
    return vec3(0.5) + 0.5*sin(val*(param + vec3(t)));
}

void main(void)
{
    vec3 finalColor = vec3(0.0);
    vec2 uv = (qt_TexCoord0.xy - vec2(0.5, 0.5))*4.0;
    float globalLength = length(uv);
    for (float i = 0; i < 5.0; i++) {
        uv = fract(uv*1.5) - 0.5;
        float d = globalLength * exp(length(uv));
        vec3 color = gradient(globalLength + (ubuf.time + i)*0.4);

        d = sin(ubuf.time + d * 8.0)/2.0;
        d = abs(d);
        d = pow(0.01 /d, 1.2);
        finalColor += color * d;
    }
    fragColor = vec4(finalColor, 1.0);
}
