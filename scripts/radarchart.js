// Radar-chart-D3.
// Created by alangrafu. https://github.com/alangrafu/radar-chart-d3
// Modified by Joshua Comeau.

var RadarChart = {
  draw: function(id, d, options){
    var containerWidth = parseInt(d3.select(id).style("width"));
    var cfg = {
     radius: 5,
     w: containerWidth,
     h: containerWidth,
     factor: 0.9,
     factorLegend: 1,
     levels: 3,
     maxValue: 20,
     radians: 2 * Math.PI,
     opacityArea: 0.5,
     color: color_list,
     fontSize: 10
    };
    if('undefined' !== typeof options){
      for(var i in options){
        if('undefined' !== typeof options[i]){
          cfg[i] = options[i];
        }
      }
    }
    
    // Outdated. Our max is a static 75, for now. 
    /* cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))})); */

    // Get an array of our 3 axis titles.
    var allAxis = _.map(d[0], function(key, val){
      return key.axis
    });

    var total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    d3.select(id).select("svg").remove();

    // Create our large backdrop svg
    var g = d3.select(id).append("svg").attr("width", cfg.w).attr("height", cfg.h).append("g");

    var tooltip;

    function getPosition(i, range, factor, func){
      factor = typeof factor !== 'undefined' ? factor : 1;
      return range * (1 - factor * func(i * cfg.radians / total));
    }
    function getHorizontalPosition(i, range, factor){
      return getPosition(i, range, factor, Math.sin);
    }
    function getVerticalPosition(i, range, factor){
      return getPosition(i, range, factor, Math.cos);
    }
    // Draw background circles, for decor.
    d3.selectAll("svg").selectAll("g").append("svg:circle")
      .attr("r", 200).attr("cx", cfg.w/2).attr("cy", cfg.h/2)
      .style("fill", "#000").style("fill-opacity", "0.03")
      .style("stroke-width", "1px").style("stroke","#000").style("stroke-opacity", "0.07");
    d3.selectAll("svg").selectAll("g").append("svg:circle")
      .attr("r", 132).attr("cx", cfg.w/2).attr("cy", cfg.h/2)
      .style("fill", "#FFF").style("fill-opacity", "1")
      .style("stroke-width", "1px").style("stroke","#000").style("stroke-opacity", "0.07");

    // Draw the gray background reference trangles.
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = radius*((j+1)/cfg.levels);
      g.selectAll(".levels").data(allAxis).enter().append("svg:line")
       .attr("x1", function(d, i){return getHorizontalPosition(i, levelFactor);})
       .attr("y1", function(d, i){return getVerticalPosition(i, levelFactor);})
       .attr("x2", function(d, i){return getHorizontalPosition(i+1, levelFactor);})
       .attr("y2", function(d, i){return getVerticalPosition(i+1, levelFactor);})
       .attr("class", "line").style("stroke", "grey").style("stroke-width", "0.5px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");

    }
    
// .append("svg:circle").attr("class", class_name + series)
//         .attr('r', cfg.radius)
//         .attr("alt", function(j){return Math.max(j.value, 0)})
//         .attr("cx", function(j, i){
//           dataValues.push([
//             getHorizontalPosition(i, cfg.w/2, (parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor),
//             getVerticalPosition(i, cfg.h/2, (parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor)
//           ]);
//           return getHorizontalPosition(i, cfg.w/2, (Math.max(j.value, 0)/cfg.maxValue)*cfg.factor);
//         })
//         .attr("cy", function(j, i){
//           return getVerticalPosition(i, cfg.h/2, (Math.max(j.value, 0)/cfg.maxValue)*cfg.factor);
//         })
//         .attr("data-id", function(j){return j.axis})
//         .style("fill", cfg.color[series]).style("fill-opacity", .9)
//         .on('mouseover', function (d){


    series = 0;
    var class_name = "radar-chart-yoyo_";

    // Create our containers for our 3 axis lines
    var axis = g.selectAll(".axis").data(allAxis).enter().append("g").attr("class", "axis");

    // Draw our axis lines
    axis.append("line")
        .attr("x1", cfg.w/2)
        .attr("y1", cfg.h/2)
        .attr("x2", function(j, i){return getHorizontalPosition(i, cfg.w/2, cfg.factor);})
        .attr("y2", function(j, i){return getVerticalPosition(i, cfg.h/2, cfg.factor);})
        .attr("class", "line")
        .style("stroke", "grey").style("stroke-width", "1px");
        
 
    d.forEach(function(y, x){
      dataValues = [];
      g.selectAll(".nodes")
        .data(y, function(j, i){
          dataValues.push([
            getHorizontalPosition(i, cfg.w/2, (parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor),
            getVerticalPosition(i, cfg.h/2, (parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor)
          ]);
        });
      dataValues.push(dataValues[0]);
      
      g.selectAll(".area")
        .data([dataValues])
        .enter()
        .append("polygon")
        .attr("class", class_name + series)
        .style("stroke-width", "2px")
        .style("stroke", cfg.color[series])
        .style("rx", "15")
        .style("ry", "25")
        .attr("points",function(d) {
            var str="";
            for(var pti=0;pti<d.length;pti++){
                str=str+d[pti][0]+","+d[pti][1]+" ";
            }
            return str;
         })
        .style("fill", function(j, i){return cfg.color[series]})
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d){
          highlightTriangle(this);
        })
        .on('mouseout', restoreTriangles);
      series++;
    });
    series=0;
    
  }
};