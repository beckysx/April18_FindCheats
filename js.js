var data=d3.json("classData.json")
var corralation=function(a,b){
  var arryA=a.quizes.map(function(d){return d.grade})
  var arryB=b.quizes.map(function(d){return d.grade})
  var ma=d3.mean(arryA)
  var mb=d3.mean(arryB)
  var top=arryA.reduce(function(accu,curr,i){
    var adiff=curr-ma
    var bdiff=arryB[i]-mb
    var product=adiff*bdiff
    return accu+product
  })
  var sa=d3.deviation(arryA)
  var sb=d3.deviation(arryB)
  var bottom=sa*sb
  var r=(1/(arryA.length-1))*(top/bottom)
  if (r>1)
  {
    r=1;
  }
  return r
}
var combination=function(d){
  var colomn=[]
  d.forEach(function(a){
    var row=[]
    d.forEach(function(b){
      var r=corralation(a,b)
      row.push(r)
    })
    colomn.push(row)
  })
  return colomn
}
var drawChart=function(d){

  var points=combination(d)

  var screen={width:700,height:700};
  var margin = {top: 20, right: 100, bottom: 100, left: 20};
  var w = screen.width - margin.left - margin.right;
  var h = screen.height - margin.top - margin.bottom;

  var svg=d3.select("body").append("svg")
  .attr('width', w)
  .attr('height', h)

  var rectwidth=22

  // scales
  var xScale=d3.scaleLinear()
      .domain([0,24])
      .range([margin.left,w+margin.left]);

  var yScale=d3.scaleLinear()
      .domain([0,24])
      .range([margin.top,h+margin.top]);

  var colorstart=d3.rgb(229, 240, 246)
  var colorend=d3.rgb(82, 128, 153)
  var colorScale = d3.interpolate(colorstart,colorend)

  // draw rects
points.forEach(function(bigd,bigi){
  svg.append("g").attr('id', "g"+bigi)
  d3.select("#g"+bigi).selectAll("rect").data(points[bigi]).enter().append("rect")
      .attr('x', function(d,i){return xScale(i)})
      .attr('y', yScale(bigi))
      .attr('width', rectwidth)
      .attr('height', rectwidth)
      .style('fill', function(d){
        if (d<0){
          return "#E5F0F6"
        }
        else {return colorScale(d)}

      })
    })



  var legend= d3.select("body").append("svg")

  // legend color
  var linearGradient=
  legend.append("defs").append("linearGradient")
  .attr('id', 'colorchange')
  .attr('x1', "0%")
  .attr('y1', "0%")
  .attr('x2', "100%")
  .attr('y2', "0%")

  linearGradient.append("stop")
  .attr('offset', "50%")
  .attr('stop-color', colorstart.toString())

  linearGradient.append("stop")
  .attr('offset', "100%")
  .attr('stop-color', colorend.toString())

  legend.append("rect")
      .attr('x',1000 )
      .attr('y',400 )
      .attr('width', 400)
      .attr('height', 100)
      .style('fill', 'url(#'+linearGradient.attr('id')+')');




}





data.then(function(d){
  drawChart(d)
}

)
