function Yoyo(model, diameter_mm, width_mm, weight_g) {
  this.model = model;
  this.diameter_in_mm = diameter_mm;
  this.width_in_mm = width_mm;
  this.weight_in_g = weight_g;

  this.convert_to_radar_array = function() {
    var radar_item = [
      {
        axis: "diameter",
        value: this.diameter_in_mm
      },
      {
        axis: "width",
        value: this.width_in_mm
      },
      {
        axis: "weight",
        value: this.weight_in_g
      }
    ];

    console.log(radar_item);
    
    return radar_item;
    
  };
}

[
    {
      axis: "diameter", 
      value: 55
    }, 
    { 
      axis: "width", 
      value: 42
    },
    { 
      axis: "weight", 
      value: 67
    }
  ]