function Yoyo(model, img_url, color_hex, diameter_mm, width_mm, weight_g, family, big_img_url) {
  this.model = model;
  this.img_url = img_url;
  this.color_hex = color_hex;
  this.diameter_in_mm = diameter_mm;
  this.width_in_mm = width_mm;
  this.weight_in_g = weight_g;
  this.family = family;
  this.big_img_url = big_img_url;

  Yoyo.yoyo_counter = (Yoyo.yoyo_counter + 1|| 0);
  this.id_num = Yoyo.yoyo_counter;

  // Because changes are relatively subtle in yoyo sizes/weights, I'm going to artificially reduce the range bu 45.
  this.convert_to_radar_array = function() {
    var radar_item = [
      {
        axis: "diameter",
        value: normalizer(this.diameter_in_mm, dia_min, dia_max)
      },
      {
        axis: "width",
        value: normalizer(this.width_in_mm, wid_min, wid_max)
      },
      {
        axis: "weight",
        value: normalizer(this.weight_in_g, wei_min, wei_max)
      }
    ];
    
    return radar_item;
    
  };
}