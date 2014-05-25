// A set of functions to build our relevant arrays.
function build_object_array(data) {
  return _.map(yoyos, function(yoyo) {
    return new Yoyo(yoyo.model, yoyo.img_url, yoyo.color_hex, yoyo.diameter_mm, yoyo.width_mm, yoyo.weight_g);
  });
}

function build_radar_array(object_array) {
  return _.map(object_array, function(obj) {
    return obj.convert_to_radar_array();
  });
}

function build_color_array(object_array) {
  return _.map(object_array, function(obj) {
    return obj.color_hex;
  });
}

function build_avatar_array(object_array) {
  _.each(object_array, function(obj) {
    d3.select("#yoyo_selection_wrapper")
    .append("div")
    .data([obj.id_num])
    .attr("id", function() {
      return "yoyo_avatar_" + obj.id_num;
    }).attr("class", "yoyo_avatar")
    .style("background-image", "url('img/" + obj.img_url + "')")
    .on("click", function() {
      d3.select(".radar-chart-yoyo_"+obj.id_num).style("fill",color_list[obj.id_num]);
    });

  })

}