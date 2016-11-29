var jsonModel = {};

var fill, force, svg, g;

function initd3(){
  d3.select("svg").remove();
  fill = d3.scale.category20();

  force = d3.layout.force()
      .charge(-500)
      .gravity(0)
      .linkDistance(80)
      .size([width, height]);

  svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  g = svg.append("g");
}

function init(data){
  d3.json("state", function(error, json) {
    if (error) throw error;
    jsonModel = json;

    if(_.get(data, 'version')){
      jsonModel.version = data.version;
    }
    
    updateHeading(jsonModel);

    var link = svg.selectAll("line")
        .data(jsonModel.links)
        .enter().append("line");

    var node = svg.selectAll("circle")
        .data(jsonModel.nodes)
        .enter().append("circle")
        .attr("r", function(d) { return radius - .75 + d.value})
        .style("fill", function(d) { return colorcoding[d.status]; })
        .style("stroke", function(d) { return d3.rgb(colorcoding[d.status]).darker(); })
        .call(force.drag);

    var texts = svg.selectAll("text.label")
        .data(jsonModel.nodes)
        .enter().append("text")
        .attr("class", "label")
        .attr("fill", "black")
        .text(function(d) {  return d.name;  });

    force
        .nodes(jsonModel.nodes)
        .links(jsonModel.links)
        .on("tick", tick)
        .start();

    var text = g.selectAll(".text")
        .data(jsonModel.nodes)
        .enter().append("text")
        .attr("dy", ".35em")


    function tick(e) {
      var k = 6 * e.alpha;

      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });

      texts.attr("transform", function(d) {
          return "translate(" + d.x + "," + (d.y - d.value - 10) + ")";
      });

    }
  }); 
}

function update(data){
  updateModel(data);
  updateHeading(jsonModel);

  var node = svg.selectAll("circle")
      .data(jsonModel.nodes);

  node.enter().append("circle")
      .attr("r", function(d) { return radius - .75 + d.value});
  node.style("fill", function(d) { return colorcoding[d.status];})
      .style("stroke", function(d) { return d3.rgb(colorcoding[d.status]).darker(); })
      .call(force.drag);

  node.exit().remove();
}

function updateHeading(){
  var h = document.getElementById("versionHeading");
  h.textContent = jsonModel.version; 
}

function updateModel(data){
  jsonModel.nodes = _.map(jsonModel.nodes, function(item){
    return _.extend(item, _.find(data.nodes, { id: item.id }));
  });

  jsonModel.version = data.version;
}

initd3();
init();

