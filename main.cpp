#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <iostream>
#include <QOpenGLExtraFunctions>

using namespace std;
int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    QQmlApplicationEngine engine;
    const QUrl url(QStringLiteral("qrc:/main.qml"));
    QObject::connect(&engine, &QQmlApplicationEngine::objectCreated,
                     &app, [url](QObject *obj, const QUrl &objUrl) {
        if (!obj && url == objUrl)
            QCoreApplication::exit(-1);
    }, Qt::QueuedConnection);
    engine.load(url);

    auto up = std::make_unique<int[]>(10);
    std::unique_ptr<int> ptr = std::make_unique<int>();

    return app.exec();
}
//1
