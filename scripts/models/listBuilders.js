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
    d3.select("#yoyo_selection_avatars")
    .append("div")
    .data([obj.id_num])
    .attr("id", "yoyo_avatar_" + obj.id_num).attr("class", "yoyo_avatar")
    .on("click", function(index) {

      if (d3.select(".radar-chart-yoyo_"+index).style("visibility") == "hidden") {
        toggleChart(obj, "visible");
        // Update our stack
        selection_stack.push(obj.id_num);
      } else {
        toggleChart(obj, "hidden");
        // Update our stack
        var selection_index = selection_stack.indexOf(obj.id_num);
        selection_stack.splice(selection_index, 1);
      }

      refreshVisible();
    })
    .on("mouseover", function(index) {

    })
    .on("mouseout", function(index) {

    })
    .append("img").attr("src", "img/" + obj.img_url);

    d3.select("#yoyo_avatar_" + obj.id_num).append("div")
    .attr("id", "avatar_label_"+obj.id_num).attr("class","avatar_label")
    .style("background-color", obj.color_hex).text(obj.model);



  })
  // _.each(d3.selectAll("#yoyo_selection_avatars > div"), function(avatarDiv) {
  //   console.log("avatarDiv");
  // });

}