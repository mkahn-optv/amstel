AMSTEL
======

Overplay TV app server prototype version. 

Installation
------------

1. Install Git, Node, NPM, Bower, Sails.js (see interwebs for directions)
2. Clone this repo someplace handy
3. In the root folder, `npm update` (you may need to `sudo`)
4. GREP the whole tree for instances of bower.json. Switch to those folders and do `bower update`. This is a bit of a CF right now, and will be fixed in future revs with a shared bower.
5. `sails lift` should yield a running server on `localhost;1337`
6. Set you NeTV homepage (`/psp/homepage`) to the IP address of the server plus the path below. Let's assume your sails server is on 192.168.1.23:
    `http://192.168.1.23:1337/opkg/io.overplay.apppicker/app/tv`