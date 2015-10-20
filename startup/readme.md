Here are system configuration files for the amstel app.

There is currently just and Upstart conf file, amstel.conf.  It starts amstel using "forever" allowing it to run as a daemon.

There is a symbolic link in the /etc/init folder for amstel.conf, so any changes to this script will automatically change the startup s
cripts.
