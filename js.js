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

  var screen={width:780,height:700};
  var margin = {top: 100, right: 100, bottom: 20, left: 100};
  var w = screen.width - margin.left - margin.right;
  var h = screen.height - margin.top - margin.bottom;

  var svg=d3.select("body").append("svg")
  .attr('width', screen.width)
  .attr('height', screen.height)
  .attr('id', 'mainchart')

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
  .attr('name', function(){
    var picture=d[bigi].picture
    var a=picture.indexOf("-")
    var b=picture.substring(0,a)
    var first=b.charAt(0).toUpperCase()
    var c=b.substring(1)
    var name=first.concat(c)
    return name
  })
  d3.select("#g"+bigi).selectAll("rect").data(points[bigi]).enter().append("rect")
      .attr('x', function(d,i){return xScale(i)})
      .attr('y', yScale(bigi))
      .attr('width', rectwidth)
      .attr('height', rectwidth)
      .style('fill', function(d){
        if (d<0){
          return "#E5F0F6"
        }
        else {return colorScale(d)}})
      .attr('id', function(data,i){
        var gname=d3.select("#g"+bigi).attr('name')
        var picture=d[i].picture
        var a=picture.indexOf("-")
        var b=picture.substring(0,a)
        var first=b.charAt(0).toUpperCase()
        var c=b.substring(1)
        var name=first.concat(c)
        return gname+" & "+name
      })
      .on('mouseover',function(d){
        var rect=d3.select(this)
        rect.attr("stroke","black")
        .attr('stroke-width', 2)
        var x=d3.select(this).attr('x')
        var y=d3.select(this).attr('y')
        var name=d3.select(this).attr('id')
        svg.append('rect')
        .attr('id', 'back')
        .attr('x',x-5)
        .attr('y',y-50)
        .attr('width', 180)
        .attr('height',48)
        .style('fill', '#CBD6CF');

        svg.append('text')
        .attr('id', 'names')
        .attr('x', x)
        .attr('y', y-30)
        .attr('font-family', 'Raleway')
		    .attr("font-size", "15px")
		    .attr("font-weight", "bold")
		    .attr("fill", "black")
		    .text(name)

        svg.append('text')
        .attr('id', 'corrolation')
        .attr('x', x)
        .attr('y', y-10)
        .attr('font-family', 'Raleway')
		    .attr("font-size", "15px")
		    .attr("font-weight", "bold")
		    .attr("fill", "black")
		    .text("r: "+d.toFixed(2))
      } )
      .on('mouseout', function(){
        var rect=d3.select(this)
        rect.attr("stroke","none")
        d3.select("#names").remove()
        d3.select("#corrolation").remove()
        d3.select("#back").remove()
      })
    })



  var legend= d3.select("body").append("svg").attr('id', 'legend').attr('width', 500).attr('height', 100)

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
      .attr('x',0 )
      .attr('y',30 )
      .attr('width', 400)
      .attr('height', 50)
      .style('fill', 'url(#'+linearGradient.attr('id')+')')

  legend.append("text")
  .attr('id', '-1')
  .attr('x', 0)
  .attr('y', 15)
  .attr('font-family', 'Raleway')
  .attr("font-size", "15px")
  .attr("font-weight", "bold")
  .attr("fill", "black")
  .text("-1.0")

  legend.append("text")
  .attr('id', '0')
  .attr('x', 200)
  .attr('y', 15)
  .attr("text-anchor", "middle")
  .attr('font-family', 'Raleway')
  .attr("font-size", "15px")
  .attr("font-weight", "bold")
  .attr("fill", "black")
  .text("0")

  legend.append("text")
  .attr('id', '0')
  .attr('x', 400)
  .attr('y', 15)
  .attr("text-anchor", "middle")
  .attr('font-family', 'Raleway')
  .attr("font-size", "15px")
  .attr("font-weight", "bold")
  .attr("fill", "black")
  .text("1.0")



}





data.then(function(d){
  drawChart(d)
}

)
