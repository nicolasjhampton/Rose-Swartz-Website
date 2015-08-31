var scrollSpeed = 16; // Speed in milliseconds for background motion (scrollBg())
var step = 1; // How many pixels to move per step in background motion (scrollBg())
var init = null; // stores the interval kill switch for the background mover (scrollBg())
//var i = 0;
var $overlay = $("<div hidden id='overlay' class='portfolio'></div>");
var $image=$("<img class='lightbox-image'>");
var $header = $('header');
var currentBGPosition;
var currentBGPositionX;
var currentBGPositionY;
var newBGPosition;
var newBGPositionX;
var newBGPositionY;
var $mainPage;
var galleryClasses = [];
var social = {
  
  width: "720",
  pageID: "1629214687363894",
  token: {access_token: "CAAMJBoDATe0BAMKNxPUpbsBCDyLAljQwVo06g2FZBtxv5xncp1JZCfSkqSj90otc4zsU5hBsTBquZAyYg0rzgtNwfWB0VZAq8TYZB3fZAIaccleAPpbi8kuV9zjZAsN4WlYJPrWMmKMAMDhgZAjY9jZCELtqhuQXq2P3QjTZCAxrJkhx8ZBWomJ6Yn9EnNATtLKa61THAEuZBrr48gZDZD"}
  
};



/*****************************
 * functions
 * ***************************/
 
 
 /*****************************
 * Background Functions
 * ***************************/


// scrollBg moves the background image from the position
// on the first page to the position on the second page
function scrollBg(){
  
    // Go to next pixel row.
    if(currentBGPositionX !== newBGPositionX) {
      if(currentBGPositionX > newBGPositionX){
        currentBGPositionX -= step;
      } else {
        currentBGPositionX += step;
      }
    }
    
    
    // Go to next pixel column.
    if(currentBGPositionY !== newBGPositionY) {
      if(currentBGPositionY > newBGPositionY){
        currentBGPositionY -= step;
      } else {
        currentBGPositionY += step;
      }
    }
    
    //Set the CSS of the body to move the background one step.
    $('body').css("background-position", currentBGPositionX + "% " + currentBGPositionY + "%" );
    
    // If there's nowhere else to go, then stop repeating the function
    if (currentBGPositionX === newBGPositionX && currentBGPositionY === newBGPositionY){
    
      clearInterval(init);
      
    }
}

function movePage () {
  // Parse all the background positions into integers we can work with. 
  // Keeping these global veriables so they don't reset on every iteration.
  currentBGPositionX = parseInt(currentBGPosition[0].replace("%",""));
  currentBGPositionY = parseInt(currentBGPosition[1].replace("%",""));
  newBGPositionX = parseInt(newBGPosition[0].replace("%",""));
  newBGPositionY = parseInt(newBGPosition[1].replace("%",""));
  
  // run scrollBG on a timed loop until the background is in position
  init = setInterval('scrollBg()', scrollSpeed);
  
}


/*****************************
 * Carousel/lightbox functions
 * ***************************/


// attachSlick attaches slick to any tag of class 'carousel'
function attachSlick(name) {
  
  // This slick setup is for responsive design, tailored to the 
  // needs of the images on this site
  $("." + name).slick({
      adaptiveHeight: false,
      lazyLoad: 'ondemand',
      appendArrows: $("." + name + "Arrows"),
      prevArrow: '<img class="slick-prev" src="./images/black_key_left.svg" width="50px">',
      nextArrow: '<img class="slick-next" src="./images/black_key_right.svg" width="50px">',
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: false,
      arrows: true,
      variableWidth: true,
      responsive: [
        {
          breakpoint: 1360,
          settings: {
            lazyLoad: 'ondemand',
            arrows: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            infinite: true,
            dots: false
          }
        },
        {
          breakpoint: 890,
          settings: {
            lazyLoad: 'ondemand',
            arrows: true,
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 590,
          settings: {
            lazyLoad: 'ondemand',
            arrows: true,
            slidesToShow: 2,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });
    
}


// attachLightbox puts a lightbox on any tag of class "lightbox"
function attachLightbox() {
  $('.lightbox').on('click', function (evt) {
      
      // don't use the link
      evt.preventDefault();
      
      // grab the url from the anchor's href property
      var $fullImageURL = $(this).attr('href');
      $image.attr('src', $fullImageURL);
      
      // fade out gracefully (doesn't seem to work)
      //$('h2').fadeOut();
      //$('.carousel').hide();
      
      // rip out the main page and insert the overlay
      // Note: calling the jquery selector #main-page instead  
      // of the variable, so we have a cope to put back after
      $('#main-page').html($overlay);
      $overlay.css('background', 'rgba(0,0,0,.8)');
      $header.css('background', 'rgba(0,0,0,.8)');
      $overlay.append($image);
      
      // fade in gracefully (doesn't seem to work)
      //$overlay.fadeIn();
      
      // attach the handler to exit the overlay
      $overlay.on('click', function(evt) {
          evt.preventDefault();
          
          // rip overlay out, put our saved copy of main page back in
          $('#main-page').html($mainPage);
          
          // fade in the headers
          $('h2').fadeIn();
          $header.css('background', 'linear-gradient(black,black,black,transparent,transparent)');
          
          // reattach slick and lightbox to all gallery classes
          attachImageHandlers();
      });
      
    }); 
}

// attachImageHandlers is a convenence function for attaching image handlers
function attachImageHandlers () {
  for(var index = 0; index < galleryClasses.length; index++) {
    attachSlick(galleryClasses[index]);
  }
  attachLightbox();
}


/*****************************
 * HTML Creation Functions
 * ***************************/
 
function createAboutPage(response) {

  var bio = response.bio;
  var picture = response.photos.data[0].images[0].source;
  var bioHTML;
  
  bioHTML = '<div class="artistPicture">';
  bioHTML += '<img id="profilePicture" src="' + picture + '" width="180">';
  bioHTML += '</div>';
  bioHTML += '<div class="artistSummary">';
  bioHTML += '<h3><br></h3><p id="bio">' + bio + '</p><h1></h1>';
  bioHTML += '</div>';
  
  // These go at the bottom of every page as spacers and tags
  bioHTML += '<h1></h1><br class="about">';
  bioHTML += '<h1></h1><br class="portfolio">';
  bioHTML += '<h1></h1><br class="poems">';
  bioHTML += '<h1></h1><br class="events">';
  bioHTML += '<h1></h1><br>';
  bioHTML += '<h1></h1><br>';
  bioHTML += '<h1></h1><br>';
  bioHTML += '<h1></h1><br>';
  bioHTML += '<h1></h1><br>';
  bioHTML += '<h1></h1><br>';
  bioHTML += '<h1></h1><br>';
  bioHTML += '<h1></h1><br>';
  bioHTML += '<h1></h1><br>';
  bioHTML += '<h1></h1><br>';
  bioHTML += '<h1></h1><br>';
  bioHTML += '<h1></h1><br>';
  bioHTML += '<h1></h1><br>';
  bioHTML += '<h1></h1><br>';
  bioHTML += '<h1></h1><br>';
  bioHTML += '<h1></h1><br>';
  return bioHTML;
  
}

// createPoemPage creates the html for the Poems page
function createPoemPage(response) {
  
  var poems = response.posts.data;
  
  var poemHTML= '<div class="centering"><h2>Published Work</h2>';
    
  // loop through the array of posts
  for(var index = 0; index < poems.length; index++) {
    
    // check to make sure this post entry is not a photo or event
    if(poems[index].type === "link") {
      
      // Replacing the line breaks with their html counterpart.
      // There's a better way to do this, but for now this works.
      var contents = poems[index].message.replace("/ ", "<br>");
      contents = contents.replace("/ ", "<br>");
      contents = contents.replace("/ ", "<br>");
      
      // We'll split the post on the pipes so that:
      // 0 will be the title
      // 1 will be the quote
      // 2 will be the journal
      // 3 will be the link but the link is also in poems[index].link
      var summary = contents.split("| ");
      
      poemHTML += '<div class="poem">';
      poemHTML += '<p class="poemText">';
      poemHTML += '<b>' + summary[0] + '</b><br>';
      poemHTML += '<a href="' + poems[index].link + '">';
      poemHTML += '<img src="./images/black_key.svg" width="50px"></a>';
      poemHTML += '<br><small>"' + summary[1] + '"</small>';
      poemHTML += '<br><small><b>' + summary[2] + '</b></small>';
      poemHTML += '</p></div><!--end poem div-->';
    }
  }
  
  poemHTML += '<h1></h1><br hidden class="about">';
  poemHTML += '<h1></h1><br hidden class="portfolio">';
  poemHTML += '<h1></h1><br hidden class="poems">';
  poemHTML += '<h1></h1><br hidden class="events">';
  
  
  return poemHTML;
}

// createPortfolioPage creates the HTML for the portfolio page
function createPortfolioPage(response) {
  
  var galleries = response.albums.data;
  
  var portfolioHTML = '<div class="galleryBody">';
  
  for(var galleryIndex = 0; galleryIndex < galleries.length; galleryIndex++) {
    
    // Make sure the gallery isn't one of the automatic galleries facebook creates
    if(galleries[galleryIndex].name !== "Cover Photos" && galleries[galleryIndex].name !== "Profile Pictures") {
      
      portfolioHTML += '<h1><br></h1>';
      portfolioHTML += '<div class="galleryName"><h2 hidden>&nbsp;' + galleries[galleryIndex].name + '&nbsp;</h2></div>';
      portfolioHTML += '<div class="' + galleries[galleryIndex].name + 'Arrows arrows"></div>';
      portfolioHTML += '<div class="' + galleries[galleryIndex].name + '" align="middle">';
      
      // Save a global list of all galleries for attachImageHandlers function
      galleryClasses[galleryIndex] = galleries[galleryIndex].name;
      
      var photos = galleries[galleryIndex].photos.data;
      
      for (var index = 0; index < photos.length; index++) {
        
        
        portfolioHTML += '<div>';
        portfolioHTML += '<a class="lightbox" href="';
        portfolioHTML += photos[index].source + '">';
        portfolioHTML += '<img class="image" data-lazy="';
        portfolioHTML += photos[index].source + '"';   
            
        // If the screen is a resolution over 1320px
        // forgo lazy loading due to a bug in slick
        // note: If you manage to go from lower to 
        // higher than 1320 while still on the page,
        // the bug occurs, but navigating to another 
        // page fixes it 	              
        if($(window).width() >= 1320) {
          portfolioHTML += ' src="' + photos[index].source + '"';
        }  
        	  
        portfolioHTML += ' align="middle">';
        portfolioHTML += '</a></div>'; 
      
      }    
            
      portfolioHTML += '</div>';  
    }
    	    
  }
  	  
  // These go at the bottom of every page as spacers and tags
  portfolioHTML += '<h1></h1><br class="about">';
  portfolioHTML += '<h1></h1><br class="portfolio">';
  portfolioHTML += '<h1></h1><br class="poems">';
  portfolioHTML += '<h1></h1><br class="events">';
  	    
  //finish "galleryBody" class
  portfolioHTML += '</div>';
  
  return portfolioHTML;
  
}


// createEventsPage creates the HTML for the events page
function createEventsPage(response) {
  
       var eventHTML;
       eventHTML = '<h2>Upcoming Events</h2>';
       eventHTML += '<table>';  //<caption>Upcoming Events</caption>
       eventHTML += '<thead><tr>';
       eventHTML += '<th scope="col">Date and time</th>';
       eventHTML += '<th scope="col">Show</th>';
       eventHTML += '<th scope="col">Summary</th>';
       eventHTML += '</tr></thead>';
       eventHTML += '<tfoot><tr><td class="citing" colspan="4">Results are updated from Facebook</td></tr></tfoot><tbody>';
       
       var eventArray = response.data; 
       
       for(var index = 0; index < eventArray.length; index++) {
         
         var start_time = eventArray[index].start_time.split("T");
         var end_time = eventArray[index].end_time.split("T");
         
         eventHTML += '<tr>';
         eventHTML += '<th scope="row">' + start_time[0] + '<br>' + end_time[0] + '</th>';
         
         if(eventArray[index].place.id !== null) {
           eventHTML += '<td><a href="https://www.facebook.com/' + eventArray[index].place.id + '/">';
           eventHTML += eventArray[index].place.name + '</a>';
         } else {
           eventHTML += '<td>' + eventArray[index].place.name;
         }
         
         eventHTML += '<br>' + eventArray[index].place.location.street + '<br>' + eventArray[index].place.location.city + ',' + eventArray[index].place.location.state + '</td>';
         eventHTML += '<td>' + eventArray[index].description + '</td>';
         eventHTML += '</tr>';
         
       }
         
       eventHTML += '</tbody>';
       eventHTML += '</table>';
       eventHTML += '<h1></h1><br class="about">';
  	   eventHTML += '<h1></h1><br class="portfolio">';
  	   eventHTML += '<h1></h1><br class="poems">';
  	   eventHTML += '<h1></h1><br class="events">';
  	   eventHTML += '<h1></h1><br>';
       eventHTML += '<h1></h1><br>';
       eventHTML += '<h1></h1><br>';
       eventHTML += '<h1></h1><br>';
       eventHTML += '<h1></h1><br>';
       eventHTML += '<h1></h1><br>';
       eventHTML += '<h1></h1><br>';
       eventHTML += '<h1></h1><br>';
       eventHTML += '<h1></h1><br>';
       eventHTML += '<h1></h1><br>';
       eventHTML += '<h1></h1><br>';
       eventHTML += '<h1></h1><br>';
       eventHTML += '<h1></h1><br>';
       eventHTML += '<h1></h1><br>';
       eventHTML += '<h1></h1><br>';
       eventHTML += '<h1></h1><br>';
       
       return eventHTML; 
      
}




// loadPage loads the body of the page it is passed
function loadPage ($dest, response) {
  
  // empty string for the html of the page 
  var pageHTML = "";
  
  // capture the current position of the background image in a global variable
  currentBGPosition = $('body').css("background-position").split(" ");
  
    // we're preprogramming the background positions 
    // and importing the facebook response into the correct page creator
    if($dest === "index.html") {
      
        // note: still based off of local variable file
        newBGPosition = $(".about").css("background-position").split(" ");
        pageHTML = createAboutPage(response);
        
    } else if ($dest === "events.html") {
      
        newBGPosition = $(".events").css("background-position").split(" ");
        pageHTML = createEventsPage(response);
        
    } else if ($dest === "portfolio.html") {
      
        // We pull the background coordinates from the appropriate page
        newBGPosition = $(".portfolio").css("background-position").split(" ");
        pageHTML = createPortfolioPage(response);
        
    } else if ($dest === "poems.html") {
      
        newBGPosition = $(".poems").css("background-position").split(" ");
        pageHTML = createPoemPage(response);
    }
    
  return pageHTML;
  
}

// we're creating the Facebook Ajax request based on the link clicked
function nodeSelector(dest) {
  
  var node;
  
  if(dest === "index.html") {
      
       node =  '?fields=bio,photos{images}';
        
    } else if (dest === "events.html") {
      
       node = '/events';
        
    } else if (dest === "portfolio.html") {
      
       node = '?fields=albums%7Bname%2Cphotos%7Bwidth%7B' + social.width + '%7D%2C%20source%7D%7D';
        
    } else if (dest === "poems.html") {
        
       node = '/?fields=posts{type,message,link}';
    }
    
    return node;
}



/*****************************
 * Program
 * ***************************/

$.get('https://graph.facebook.com/v2.4/' + social.pageID + '?fields=bio,photos{images}',
        social.token,
        function (response) {
          console.log(response);
          $('#main-page').html(createAboutPage(response));
});
          
          
$('#menu-options li a').click( function(evt) {
  
  var pageHTML;
  
  // Prevent the link from working
   evt.preventDefault();
   
  // Populate the facebook request according to the destination url
  var $dest = $(this).attr("href");
  
  var node = nodeSelector($dest);
    
  
  // Call facebook with the request. Upon success create Html for new
  // page, move page, attach html to new page, save a copy of
  // the page, and attach any handlers to the page
  $.get('https://graph.facebook.com/v2.4/' + social.pageID + node,
        social.token,
        function (response) {
          console.log(response);
          
          // Send the response to loadPage for HTML formatting
          pageHTML = loadPage($dest, response);
          
          // Move the background of the page
          movePage();
          
          // load the page onto the document
          $('#main-page').html(pageHTML);
          
          // Saving a copy of the page we are at now
          // as $mainPage (handy for the lightbox)
          $mainPage = $('#main-page').html();
  
          // attach slick to all slick and lightbox classes 
          attachImageHandlers();

          // fade in the header
          $('#main-page h2').fadeIn('600');
  });
  
});


  	        
  	      
  	 
  	     
  	       
  	        
  	        
  	        
        


