@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to wait for a key stroke before ending
@REM MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ----------------------------------------------------------------------------

@IF "%MAVEN_BATCH_ECHO%" == "on"  echo %MAVEN_BATCH_ECHO%

@setlocal

set ERROR_CODE=0

@REM To isolate internal variables from possible side effects, we use a prefix "MAVEN_PROJECT_JAR_"
set "MAVEN_PROJECT_JAR_MAVENWRAPPER_JAR=%~dp0.mvn\wrapper\maven-wrapper.jar"

@REM ==== START VALIDATION ====
if not "%JAVA_HOME%" == "" goto OkJHome

set "JAVA_EXE=java.exe"
%JAVA_EXE% -version >NUL 2>&1
if %ERRORLEVEL% == 0 goto init

echo.
echo Error: JAVA_HOME is not set and 'java' command could not be found in PATH. >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
echo.
goto error

:OkJHome
set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
if exist "%JAVA_EXE%" goto init

echo.
echo Error: JAVA_HOME is set to an invalid directory. >&2
echo JAVA_HOME = "%JAVA_HOME%" >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
echo.
goto error

@REM ==== END VALIDATION ====

:init

@REM Find the project base dir, i.e. the directory that contains the folder ".mvn".
@REM Fallback to current working directory if not found.

set "MAVEN_PROJECT_JAR_PROJECT_BASE_DIR=%PROJECT_BASE_DIR%"
if not "%MAVEN_PROJECT_JAR_PROJECT_BASE_DIR%" == "" goto endDetectBaseDir

set "MAVEN_PROJECT_JAR_EXEC_DIR=%CD%"
set "MAVEN_PROJECT_JAR_W_DIR=%CD%"
:findBaseDir
if exist "%MAVEN_PROJECT_JAR_W_DIR%\.mvn" (
  set "MAVEN_PROJECT_JAR_PROJECT_BASE_DIR=%MAVEN_PROJECT_JAR_W_DIR%"
  goto endDetectBaseDir
)
set "MAVEN_PROJECT_JAR_W_DIR=%MAVEN_PROJECT_JAR_W_DIR%\.."
if "%MAVEN_PROJECT_JAR_W_DIR%" == "%MAVEN_PROJECT_JAR_W_DIR%\.." goto endDetectBaseDir
goto findBaseDir

:endDetectBaseDir

set "MAVEN_PROJECT_JAR_MAVENWRAPPER_JAR=%MAVEN_PROJECT_JAR_PROJECT_BASE_DIR%\.mvn\wrapper\maven-wrapper.jar"
set "MAVEN_PROJECT_JAR_MAVENWRAPPER_PROPERTIES=%MAVEN_PROJECT_JAR_PROJECT_BASE_DIR%\.mvn\wrapper\maven-wrapper.properties"

@REM  Check if the wrapper jar exists, and if not, download it
if exist "%MAVEN_PROJECT_JAR_MAVENWRAPPER_JAR%" goto run

set "MAVEN_PROJECT_JAR_WRAPPER_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

for /f "tokens=2 delims==" %%i in ('findstr /i "wrapperUrl" "%MAVEN_PROJECT_JAR_MAVENWRAPPER_PROPERTIES%" 2^>nul') do (
  set "MAVEN_PROJECT_JAR_WRAPPER_URL=%%i"
)

echo Downloading Maven Wrapper from %MAVEN_PROJECT_JAR_WRAPPER_URL%

powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $webClient = New-Object System.Net.WebClient; $webClient.DownloadFile('%MAVEN_PROJECT_JAR_WRAPPER_URL%', '%MAVEN_PROJECT_JAR_MAVENWRAPPER_JAR%')"
if %ERRORLEVEL% neq 0 goto error

:run
set "MAVEN_PROJECT_JAR_CLASSWORLD_JAR=%MAVEN_PROJECT_JAR_MAVENWRAPPER_JAR%"
set "MAVEN_PROJECT_JAR_MAIN_CLASS=org.apache.maven.wrapper.MavenWrapperMain"

"%JAVA_EXE%" %MAVEN_OPTS% %MAVEN_DEBUG_OPTS% -classpath "%MAVEN_PROJECT_JAR_CLASSWORLD_JAR%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECT_JAR_PROJECT_BASE_DIR%" %MAVEN_PROJECT_JAR_MAIN_CLASS% %*

if %ERRORLEVEL% neq 0 set ERROR_CODE=%ERRORLEVEL%

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%

if not "%MAVEN_BATCH_PAUSE%" == "on" goto skipPause
:pause
pause
:skipPause

exit /b %ERROR_CODE%

:error
set ERROR_CODE=1
goto end
