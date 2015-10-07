#! /bin/sh
### BEGIN INIT INFO
# Provides: Amstel
# Required-Start: $remote_fs $syslog
# Required-Stop: $remote_fs $syslog
# Default-Start: 2 3 4 5
# Default-Stop: 0 1 6
# Short-Description: Amstel
# Description: This file starts and stops Amstel server
#
### END INIT INFO

AMSTEL_DIR=/opt/amstel/

case "$1" in
 start)
   su mkahn -c $AMSTEL_DIR/startup.sh
   ;;
 stop)
   su mkahn -c $AMSTEL_DIR/startup.sh
   sleep 10
   ;;
 restart)
   su mkahn -c $AMSTEL_DIR/shutdown.sh
   sleep 20
   su mkahn -c $AMSTEL_DIR/startup.sh
   ;;
 *)
   echo "Usage: amstel {start|stop|restart}" >&2
   exit 3
   ;;
esac