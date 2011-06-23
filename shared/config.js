var config = {
  tabData: {
    tab1: [
      'This app demonstrates how to use client-side packages to configure element positioning and present different UI themes.',
      'It also shows how to pull content from the cloud.',
      'Click through the other tabs for more information and tips.',
      'Check out <a href="http://docs.feedhenry.com/wiki/App_Anatomy" target="_blank">this link</a> for full documentation on using packages.'
    ],
    tab2: [
      'The "default" package contains the core of the app. It is represented by the directory /client/default.',
      'The main start file for this app is index.html - it\'s full path is /client/default/index.html.',
      'To begin exploring this app, start by looking at the index.html file.'
    ],
    tab3: [
      'The "bottom_nav" package contains an override prefs.js which positions the tabs at the bottom of the app.',
      'The "theme2" package contains a different UI theme - which consists of some different css and different images.',
      'Try adding each of these packages to the Studio Preview under the Configuration accordion item and see the differences after refreshing this preview.'
    ],
    tab4: [
      'The content for the tabs in this app are configured in /shared/config.js',
      'When the app starts up, the latest config is read from the server, and used.',
      'If the config can\'t be retrieved, a fallback of the last known configuration is used.',
      'If there was no last configuration, the app defaults to using the config bundled with the app.',
      'To demonstrate the usefulness of this pattern, the Reload button can be used to update the tab contents after the app has been deployed. From the Studio, edit the contents for any of the tab data in /shared/config.js (after deploying the app to a device) and press the Reload button.'
    ]
  }
};
