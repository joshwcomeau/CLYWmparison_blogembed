// Basic functions for running the 'game'.

// Function called when a yoyo avatar is clicked. Either hides or displays it depending on the action given.
function toggleChart(yoyo, action) {
  var node = ".radar-chart-yoyo_" + yoyo.id_num;
  d3.selectAll(node).style("visibility", action);

  // Update the avatar and more-info panels
  if ( action == "visible" ) {
    d3.select("#yoyo_avatar_"+yoyo.id_num).style("background-color", colorLuminance(yoyo.color_hex, -0.2));
    // more info panel


  } else {
    d3.select("#yoyo_avatar_"+yoyo.id_num).style("background-color", "rgba(0, 0, 0, 0)");
  }



  
}

// Refreshes the visible yoyos so that only num_visible are shown.
function refreshVisible() {
  var num_visible = 4;

  // We gotta create a new copy of the array, so we can reverse it without damaging it.
  var reverse_selection = selection_stack.slice(0)
  reverse_selection.reverse();

  for ( i=0; i < reverse_selection.length; i++) {

    var yoyo = yoyo_list[reverse_selection[i]]

    if ( i < num_visible ) { 
      // These are the first 4. We want to see these ones!
      toggleChart(yoyo, "visible");
    } else {
      // These are additional ones that need to be hidden and kicked out!
      toggleChart(yoyo, "hidden");
      var selection_index = selection_stack.indexOf(yoyo.id_num);
      selection_stack.splice(selection_index, 1);
      // Hide its label too!
      d3.select("#avatar_label_"+yoyo.id_num).transition(200).style("bottom","-35px");
      // And its more-info panel
      d3.select("#more_info_"+yoyo.id_num).style("opacity","0").style("display","none");
    }
  }
}



function activeSelection(selection) {
  var select_color = "rgba(111,176,57,1)";
  // First, remove any other active selections
  var options = ['show_category_all_li','show_category_current_li','show_category_discontinued_li'];
  for ( group in options ) {
    d3.select("#"+options[group]).style("background-color","transparent");
  }

  // Now, color the appropriate one
  var current = d3.select(selection).attr("value");
  d3.select("#show_category_"+current+"_li").style("background-color",select_color);
}

function fancyFilter() {
    $(document.body).on("click", ".delete", function (evt) {
        evt.preventDefault();
        $(this).closest("li").remove();
    });
    
    $(".append").click(function () {
        $("<li>New item</li>").insertAfter($(".items").children()[2]);
    });

    // Workaround for Webkit bug: force scroll height to be recomputed after the transition ends, not only when it starts
    $(".items").on("webkitTransitionEnd", function () {
        $(this).hide().offset();
        $(this).show();
    });
}

// Quick utility function for appending CSS nth-child rules, for filtering. 
function createListStyles(rulePattern, rows, cols) {
    var rules = [], index = 0;
    for (var rowIndex = 0; rowIndex < rows; rowIndex++) {
        for (var colIndex = 0; colIndex < cols; colIndex++) {
            var x = (colIndex * 100) + "%",
                y = (rowIndex * 100) + "%",
                transforms = "{ -webkit-transform: translate3d(" + x + ", " + y + ", 0); transform: translate3d(" + x + ", " + y + ", 0); }";
            rules.push(rulePattern.replace("{0}", ++index) + transforms);
        }
    }
    var headElem = document.getElementsByTagName("head")[0],
        styleElem = $("<style>").attr("type", "text/css").appendTo(headElem)[0];
    if (styleElem.styleSheet) {
        styleElem.styleSheet.cssText = rules.join("\n");
    } else {
        styleElem.textContent = rules.join("\n");
    }
}




// colorLuminance written by Craig Buckler, September 6, 2011
function colorLuminance(hex, lum) {

  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i*2,2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00"+c).substr(c.length);
  }

  return rgb;
}



function initialize() {
  RadarChart.draw("#chart", radar_data);

  // Hide all charts by default. Toggle them with mouseovers and clicks.
  _.each(yoyo_list, function(yoyo) {
    toggleChart(yoyo, "hidden");
  });

  // Bind the group selection click events
  d3.selectAll(".show_category").on("click", function() {
    activeSelection(this);
  });

  // Apply CSS for filtered selections
  createListStyles("#yoyo_selection_avatars > div:nth-child({0})", 4, 6);

  // Show the first couple charts, through a faked 'click' event
  d3.select("#yoyo_avatar_0").on("click")(0);
  d3.select("#yoyo_avatar_1").on("click")(1);
  d3.select("#avatar_label_0").style("bottom", "4px");
  d3.select("#avatar_label_1").style("bottom", "4px");

}