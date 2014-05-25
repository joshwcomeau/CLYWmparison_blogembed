// A set of functions to build our relevant arrays.
function build_object_array(data) {
  return _.map(yoyos, function(yoyo) {
    return new Yoyo(yoyo.model, yoyo.img_url, yoyo.diameter_mm, yoyo.width_mm, yoyo.weight_g);
  });
}

function build_radar_array(object_array) {
  return _.map(object_array, function(obj) {
    return obj.convert_to_radar_array();
  });
}

function build_avatar_array(object_array) {
  
}