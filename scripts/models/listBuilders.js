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
       
        // Show the more-info panel
        d3.select("#more_info_"+obj.id_num).style("opacity","0").style("display","inline-block")
        .transition(250).style("opacity","1");
     
      } else {
        toggleChart(obj, "hidden");
        // Update our stack
        var selection_index = selection_stack.indexOf(obj.id_num);
        selection_stack.splice(selection_index, 1);

        // hide the more-info panel
        d3.select("#more_info_"+obj.id_num).transition(250).style("opacity","0").each("end", function() {
          d3.select(this).style("display","none");
        });
      }

      refreshVisible();
    })
    .on("mouseover", function(index) {
      d3.select("#avatar_label_"+obj.id_num).transition(500).style("bottom","4px");
    })
    .on("mouseout", function(index) {
      if (d3.select(".radar-chart-yoyo_"+index).style("visibility") == "hidden") {
        d3.select("#avatar_label_"+obj.id_num).transition(500).style("bottom","-35px");
      }
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