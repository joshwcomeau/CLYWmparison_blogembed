// Basic functions for running the 'game'.

// Function called when a yoyo avatar is clicked. Either hides or displays it depending on the action given.
function toggleChart(yoyo, action) {
  var node = ".radar-chart-yoyo_" + yoyo.id_num;
  d3.selectAll(node).style("visibility", action);

  // Update the avatar
  if ( action == "visible" ) {
    d3.select("#yoyo_avatar_"+yoyo.id_num).style("background-color", yoyo.color_hex);
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

    if ( i <= num_visible ) { // These are the first 4. We want to see these ones!
      toggleChart(yoyo, "visible");
    } else {
      toggleChart(yoyo, "hidden");
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