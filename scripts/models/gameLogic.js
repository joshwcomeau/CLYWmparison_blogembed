// Basic functions for running the 'game'.

// Function called when a yoyo avatar is clicked. Either hides or displays it depending on the action given.
function toggleChart(yoyo, action) {
  var node = ".radar-chart-yoyo_" + yoyo.id_num;
  d3.selectAll(node).style("visibility", action);

  // Update the avatar
  if ( action == "visible" ) {
    d3.select("#yoyo_avatar_"+yoyo.id_num).style("background-color", colorLuminance(yoyo.color_hex, -0.2));
  } else {
    d3.select("#yoyo_avatar_"+yoyo.id_num).style("background-color", "rgba(0, 0, 0, 0)");
  }

  
}

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
    }
  }

}


function initialize() {
  RadarChart.draw("#chart", radar_data);

  // Hide all charts by default. Toggle them with mouseovers and clicks.
  _.each(yoyo_list, function(yoyo) {
    toggleChart(yoyo, "hidden");
  });

  // Show the first couple charts, through a faked 'click' event
  d3.select("#yoyo_avatar_0").on("click")(0);
  d3.select("#yoyo_avatar_1").on("click")(1);

}