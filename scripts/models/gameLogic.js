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
    panel.style("opacity","0").style("display","none");

  } else {
    panel.style("opacity","0").style("display","inline-block").style("opacity","1");
  }
}

function toggleCheck(yoyo, action) {
  var yoyo_id = yoyo.id_num,
      check = d3.select("#avatar_checked_"+yoyo_id);
  
  var checkbox_height = parseInt(check.style("height")),
      show_height_offset = 0 - Math.ceil(checkbox_height / 2),
      hide_height_offset = 0 - checkbox_height + show_height_offset;

  if ( action == "hide" ) {
    check.transition().style("top", hide_height_offset+"px");
  } else {
    check.transition().style("top", show_height_offset+"px");
  }
}

function updateCount() {
  var num_selected = selection_stack.length;
  if ( num_selected > 0 ) {
    d3.select("#num_of_selected").text(num_selected);
    d3.select("#num_selected_colon").style("display","inline");
  } else {
    d3.select("#num_of_selected").text("No");
    d3.select("#num_selected_colon").style("display","none");
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
      toggleCheck(yoyo, "hide");
      
    }
  }

  // Update the count at the bottom
  updateCount();  
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

// Our filtering function. Also called on listBuilders' build_avatar_array.
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
      togglePanel(obj, "hide", true);
      toggleCheck(obj, "hide");

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
        if (selection_stack.indexOf(obj.id_num) == -1) {
          toggleChart(obj, "visible");
          // Update our stack
          selection_stack.push(obj.id_num);
          
          // Show the more-info panel
          togglePanel(obj, "show", true);

          // Make sure we're showing our label! Important on multiple clicks without mousing out
          toggleLabel(obj, "show");

          // Show the 'check' that indicates this yoyo is currently selected.
          toggleCheck(obj, "show");

          var triangle = d3.select("polygon.radar-chart-yoyo_"+obj.id_num)[0][0];
          highlightTriangle(triangle);
       
        } else {
          toggleChart(obj, "hidden");
          // Update our stack
          var selection_index = selection_stack.indexOf(obj.id_num);
          selection_stack.splice(selection_index, 1);

          togglePanel(obj, "hide", true);
          toggleLabel(obj, "hide");
          toggleCheck(obj, "hide");



          restoreTriangles();
        }

        // Update our header color
        var new_color, new_text_color;
        var last_selected_yoyo = selection_stack[(selection_stack.length-1)];
        if ( yoyo_list[last_selected_yoyo] ) {
          new_color = colorLuminance(yoyo_list[last_selected_yoyo].color_hex, -0.5);
          new_text_color = colorLuminance(yoyo_list[last_selected_yoyo].color_hex, 0.75);
        } else {
          new_color = "#222";
          new_text_color = "#91CACE"
        }



        d3.select("#header").transition().duration(500).style("background-color", new_color)
        .style("text-shadow", "1px 1px 0px " + colorLuminance(new_color, -0.5))
        .select("a").style("color", new_text_color);

        refreshVisible();
      }
    })
    .on("mouseover", function(index) {
      if ( is_valid == 'true' ) {
        toggleLabel(obj, "show");
        var triangle = d3.select("polygon.radar-chart-yoyo_"+obj.id_num)[0][0];

        if ( selection_stack.indexOf(obj.id_num) > -1 ) {
          highlightTriangle(triangle);
        } else {
          subtleHighlightTriangle(triangle);
        }
      }
    })
    .on("mouseout", function(index) {
      if ( is_valid == 'true' ) {

        if ( selection_stack.indexOf(obj.id_num) == -1 ) {
          toggleLabel(obj, "hide");
          var triangle = d3.select("polygon.radar-chart-yoyo_"+obj.id_num)[0][0];
          removeSubtleHighlight(triangle);
        }

        restoreTriangles();
      }
    });

  }); 
}

function highlightTriangle(triangle) {
  t_class = "polygon."+d3.select(triangle).attr("class");
  d3.selectAll("polygon").style("fill-opacity", 0.1); 
  d3.selectAll(t_class).style("fill-opacity", .7).style("stroke-dasharray","");
}

function subtleHighlightTriangle(triangle) {
  t_class = "polygon."+d3.select(triangle).attr("class");
  d3.selectAll(t_class).style("visibility","visible").style("fill-opacity", .1).style("stroke-dasharray","3,3");
}

function removeSubtleHighlight(triangle) {
  t_class = "polygon."+d3.select(triangle).attr("class");
  d3.selectAll(t_class).style("visibility","hidden").style("stroke-dasharray","");
}


function restoreTriangles() {
  _.each(selection_stack, function(sel) {
    d3.selectAll(".radar-chart-yoyo_"+sel).style("fill-opacity", 0.5);
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

function randomizeStartSelection() {
  var num_of_yoyos = yoyo_list.length
  selections = [ 
    Math.floor(Math.random() * num_of_yoyos), 
    Math.floor(Math.random() * num_of_yoyos)
  ];

  _.each(selections, function(sel) {
  d3.select("#yoyo_avatar_"+sel).on("click")(sel);
  d3.select("#avatar_label_"+sel).style("bottom", "0px");
  });
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

  randomizeStartSelection();

  // Select 'all' as the filter group
  d3.select("#show_category_all").property("checked", true);
  activeSelection();

}