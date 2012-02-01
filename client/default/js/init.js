$fh.ready(function () {
  init();
});

var myScroll;

function init () {
  
  myScroll = new iScroll('content');
  
  // Load the menu bar 
  setUpLogo();
  setUpMenuBar(); 
  setUpReloadButton();
  
  // Resolve the data to display in the tabs. Pass setContentPane function 
  // as a callback - we do not want setContentPane called until the tab
  //  data has been loaded.
  getTabData(setContentPane);
  
  
  
  // Show the default tab
  $('.default').show();

  // Bind a click event for each tab
  $('.nav_item').each(function () {
    $(this).bind('click', function (e) {
      var mainTitle = $('.pageTitle').text();
      e.preventDefault();
      var targetId = $(this).find('a').attr('href');

      var title = $(this).find('h2').text();

      $('div').removeClass('button_active');
      $(this).addClass('button_active');
      $('.pageTitle').text(title);

      $('.main_view').hide();
      $(targetId).show(); 
      
      // Resize the scroller for each tab on click
      /*var mainHeight = $(this).outerHeight();
      $(this).height(mainHeight);*/
      myScroll.refresh();
     
    });
  });

  // Bind the function for the reload button so it will refresh the tab data
  $('#reload_button').bind('click', getTabData);
}


 
function setUpMenuBar() {
 // Check prefs to see whenre menu bar should be placed - top or bottom
  var menu_container = $(prefs.menu_container);

  // Get a handle on the hidden menu bar
  var menu = $('#menu');

  // Clone the hidden menu bar into the appropriate container
  menu_container.html(menu.clone());
}

function setUpReloadButton(){
  // Check prefs to see whenre menu bar should be placed - top or bottom
  var reload_container = $(prefs.reload_container);

  // Clone the hidden menu bar into the appropriate container
  reload_container.html("<input id='reload_button' type='button' value='Reload'>");
}



function setUpLogo(){
  // Check prefs to see whenre menu bar should be placed - top or bottom
  var logo_container = $(prefs.logo_container);

  // Clone the hidden menu bar into the appropriate container
  logo_container.html(" <div id='logo'><img id='logo' src='img/logo.png'/></div>");
}


function getTabData(callback) {

  // Default value for tab data is local version of config.js
  // Get the text for the tabs from the config.js file
  var configData = config;
  
  // Make act call to get latest config from server
  $fh.act({
    act: 'getConfig',
    req: {
      ts: Date.now()
    }
  }, function (result) {
    // Got config from server, so overwrite our local config
    $fh.log({message: 'got config from server:' + JSON.stringify(result)});
    configData = result.data;
    
    // Save it to local storage for use in loss of connectivity
    $fh.data({
      act: 'save',
      key: 'config',
      val: JSON.stringify(config)
    }, function (val) {
      // Save successful, continue with initialisation
      setUpTabs(configData, callback);      
    }, function (error) {
      // Problem saving data, continue as normal
      // Initialise app
      setUpTabs(configData, callback);
    })
  }, function (code, errorprops, params) {
    // Failed to get config from server.
    $fh.log({message: 'failed to get config from server'});
    // Check if we have a config saved to local data storage
    $fh.data({
      key: 'config'
    }, function (res) {
      
      // Check if we got back stored data
      if( null === res.val ) {
        $fh.log({message: 'No config found in local data store'});
      }
      else {
        // Have a stored config, use it
        configData = JSON.parse(res.val);
        $fh.log({message: 'got config from local data store:' + JSON.stringify(configData)});
      }
    
      // Initialise app
      setUpTabs(configData, callback);      
    }, function (error) {
      // No stored config, log and use default config instead
      $fh.log({message: 'failed to get config from local data store. Using default'});
      setUpTabs(configData, callback);
    })
  });
}  
  

function setContentPane() {
  var viewportHeight, pad, header_height, footer_height, top, bottom, windowHeight;
  
  // User outer height to ensure borders are included in height
  header_height = $("#header").outerHeight(); 
  footer_height = $("#footer").outerHeight();
  
  top = (header_height) + "px";
  bottom = footer_height+"px";

  //log.debug("top: "+ top + ", bottom: "+bottom);
  windowHeight = window.height;
  if ('undefined' === typeof windowHeight || null === windowHeight) {
    windowHeight = $(window).height();  
  }
  
  $('#wrapper').height(windowHeight);

  viewportHeight = windowHeight - (footer_height + header_height);

  $("#content").height(viewportHeight);
  //$("#content").css("top",top);
  //$("#content").css("bottom",bottom);
}

function setUpTabs(config, callback) {
  
  var tabDataSet = config.tabData;
  
  // Iterate over each div defined in the content div.
  // Each of these divs represents a pane for displaying data
  // associated with a specific tab
  $('#content div.tab').each(function(index) {

    // Get the id of the div
    var tabContentId = this.id;

    // Get the data for the div from the config varibale defined in config.js
    var tabData = tabDataSet[tabContentId];  
    
    if( typeof(tabData) !== 'undefined') {
      setTabData($(this), tabData);
    }
  });

  // Enable the reload button
  $('#reload_wrapper input').removeAttr('disabled').val('Reload');

  if( callback && typeof(callback) === 'function' ) {
    callback();
  }
 
}

function setTabData(tabContent, tabData) {
   
  // Clear tab content first
  tabContent.empty();
  
  // Loop over the array of text elements in the tab data
  for(var i = 0; i < tabData.length; i++) {

    // Get the data element from the array
    var paragraphData = tabData[i];

    // Creating a paragraph tag for each data element.
    var paragraph = $('<p>');

    // Add the text to the paragraph tag.
    paragraph.html(paragraphData);

    // Add the paragraph tag to the tabContent
    tabContent.append(paragraph);
  }
}



