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



function activeSelection() {
  var select_color = "rgba(111,176,57,1)";
  var options = ['show_category_all','show_category_current','show_category_discontinued'];

  for ( group in options ) {
    // Is this our active selection?
    if ( d3.select("#"+options[group]).property("checked") == true ) {
      d3.select("#"+options[group]+"_li").style("background-color",select_color);
      var selected = options[group].split("_")[2];
    } else {
      d3.select("#"+options[group]+"_li").style("background-color","transparent");
    }
    
  }

  for ( yoyo in yoyo_list ) {
    if ( selected == 'all' ) {
      // Show all yoyos
      d3.selectAll(".yoyo_avatar").attr("data-valid", true);
    } else {
      // Update the data-valid attribute
      if ( yoyo_list[yoyo].family == selected ) {
        
        d3.select("#yoyo_avatar_" + yoyo_list[yoyo].id_num).attr("data-valid", true);
      } else {
        d3.select("#yoyo_avatar_" + yoyo_list[yoyo].id_num).attr("data-valid", false);
      }
    }
    
  }

  // Now that our data-valid attributes are set, lets refresh the view.
  refreshValidAvatars(yoyo_list);

  refreshVisible();



}

function refreshValidAvatars(object_array) {
  _.each(object_array, function(obj) {
    // Is this avatar set to valid or invalid?
    var is_valid = d3.select("#yoyo_avatar_"+ obj.id_num).attr("data-valid");

    // Set our opacity constant for invalid avatars
    if ( is_valid == "true" ) {
      var opacity_const = 1;
    } else {
      opacity_const = 0.25;
    }

    // If it's false, de-select any currently selected avatars.
    if ( is_valid == "false" ) {
      toggleChart(obj, "hidden")
    }

    d3.select("#yoyo_avatar_"+ obj.id_num)

    // Apply opacity reduction as a visual cue
    .style("opacity", opacity_const)
    // Bind the event binders based on filter selection.
    .on("click", function(index) {

      if ( is_valid == 'true' ) {
        if (d3.select(".radar-chart-yoyo_"+index).style("visibility") == "hidden") {
          toggleChart(obj, "visible");
          // Update our stack
          selection_stack.push(obj.id_num);
         
          // Show the more-info panel
          d3.select("#more_info_"+obj.id_num).style("opacity","0").style("display","inline-block")
          .transition(250).style("opacity","1");
       
        } else {
          toggleChart(obj, "hidden");
          // Update our stack
          var selection_index = selection_stack.indexOf(obj.id_num);
          selection_stack.splice(selection_index, 1);

          // hide the more-info panel
          d3.select("#more_info_"+obj.id_num).transition(250).style("opacity","0").each("end", function() {
            d3.select(this).style("display","none");
          });
        }

        refreshVisible();
      }
    })
    .on("mouseover", function(index) {
      if ( is_valid == 'true' ) {
        d3.select("#avatar_label_"+obj.id_num).transition(500).style("bottom","4px");
      }
    })
    .on("mouseout", function(index) {
      if ( is_valid == 'true' ) {

        if (d3.select(".radar-chart-yoyo_"+index).style("visibility") == "hidden") {
          d3.select("#avatar_label_"+obj.id_num).transition(500).style("bottom","-35px");
        }
      }
    });

  }); 
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
  d3.selectAll(".show_category").on("change", function() {
    activeSelection();
  });

  // Show the first couple charts, through a faked 'click' event
  d3.select("#yoyo_avatar_0").on("click")(0);
  d3.select("#yoyo_avatar_1").on("click")(1);
  d3.select("#avatar_label_0").style("bottom", "4px");
  d3.select("#avatar_label_1").style("bottom", "4px");

}