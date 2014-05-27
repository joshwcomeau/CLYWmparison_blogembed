// A set of functions to build our relevant arrays.
function build_object_array(data) {
  return _.map(yoyos, function(yoyo) {
    return new Yoyo(yoyo.model, yoyo.img_url, yoyo.color_hex, yoyo.diameter_mm, yoyo.width_mm, yoyo.weight_g, yoyo.family);
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

function build_more_info_array(object_array) {
  _.each(object_array, function(obj) {

    // Time for some straight-up oldschool JavaScript. Because why do things the easy way.
    var more_info_template = document.getElementsByClassName('yoyo_more_info_template')[0];
    var new_panel = more_info_template.cloneNode(true);
    new_panel.className = "yoyo_more_info";
    new_panel.setAttribute("id", "more_info_"+obj.id_num);
    document.getElementById("yoyo_detail_wrapper").appendChild(new_panel);
    // That was fun!

    var mi = d3.select("#more_info_"+obj.id_num);
    mi.select(".mi_name").text(obj.model);
    mi.select(".mi_dia").text(obj.diameter_in_mm);
    mi.select(".mi_wid").text(obj.width_in_mm);
    mi.select(".mi_wei").text(obj.weight_in_g);

    // Style the panel with the yoyo's color.
    mi.select("h2").style({
      "background-color": obj.color_hex,
      "text-shadow": ("1px 1px 0px " + colorLuminance(obj.color_hex, -0.4))
    });
    mi.selectAll("ul").style("background-color", colorLuminance(obj.color_hex, -0.4));

    // Add event listeners
    d3.select(new_panel).on("mouseover", function() {
      var triangle = d3.select("polygon.radar-chart-yoyo_"+obj.id_num)[0][0];
      highlightTriangle(triangle);
    }).on("mouseout", restoreTriangles);

  });

}

function build_avatar_array(object_array) {
  var avatars = [];

  _.each(object_array, function(obj) {
    d3.select("#yoyo_selection_avatars")
    .append("div")
    .data([obj.id_num]).attr("data-valid","true")
    .attr("id", "yoyo_avatar_" + obj.id_num).attr("class", "yoyo_avatar")
    .append("img").attr("src", "img/" + obj.img_url);

    // Our brand-new yoyo avatar node
    var new_node = d3.select("#yoyo_avatar_" + obj.id_num);

    // Add our label divs. Shows the name of the yoyo on mouseover/click.
    new_node.append("div")
    .attr("id", "avatar_label_"+obj.id_num).attr("class","avatar_label")
    .style("background-color", obj.color_hex)
    .text(obj.model);

    // Add our disabled-filter div. Adds a visual 'disabled' effect to those filtered out.
    new_node.insert("div", "img")
    .attr("id", "avatar_disabled_"+obj.id_num).attr("class","avatar_disabled");

    avatars.push(new_node)

  });

  // Add our event listeners
  readDataValid(object_array);

  return avatars;

}

function build_avatar_check_array(object_array) {
  _.each(avatar_list, function(avatar, index) {
    avatar.append("div").attr("class","avatar_checked").attr("id","avatar_checked_"+object_array[index].id_num)
    .style("background-color",object_array[index].color_hex);
  });
}











