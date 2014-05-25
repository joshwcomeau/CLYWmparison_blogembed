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
    .on("click", function(index) {

      if (d3.select("#yoyo_avatar_"+index).style("background-color") == "rgba(0, 0, 0, 0)") {
        d3.select("#yoyo_avatar_"+index).style("background-color", obj.color_hex);
        toggleChart(obj, "visible");
      } else {
        d3.select("#yoyo_avatar_"+index).style("background-color", "rgba(0, 0, 0, 0)");
        toggleChart(obj, "hidden");
      }
    })
    .append("img").attr("src", "img/" + obj.img_url);

  })

}