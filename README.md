Overview
========
A FeedHenry App is made up of a number of different components. At its most basic, an app can simply be a set of client-only files. Most apps, however, also have a cloud hosted server-side component (written in JavaScript). There is also an option to have shared JavaScript which can be accessed from both the client and the cloud.

Top Level Components
====================
When a new app is created on the platform, there are three top level directories created. Each of these directories represents a top level component of the app. These directories are:

/client
-------
The client directory contains all files which may be included when an app is built.
The client directory is divided into packages - incremental units of functionality and configuration. Packages are explained in more detail below.

/cloud
------
The /cloud directory contains all server-side JavaScript. At a minimum this directory must contain a file called main.js. All functions assigned to the 'exports' object within main.js are public and can be called from client side JavaScript using $fh.act(). Any other JavaScript files created in the cloud directory need to be required using the nodejs require syntax if you wish to use them e.g. 'require('myfile.js')'.

/shared
-------
The /shared directory contains files which can be included as client side files from the /client directory and also requires in cloud files from files within the /cloud directory.

The most common use case for the /shared directory is to store configuration information (for example in a config.js file). This config.js file would then be included using a standard script tag in the main index.html file (usually within /client/default) - this ensures that the contents of the config.js file are available to the app at all times.

When an app is built, the version of the config.js file as it existed at that point in time is bundled with the app, and this becomes the default configuration for the app. However, the configuration settings may change over time. Rather than having to re-build the app if the configuration changes, a more robust solution is to make a call (on app start up) to a server-side function - using $fh.act() - which will return the latest configuration. If there is network connectivity, the app can retrieve the latest configuration on start up (and store it on device using $fh.data() ). If there is no network connectivity, fall back values can be read for the locally linked config.js file.

Packages
========
Packages can be used to layer functionality or configuration. In a typical scenario, the vast majority of a cross platform application will be consistent across different platforms - the JavaScript business logic and basic html definition of the app UI will be unlikely to change very much. However, there will probably be some aspects of the app that may require customization across different destinations (e.g. showing an in-app back button for iPhone, but using the native back button for Android). This customization and configuration can be achieved by using packages.

What is a package?
------------------
A package is an incremental unit of functionality and/or configuration. A package is represented by a directory within the /client/ directory. The name of the directory is the package name.

Default Package
---------------
Every app will always include the files within the "default" package - represented by the path /client/default/. This is where the core of the client side app will be developed.

Creating New Packages
---------------
New packages can be defined by creating additional directories within the client directory.

Associating Packages
---------------
To associate a particular package with a destination (iPhone, iPad, Android etc), add the "package" (i.e. directory) name to the packages field within the configuration section of the studio.

Multiple Packages
-----------------
Multiple packages can be associated with a destination by adding multiple package names - separated by spaces - to the packages field in the configuration section of the studio. If multiple packages are defined, the packages are applied incrementally - i.e. if the same file exists in multiple packages the order that the packages are listed will determine which package the file is pulled from. The package names are listed in order of significance with the most significant package name listed first. The contents of the default package are always included as the least significant package.
Multiple packages are a very powerful feature, but can also be hard to understand at first. To help with understanding them, an example will follow.

How do packages work
--------------------
When a package is associated with a destination all files within the package directory are included when an app is built. When the same file exists in multiple packages, the file from the most significant package is used. This allows for example, a default style to be defined in a css file (e.g. /client/default/css/theme.css) which will be applied to all destinations by default. To create a custom css file (for tablet devices for example), a new css file could be created with the path /client/tablet/css/theme.css. This effectively creates a package called "tablet" with the file css/theme.css. This package could then be associated with the iPad destination. When the app is next built for iPad, it would be built using the theme.css file from the tablet package.

Practical Example
=================
There is a template app in the App Studio called "App Anatomy" which demonstrates practical examples of using packages to customize app appearance and behavior. The following screen shots are all from the "App Anatomy" template. The name of the packages applied are included with each screen shot.

![Android vs iOS](App-Anatomy/raw/master/android_ios.png)

Default package
---------------
The default package for the "App Anatomy" template app contains the vast majority of the apps code. The following file are contained within the default package:

    /client
      /default/
        /index.html
        /css
          /main.css
          /theme.css
        /img
          /background.png
          /button_sprite.png
          /cloud.png      
          /cloud_active.png
          /index.png
          /index_active.png
          /intro.png
          /intro_active.png
          /logo.png
          /packages.png
          /packages_active.png
        /js
          /init.js
          /iscroll.js
          /prefs.js
          /util.js

Controlling the position of tabs
--------------------------------
Notice that in the above screen shots, the menu, logo and reload elements have different positions based on the package used. This is controlled by modifying the values in prefs.js. For example moving the menu bar can be achieved by simply setting the value of menu_container to “#top1”, “#top2”, “#bottom1” or “#bottom2” within the prefs.js file of the current package.
The prefs.js file contents:

```javascript
var prefs = {
  menu_container : '#top2',
  logo_container : '#top1',
  reload_container : '#bottom1'
};
```

The prefs.js file in the iOS and android package overrides the prefs.js file in the default package. The two files are very similar - the only difference is the value associated with the 'menu_container', 'logo_container' and 'reload_container' key, which tells the app to position navigation at the top for android, and at the bottom for iOS. This is achieved by using a number of ID-based containers: '#top1', '#top2', '#bottom1' and '#bottom2'.
The logic to actually load the tab bar is handled by init.js, which simply reads the menu_container value from the referenced prefs.js file and loads the tab bar into the referenced div.

iScroll
-------
iScroll is a javascript library used to allow scrolling within a fixed sized area. This allows us to have a persistent header and/or footer with a scrollable area inbetween (e.g. A list of tweets).
To use the iScroll library we need to:

### Create a container div that iScroll will use.
```html
<div id="content"></div>
```

### Inside this div create another div
```html
<div id="content">
  <div id="scroller">
    <!-- Your Content Here -->
  </div>
</div>
```

### Add your content
```html
<div id="content">
  <div id="scroller">
    <p>List Item #1</p>
    <p>List Item #2</p>
    <p>List Item #3</p>
    <p>List Item #4</p>
    <p>List Item #5</p>
  </div>
</div>
```

### Set the size of the scrollable area (CSS or Javascript)
```css
#content {
  height: 200px;
}
```

### On $fh.ready initialize the iScroll library
```javascript
var myScroll;

$fh.ready(function() {
  myScroll = new iScroll('content');
});
```

Different Themes
----------------
In the above screenshots it is clear that separate themes are being used in each. This is achieved by applying different packages. To apply these packages the package name (folder name) of the desired theme must be entered in Studio Preview under the Configuration tab. To configure which theme is used for deployment, modify the packages value under the Configuration tab for the platform required.
Three packages are available as examples, default, android and iOS. The important thing to notice here is that the directory and file names within the extra packages exactly match their counter parts from the default package.
The theme.css file in both the default and extra packages is important to take note of. It contains only the CSS rules which change between themes. All common CSS rules are contained in the main.css file within the default package and these rules are used across all packages unless overridden in the package theme.css file.
The following is an extract from the theme.css file in the android package:

```css
p {
  color: white;
}
a{
   color: #2879c7;
}

body {
  background-image: linear-gradient(bottom, rgb(38,43,50) 24%, rgb(3,3,3) 5%);
  background-image: -o-linear-gradient(bottom, rgb(38,43,50) 24%, rgb(3,3,3) 51%);
  background-image: -moz-linear-gradient(bottom, rgb(38,43,50) 24%, rgb(3,3,3) 51%);
  background-image: -webkit-linear-gradient(bottom, rgb(38,43,50) 24%, rgb(3,3,3) 51%);
  background-image: -ms-linear-gradient(bottom, rgb(38,43,50) 24%, rgb(3,3,3) 51%);
  background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0.04, rgb(38,43,50)),
    color-stop(0.81, rgb(3,3,3))
  );
  color: #FDFDFD;
}
```

Using CSS3 Gradients for Theming
--------------------------------
The iOS package theme is different from the others as it uses CSS3 gradients for many of the theming elements. For example a native iOS app bottom menu uses a black to grey gradient as its background which contains a row of icons. The currently selected icon is highlighted using a rounded gradient which transitions from dark to light grey. The entire bottom menu can be created using CSS3 and image files as shown below.

```css
#menu{
  height: 50px;
  padding: 0px;
  z-index: 1;

  position: relative;
  background: #3a3a3a;
  background: -webkit-gradient(linear, left top, left bottom, color-
  stop(0%,#3a3a3a), color-stop(50%,#141414), color-stop(50%,#000000), color-
  stop(100%,#000000));
  background: -webkit-linear-gradient(top, #3a3a3a 0%,#141414 50%,#000000
  50%,#000000 100%);
}

#menu .button_active {
  border-radius: 8px;
  margin: 4px 0px;
  background-repeat: no-repeat;
  background: -webkit-gradient(linear, left top, left bottom, color-
  stop(0%,#616161), color-stop(50%,#434343), color-stop(50%,#353535), color-
  stop(100%,#333333));
  background: -webkit-linear-gradient(top, #616161 0%,#434343 50%,#353535
  50%,#333333 100%);
}

#menu #cloud h2{
  background-size: 25px;
  background-repeat: no-repeat;
  background-image:url(../img/cloud.png);
  background-position: center 12px;
}
#menu #cloud h2:hover,
#menu #cloud h2:focus:hover {
   background-position: center 12px;
  background-image:url(../img/cloud_active.png);
}
```

Updating the configuration
--------------------------
The contents for each of the tabs in this app are configured in /shared/config.js. Each time the app starts up, the latest config is read from the server and used. This allows for elements of the app to be changed post-deploy. This can be demonstrated by deploying the App to a device and launching it. Then modify the shared/config.js file in the studio and save it. Relaunching the app or pressing the 'Reload' button will trigger the app to get the latest config from the server and use it for rendering the app.

The name for this pattern is the Data Loading Design Pattern. This pattern has a dual fallback mechanism so that the app is always able to launch. In the event of a connectivity problem, the config cannot be retrieved from the server. The app will fallback to using the last retrieved config which it would have saved previously to local data storage. If there isn't a local config to use, the app uses the bundled config.js in the shared folder.

Again, this can be demonstrated with the app deployed to a device. If you switch to 'Airplane' mode or turn off networking on the device, this will trigger the first fallback to happen. The shared/config.js file can be modified on the server, and the app won't be able to get the latest configuration. Relaunching the app or pressing 'Reload' wont update any of the content. If you then switch back on network connectivity and reload the app, the updated content will be shown.

Launching the App straight after installing it with network connectivity turned off will force the second fallback to happen. There is no network to get the latest config. In addition, there is no saved previous config. The only remaining option is to used the config bundled with the app.