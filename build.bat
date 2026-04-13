@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=C:\Program Files\Android\Android Studio\jbr\bin;%PATH%"
echo Using Java:
java -version
echo.
echo Building...
cd /d C:\Users\Ina\Documents\Claude\Projects\KanaQuest\android
call gradlew.bat app:assembleDebug -x lint -x test --configure-on-demand --build-cache
echo.
echo Exit code: %ERRORLEVEL%
