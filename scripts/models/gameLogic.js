// Basic functions for running the 'game'.
function toggleChart(yoyo, action) {
  var node = ".radar-chart-yoyo_" + yoyo.id_num;
  d3.selectAll(node).style("visibility", action);
}


function initialize() {
  RadarChart.draw("#chart", radar_data);

  // Hide all charts by default. Toggle them with mouseovers and clicks.
  _.each(yoyo_list, function(yoyo) {
    toggleChart(yoyo, "hidden");
  });

}