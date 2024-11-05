#!/bin/bash

MS_HOME=./

MS_JAR=backend/build/libs/backend-1.0.0.jar

RUNASUSER=root;

JAVA_HOME=/usr/local/jdk1.8.0_60; # <-- EDIT THIS, Where is your JDK/JRE?
PATH=${JAVA_HOME}/bin:${PATH};
SHUTDOWN_WAIT=20; # before issuing kill -9 on process.

export PATH JAVA_HOME

OPTIONS="
-Dserver.port=8080
-Dspring.profiles.active=development
--enable-preview
-DDATABASE_URL=localhost:5432/szakal
-DJWT_SECRET=fdsih59543u98gufdoh857y4u9yhtrytr4564876984jy6uth6iu43u4983hjytrpoew-=00-
-DDATABASE_USERNAME=postgres
-DDATABASE_PASSWORD=postgres
-DHEROKU_APP_DEFAULT_DOMAIN_NAME=test.com
";
#=-= END OF CUSTOM CONFIGURATION =-=#

# Try to get PID of spring jar/war
MS_PID=`ps fax|grep java|grep "${MS_JAR}"|awk '{print $1}'`
export MS_PID;

# Function: run_as
run_as() {
    local iam iwant;

    iam=$(id -nu);
    iwant="$1";
    shift;

    if [ "${iam}" = "${iwant}" ]; then {
    eval $* > backend.log &
    }
    else {
      echo $iam
      echo $iwant
    /bin/su -p -s /bin/bash ${iwant} "${*}" > backend.log &
    } fi;
}

# Function: start
start() {
  pid=${MS_PID}
  if [ -n "${pid}" ]; then {
    echo "Micro service is already running (pid: ${pid})";
  }
  else {
    # Start screener ms
    echo "Starting micro service";
    cd $MS_HOME
    run_as ${RUNASUSER} java -jar ${OPTIONS} ./${MS_JAR};
    echo "Awaiting app to be available at port 8080"
    while ! netstat -tna | grep 'LISTEN\>' | grep -q ':8080\>'; do
      sleep 5 # time in seconds, tune it as needed
    done
    echo "App started"
    # java -jar ${OPTIONS} ./${MS_JAR}
  } fi;
  # return 0;
}

# Function: stop
stop() {
  pid=${MS_PID}
  if [ -n "${pid}" ]; then {

    run_as ${RUNASUSER} kill -TERM $pid

    echo -ne "Stopping micro service module";

    kwait=${SHUTDOWN_WAIT};

    count=0;
    while kill -0 ${pid} 2>/dev/null && [ ${count} -le ${kwait} ]; do {
      printf ".";
      sleep 1;
      (( count++ ));
    } done;

    echo;

    if [ ${count} -gt ${kwait} ]; then {
      printf "process is still running after %d seconds, killing process" \
    ${SHUTDOWN_WAIT};
      kill ${pid};
      sleep 3;

      # if it's still running use kill -9
      #
      if kill -0 ${pid} 2>/dev/null; then {
        echo "process is still running, using kill -9";
        kill -9 ${pid}
        sleep 3;
      } fi;
    } fi;

    if kill -0 ${pid} 2>/dev/null; then {
      echo "process is still running, I give up";
    }
    else {
      # success, delete PID file, if you have used it with spring boot
       rm -f ${SPRING_BOOT_APP_PID};
    } fi;
  }
  else {
      echo "Micro service is not running";
  } fi;

  #return 0;
}

# Main Code

case $1 in
  start)
    start;
    ;;
  stop)
    stop;
    ;;
  restart)
    stop;
    sleep 1;
    start;
    ;;
  status)
    pid=$MS_PID
    if [ "${pid}" ]; then {
      echo "Micro service module is running with pid: ${pid}";
    }
    else {
      echo "Micro service module is not running";
    } fi;
    ;;
esac

exit 0;