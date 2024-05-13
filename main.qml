import QtQuick 2.15
import QtQuick3D
import QtQuick.Window 2.15

Window {
    width: 1240
    height: 880
    visible: true
    title: qsTr("Hello World")

    property real iGlobalTime: 0
    property real iTimeDeltaSpeed: 0.01

    Timer
    {
        id: timer
        running: true
        repeat: true
        interval: 30
        onTriggered:
        {
            iGlobalTime += iTimeDeltaSpeed;
        }
    }

    ShaderEffect {
               width: parent.width
               height: parent.height
               property real frequency: 8
               property real amplitude: 0.1
               property real time: iGlobalTime
               property real axes: width / height

//               NumberAnimation on time {
//                   from: 0; to: 1; duration: 1000; loops: Animation.Infinite;
//               }
//               fragmentShader: "qrc:shader/fractalShadeer.frag.qsb"
//               fragmentShader: "qrc:shader/circles.frag.qsb"
//               fragmentShader: "qrc:shader/kaleidoscope.frag.qsb"
//               fragmentShader: "qrc:shader/reflection.frag.qsb"
//               vertexShader: "qrc:shader/reflection.vert.qsb"
               fragmentShader: "qrc:shader/totalRayTracing.frag.qsb"
           }
}
