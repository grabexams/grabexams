// ---------------------------------------------------
// BLOGTOC
// ---------------------------------------------------
// BlogToc creates a clickable Table Of Contents for
// Blogger Blogs.
// It uses the JSON post feed, and create a ToC of it.
// The ToC can be sorted by title or by date, both
// ascending and descending, and can be filtered by
// label.
// ---------------------------------------------------
// Author: Beautiful Beta
// Url: http://beautifulbeta.blogspot.com
// Version: 2
// Date: 2007-04-12
// ---------------------------------------------------

// global arrays

   var postTitle = new Array();     // array of posttitles
   var postUrl = new Array();       // array of posturls
   var postDate = new Array();      // array of post publish dates
   var postSum = new Array();       // array of post summaries
   var postLabels = new Array();    // array of post labels

// global variables
   var sortBy = "datenewest";         // default value for sorting ToC
   var tocLoaded = false;           // true if feed is read and ToC can be displayed
   var numChars = 250;              // number of characters in post summary
   var postFilter = '';             // default filter value

// main callback function

function loadtoc(json) {

   function getPostData() {
   // this functions reads all postdata from the json-feed and stores it in arrays
      if ("entry" in json.feed) {
         var numEntries = json.feed.entry.length;
      // main loop gets all the entries from the feed
         for (var i = 0; i < numEntries; i++) {
         // get the entry from the feed
            var entry = json.feed.entry[i];

         // get the posttitle from the entry
            var posttitle = entry.title.$t;

         // get the post date from the entry
            var postdate = entry.published.$t.substring(0,10);

         // get the post url from the entry
            var posturl;
            for (var k = 0; k < entry.link.length; k++) {
               if (entry.link[k].rel == 'alternate') {
               posturl = entry.link[k].href;
               break;
               }
            }

         // get the post contents from the entry
         // strip all html-characters, and reduce it to a summary
            if ("content" in entry) {
               var postcontent = entry.content.$t;}
            else
               if ("summary" in entry) {
                  var postcontent = entry.summary.$t;}
               else var postcontent = "";
         // strip off all html-tags
            var re = /<\S[^>]*>/g; 
            postcontent = postcontent.replace(re, "");
         // reduce postcontent to numchar characters, and then cut it off at the last whole word
            if (postcontent.length > numChars) {
               postcontent = postcontent.substring(0,numChars);
               var quoteEnd = postcontent.lastIndexOf(" ");
               postcontent = postcontent.substring(0,quoteEnd) + '...';
            }

         // get the post labels from the entry
            var pll = '';
            if ("category" in entry) {
               for (var k = 0; k < entry.category.length; k++) {
                  pll += '<a href="javascript:filterPosts(\'' + entry.category[k].term + '\')" title="Click here to select all posts with label \'' + entry.category[k].term + '\'">' + entry.category[k].term + '</a>,  ';
               }
            var l = pll.lastIndexOf(';');
            if (l != -1) { pll = pll.substring(0,l); }
            }

         // add the post data to the arrays
            postTitle.push(posttitle);
            postDate.push(postdate);
            postUrl.push(posturl);
            postSum.push(postcontent);
            postLabels.push(pll);
         }
      }
   } // end of getPostData

// start of showtoc function body
// get the number of entries that are in the feed
//   numEntries = json.feed.entry.length;

// get the postdata from the feed
   getPostData();

// sort the arrays
   sortPosts(sortBy);
   tocLoaded = true;
}



// filter and sort functions


function filterPosts(filter) {
// This function changes the filter
// and displays the filtered list of posts
   scroll(0,0);
   postFilter = filter;
   displayToc(postFilter);
} // end filterPosts

function allPosts() {
// This function resets the filter
// and displays all posts

   postFilter = '';
   displayToc(postFilter);
} // end allPosts

function sortPosts(sortBy) {
// This function is a simple bubble-sort routine
// that sorts the posts

   function swapPosts(x,y) {
   // Swaps 2 ToC-entries by swapping all array-elements
      var temp = postTitle[x];
      postTitle[x] = postTitle[y];
      postTitle[y] = temp;
      var temp = postDate[x];
      postDate[x] = postDate[y];
      postDate[y] = temp;
      var temp = postUrl[x];
      postUrl[x] = postUrl[y];
      postUrl[y] = temp;
      var temp = postSum[x];
      postSum[x] = postSum[y];
      postSum[y] = temp;
      var temp = postLabels[x];
      postLabels[x] = postLabels[y];
      postLabels[y] = temp;
   } // end swapPosts

   for (var i=0; i < postTitle.length-1; i++) {
      for (var j=i+1; j<postTitle.length; j++) {
         if (sortBy == "titleasc") { if (postTitle[i] > postTitle[j]) { swapPosts(i,j); } }
         if (sortBy == "titledesc") { if (postTitle[i] < postTitle[j]) { swapPosts(i,j); } }
         if (sortBy == "dateoldest") { if (postDate[i] > postDate[j]) { swapPosts(i,j); } }
         if (sortBy == "datenewest") { if (postDate[i] < postDate[j]) { swapPosts(i,j); } }
      }
   }
} // end sortPosts

// displaying the toc

function displayToc(filter) {
// this function creates a three-column table and adds it to the screen
   var numDisplayed = 0;
   var tocTable = '';
   var tocHead1 = 'POST NAME';
   var tocTool1 = 'Click to sort by post title';
   var tocHead2 = 'POST DATE';
   var tocTool2 = 'Click to sort by date';
   var tocHead3 = 'Qualification and Last Date';
   var tocTool3 = '';
   var tocHead4 = 'More Infromation';
   var tocTool4 = '';
   if (sortBy == "titleasc") { 
      tocTool1 += ' (descending)';
      tocTool2 += ' (newest first)';
   }
   if (sortBy == "titledesc") { 
      tocTool1 += ' (ascending)';
      tocTool2 += ' (newest first)';
   }
   if (sortBy == "dateoldest") { 
      tocTool1 += ' (ascending)';
      tocTool2 += ' (newest first)';
   }
   if (sortBy == "datenewest") { 
      tocTool1 += ' (ascending)';
      tocTool2 += ' (oldest first)';
   }
   if (postFilter != '') {
      tocTool3 = 'Click to show all posts';
   }
   if (postFilter != '') {
	  tocTool4 = 'click to show all posts'
   }
   tocTable += '<table border="1" width="100%">';
   tocTable += '<tr>';
   tocTable += '<td class="toc-header-col1" width="10%">';
   tocTable += '<center><strong>' + tocHead2 + '</strong></center>';
   tocTable += '</td>';
   tocTable += '<td class="toc-header-col2" width="40%">';
   tocTable += '<center><strong>' + tocHead1 + '</strong></center>';
   tocTable += '</td>';
   tocTable += '<td class="toc-header-col3" width="40%">';
   tocTable += '<center><strong>' + tocHead3 + '</strong></center>';
   tocTable += '</td>';
   tocTable += '<td class="toc-header-col4" width="10%">';
   tocTable += '<center><strong>' + tocHead4 + '</strong></center>';
   tocTable += '</td>';
   tocTable += '</tr>';
   for (var i = 0; i < postTitle.length; i++) {
      if (filter == '') {
         tocTable += '<tr><td class="toc-entry-col1"><strong>' + postDate[i] + '</strong></td><td class="toc-entry-col2"><strong><a href="' + postUrl[i] + '" title="' + postSum[i] + '">' + postTitle[i] + '</a></strong></td><td class="toc-entry-col3"><strong>' + postLabels[i] + '</strong></td><td class="toc-entry-col2"><strong><a href="' + postUrl[i] + '" title="' + postSum[i] + '">' + tocHead4 + '</a></strong></td></tr>';
         numDisplayed++;
      } else {
          z = postLabels[i].lastIndexOf(filter);
          if ( z!= -1) {
             tocTable += '<tr><td class="toc-entry-col1"><strong>' + postDate[i] + '</strong></td><td class="toc-entry-col2"><strong><a href="' + postUrl[i] + '" title="' + postSum[i] + '">' + postTitle[i] + '</a></strong></td><td class="toc-entry-col3"><strong>' + postLabels[i] + '</strong></td><td class="toc-entry-col2"><strong><a href="' + postUrl[i] + '" title="' + postSum[i] + '">' + tocHead4 + '</a></strong></td></tr>';
             numDisplayed++;
          }
        }
   }
   tocTable += '</table>';
   if (numDisplayed == postTitle.length) {
      var tocNote = '<span class="toc-note"><br/><center><strong><strong>Show it all ' + postTitle.length + ' post</strong></strong></center><br/></span>'; }
   else {
      var tocNote = '<span class="toc-note"><br/><center><strong><strong>Showing ' + numDisplayed + ' labeled post \'';
      tocNote += postFilter + '\' from all '+ postTitle.length + ' post</strong></strong></center><br/></span>';
   }
   var tocdiv = document.getElementById("toc");
   tocdiv.innerHTML = tocNote + tocTable;
} // end of displayToc

function toggleTitleSort() {
   if (sortBy == "titleasc") { sortBy = "titledesc"; }
   else { sortBy = "titleasc"; }
   sortPosts(sortBy);
   displayToc(postFilter);
} // end toggleTitleSort

function toggleDateSort() {
   if (sortBy == "datenewest") { sortBy = "dateoldest"; }
   else { sortBy = "datenewest"; }
   sortPosts(sortBy);
   displayToc(postFilter);
} // end toggleTitleSort


function showToc() {
  if (tocLoaded) { 
     displayToc(postFilter);
     var toclink = document.getElementById("toclink");
     
     /*toclink.innerHTML = '<a href="#" onclick="scroll(0,0); Effect.toggle('+"'toc-result','blind');"+'">» Show Table of Contents</a> <img src="http://chenkaie.blog.googlepages.com/new_1.gif"/>';*/
  }
  else { alert("Just wait... TOC is loading"); }
}

function hideToc() {
  var tocdiv = document.getElementById("toc");
  tocdiv.innerHTML = '';
  var toclink = document.getElementById("toclink");
}