// Basic functions for running the 'game'.
function toggleChart(yoyo, action) {
  var node = ".radar-chart-yoyo_" + yoyo.id_num;
  d3.selectAll(node).style("visibility", action);
  if ( action == "visible" ) {
    selection_stack.push(yoyo.id_num);
  } else {
    var selection_index = selection_stack.indexOf(yoyo.id_num);
    selection_stack.splice(selection_index, 1);
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