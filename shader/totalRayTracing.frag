//#1
//Full ray tracing logic in one shader
#version 450
layout(location=0) out vec4 fragColor;
layout(location=0) in vec2 qt_TexCoord0;

layout(std140, binding=0) uniform buf {
    mat4 qt_Matrix;
    float qt_Opacity;
    float axes;

    float width;
    float height;
    float time;
} ubuf;

layout(binding=1) uniform sampler2D source;

float rand(vec2 co) {
  return 2 * fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453) - 0.5;
}

vec3 rand_vec3(vec3 co)
{
    return vec3(rand(co.xx), rand(co.yy), rand(co.zz));
}

vec3 random_on_unit_sphere(vec3 n) {
    while (true) {
        vec3 p = rand_vec3(n);
        return normalize(p);
    }
}

float hit_sphere(vec3 center, float r, vec3 origin, vec3 dir)
{
    vec3 a_c = origin - center;
    float a = dot(dir, dir);
    float b = 2. * dot(dir, a_c);
    float c = dot(a_c, a_c) - r*r;
    float discr = b*b - 4* a*c;

    if (discr < 0) return -1.;
    return (-b - sqrt(discr)) / 2.*a;
}

vec3 get_ray(vec2 in_vec) {
    return vec3((-1 + 2.*in_vec.x) * ubuf.axes, -1 + 2.*in_vec.y, -1.);
}

vec3 calculate_sphere__normal(float radius, vec3 center, float x, float y)
{
    vec3 ray = get_ray(vec2(x,y));
    float hit_sph_res = hit_sphere(center, radius, vec3(0.), ray);
    if (hit_sph_res > 0.)
    {
        vec3 N = hit_sph_res * ray - vec3(0., 0., -1.);
        vec3 direction = random_on_unit_sphere(N);
        if (dot(direction, N) < 0) direction = -direction;
        return 0.5*(direction.x + vec3(1.));
    }
    return fragColor.rgb;
}

vec3 anti_aliasing_SSAA(float radius, vec3 center)
{
    float samples = 128;
    vec3 color = vec3(0.);
    float u = qt_TexCoord0.x;
    float v = qt_TexCoord0.y;
    for(float i = 0; i < samples; i++) {
        u = qt_TexCoord0.x  + rand(vec2(u,v))/ubuf.width;
        v = qt_TexCoord0.y  + rand(vec2(v,u))/ubuf.height;
        color += calculate_sphere__normal(radius, center, u, v);
    }
    return color/samples;
}

void main(void)
{
    fragColor = vec4(qt_TexCoord0.xy, 0.5, 1.);
    fragColor = vec4(anti_aliasing_SSAA(100, vec3(0., 100.5, -1.)), 1.);
    fragColor = vec4(anti_aliasing_SSAA(0.5, vec3(0., 0., -1.)), 1.);
    //fragColor = vec4(calculate_sphere__normal(.5, vec3(0.5, .5, -1.)), 1.);
}

