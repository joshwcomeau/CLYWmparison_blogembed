// quick function to normalize our data on a scale from 1 to 20

var dia_min = 45,
    dia_max = 62,
    wid_min = 32,
    wid_max = 46,
    wei_min = 60,
    wei_max = 72;


function normalizer(input, min, max) {

  var normalized = ( ( input - min ) / ( max - min ) ) * 20;
  var rounded_normalized = Math.round( normalized * 10 ) / 10;

  return rounded_normalized;

}