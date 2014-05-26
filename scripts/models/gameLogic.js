// Basic functions for running the 'game'.

// Function called when a yoyo avatar is clicked. Either hides or displays it depending on the action given.
function toggleChart(yoyo, action) {
  var node = ".radar-chart-yoyo_" + yoyo.id_num;
  d3.selectAll(node).style("visibility", action);

  // Update the avatar and more-info panels
  if ( action == "visible" ) {
    d3.select("#yoyo_avatar_"+yoyo.id_num).style("background-color", colorLuminance(yoyo.color_hex, -0.2));
  } else {
    d3.select("#yoyo_avatar_"+yoyo.id_num).style("background-color", "rgba(0, 0, 0, 0)");
  }  
}

function toggleLabel(yoyo, action) {
  var label_id = yoyo.id_num,
      height_offset;

  if ( action == "hide" ) {
    height_offset = "-25px";
  } else {
    height_offset = "0px";
  }
  d3.select("#avatar_label_"+label_id).transition(500).style("bottom",height_offset);
}

function togglePanel(yoyo, action, animated) {
  var yoyo_id = yoyo.id_num,
      panel = d3.select("#more_info_"+yoyo_id);

  if ( action == "hide" ) {
    if ( animated ) {
      panel.transition(100).style("opacity","0").each("end", function() {
        d3.select(this).style("display","none");
      });
    } else {
      panel.style("opacity","0").style("display","none");
    }
  } else {
    panel.style("opacity","0").style("display","inline-block").transition(250).style("opacity","1");
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
      toggleLabel(yoyo, "hide");
      // And its more-info panel
      togglePanel(yoyo, "hide", false);
      
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
  readDataValid(yoyo_list);

  refreshVisible();



}

function readDataValid(object_array) {
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
      // Update our chart, label and panel
      toggleChart(obj, "hidden");
      toggleLabel(obj, "hide");
      togglePanel(obj, "hide", true)

      // Update our stack
      if ( selection_stack.indexOf(obj.id_num) > -1 ) {
        var selection_index = selection_stack.indexOf(obj.id_num);
        selection_stack.splice(selection_index, 1);

      }
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
          togglePanel(obj, "show", true);

       
        } else {
          toggleChart(obj, "hidden");
          // Update our stack
          var selection_index = selection_stack.indexOf(obj.id_num);
          selection_stack.splice(selection_index, 1);

          // hide the more-info panel
          togglePanel(obj, "hide", true);
        }

        refreshVisible();
      }
    })
    .on("mouseover", function(index) {
      if ( is_valid == 'true' ) {
        toggleLabel(obj, "show");
        
      }
    })
    .on("mouseout", function(index) {
      if ( is_valid == 'true' ) {

        if (d3.select(".radar-chart-yoyo_"+index).style("visibility") == "hidden") {
          toggleLabel(obj, "hide");
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


 
function render() {
 
  bgCanvas.patternizer({
    stripes : [ 
      {
          color: '#1fceca',
          rotation: 300,
          opacity: 100,
          mode: 'normal',
          width: 45,
          gap: 111,
          offset: 100
      },
      {
          color: '#FFCF48',
          rotation: 300,
          opacity: 100,
          mode: 'normal',
          width: 45,
          gap: 52,
          offset: 50
      },
      {
          color: '#1CA9C9',
          rotation: 300,
          opacity: 100,
          mode: 'normal',
          width: 45,
          gap: 73,
          offset: 150
      },
      {
          color: '#C8342E',
          rotation: 300,
          opacity: 100,
          mode: 'normal',
          width: 45,
          gap: 27,
          offset: 0
      }
    ],
  bg : '#ece9be'
  });
 
}
 
// Patternizer function - resize the canvas to the window size
function onResize() {
 
    // number of pixels of extra canvas drawn
    var buffer = 100;
 
    // if extra canvas size is less than the buffer amount
    if (bgCanvas.width - window.innerWidth < buffer ||
        bgCanvas.height - window.innerHeight < buffer) {
 
        // resize the canvas to window plus double the buffer
        bgCanvas.width = window.innerWidth + (buffer * 2);
        bgCanvas.height = window.innerHeight + (buffer * 2);
 
        render();
    }   
 
}
 


function initialize() {
  RadarChart.draw("#chart", radar_data);

  // Patternizer BG stuff
  var bgCanvas = document.getElementById('bgCanvas');
  onResize();
  window.addEventListener('resize', Cowboy.throttle(200, onResize), false);


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
  d3.select("#avatar_label_0").style("bottom", "0px");
  d3.select("#avatar_label_1").style("bottom", "0px");

  // Select 'all' as the filter group
  d3.select("#show_category_all").property("checked", true);
  activeSelection();

}