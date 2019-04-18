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
  var screen={width:600,height:600};
  var margin = {top: 20, right: 100, bottom: 100, left: 20};
  var w = screen.width - margin.left - margin.right;
  var h = screen.height - margin.top - margin.bottom;

  var svg=d3.select("body").append("svg")
  .attr('width', w)
  .attr('height', h)

  var rectwidth=w/points.length

  var xScale=d3.scaleLinear()
      .domain([0,22])
      .range([margin.left,w+margin.left]);

  var yScale=d3.scaleLinear()
      .domain([0,22])
      .range([margin.top,h+margin.top]);

console.log(points)
points.forEach(function(bigd,bigi){
  svg.append("g").attr('id', "g"+bigi)
  d3.select("#g"+bigi).selectAll("rect").data(points).enter().append("rect")
      .attr('x', xScale(bigi))
      .attr('y', function(d,i){
        return yScale(i)
      })
      .attr('width', rectwidth)
      .attr('height', rectwidth)
      .style('fill', '#111');

})

}





data.then(function(d){
  drawChart(d)
}

)
