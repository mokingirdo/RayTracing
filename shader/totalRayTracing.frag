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

int MAX_DEPTH = 10;

struct Sphere {
    float radius;
    vec3 center;
};

Sphere world[2] = {
    {0.5, vec3(0., 0., -1.)},
    {100, vec3(0., 100.5, -1.)}
};

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

float gamma2(float num)
{
    return num > 0? sqrt(num) : 0;
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

float hit_world(vec3 origin, vec3 dir) {
    float result;
    for(int i = 0; i < world.length(); i++) {
        result = hit_sphere(world[i].center, world[i].radius, origin, dir);
        if(result != -1) return result;
    }
    return result;
}
vec3 get_ray(vec2 in_vec) {
    return vec3((-1 + 2.*in_vec.x) * ubuf.axes, -1 + 2.*in_vec.y, -1.);
}

vec3 calculate_world_color(vec3 ray)
{
    float hit_sph_res = hit_world(vec3(0.001), ray);
    int depth = MAX_DEPTH;
    float result = 0.5;
    vec3 direction;

    while (hit_sph_res >= 0. && depth > 0)
    {
        vec3 N = hit_sph_res * ray - vec3(0., 0., -1.);
        direction = normalize(N) + random_on_unit_sphere(N);
        if (dot(direction, N) < 0) direction = -direction;
        result *= 0.5;
        hit_sph_res = hit_world(vec3(0.), direction);
        depth--;
    }
    if (result != 0.5) {
        float a = (direction.y + 1.);
        return ((1.-a)*vec3(1.0, 1.0, 1.0) + a*vec3(0.5, 0.7, 1.0)) * result;
    }
    return fragColor.rgb;
}

vec3 anti_aliasing_SSAA()
{
    float samples = 64;
    vec3 color = vec3(0.);
    float u = qt_TexCoord0.x;
    float v = qt_TexCoord0.y;
    for(float i = 0; i < samples; i++) {
        u = qt_TexCoord0.x  + rand(vec2(u,v))/ubuf.width;
        v = qt_TexCoord0.y  + rand(vec2(v,u))/ubuf.height;
        vec3 ray = get_ray(vec2(u,v));
        color += calculate_world_color(ray);
    }
    return color/samples;
}

void main(void)
{
    fragColor = vec4(qt_TexCoord0.xy, 0.5, 1.);
    vec3 color = anti_aliasing_SSAA();
    fragColor = vec4(gamma2(color.x), gamma2(color.y), gamma2(color.z), 1.);
}

