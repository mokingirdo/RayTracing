cmake_minimum_required(VERSION 3.14)

project(RayTracing VERSION 0.1 LANGUAGES CXX)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 REQUIRED COMPONENTS Core Quick ShaderTools OpenGL)

set(PROJECT_SOURCES
        main.cpp
        qml.qrc
)
qt_add_executable(RayTracing
        MANUAL_FINALIZATION
        ${PROJECT_SOURCES}
        shader/fractalShadeer.frag
        shader/fractalVertex.vert
        shader/circles.frag
        shader/kaleidoscope.frag
        shader/reflection.frag
        shader/reflection.vert
        ray.h
        shader/totalRayTracing.frag


)

target_link_libraries(RayTracing
  PRIVATE Qt6::Core Qt6::Quick Qt6::OpenGL Qt6::Gui)

set_target_properties(RayTracing PROPERTIES
    MACOSX_BUNDLE_GUI_IDENTIFIER my.example.com
    MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
    MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}
    MACOSX_BUNDLE TRUE
    WIN32_EXECUTABLE TRUE
)

qt6_add_shaders(${PROJECT_NAME} "porting-example-shaders"
    BATCHABLE
    PRECOMPILE
    OPTIMIZED
    PREFIX
        "/"
    FILES
        "shader/simpleShader.frag"
        "shader/fractalShadeer.frag"
        "shader/fractalVertex.vert"
        "shader/circles.frag"
        "shader/kaleidoscope.frag"
        "shader/reflection.frag"
        "shader/reflection.vert"
        "shader/totalRayTracing.frag"
)
install(TARGETS RayTracing
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR})

if(QT_VERSION_MAJOR EQUAL 6)
    qt_import_qml_plugins(RayTracing)
    qt_finalize_executable(RayTracing)
endif()
