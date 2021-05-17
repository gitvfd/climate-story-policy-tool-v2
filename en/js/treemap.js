
      //begin: constants
      var _2PI = 2*Math.PI;
      //end: constants
      
     
      //begin: layout conf.
      var svgWidth = document.getElementById("treemap").offsetWidth,
          svgHeight = svgWidth,
          margin = {top: 10, right: 10, bottom: 10, left: 10},
          height = svgHeight - margin.top - margin.bottom,
          width = svgWidth - margin.left - margin.right,
          halfWidth = width/2,
          halfHeight = height/2,
          quarterWidth = width/4,
          quarterHeight = height/4,
          titleY = 20,
          legendsMinY = height - 20,
          treemapRadius,
          treemapCenter = [halfWidth, halfHeight+5];
        if(width>=height)
        treemapRadius=height/2.35
        else
        treemapRadius=width/2.35
      //end: layout conf.
      
      //begin: treemap conf.
      var _voronoiTreemap = d3.voronoiTreemap();
      var hierarchy, circlingPolygon;
      //end: treemap conf.
      
      //begin: drawing conf.
      var fontScale = d3.scaleLinear();

      var iconScale = d3.scaleLinear();
      //end: drawing conf.
      
      //begin: reusable d3Selection
      var svg, drawingArea, treemapContainer;
      //end: reusable d3Selection
      
      d3.json("data/data_1.json").then(function(rootData) {
        initData();
        initLayout(rootData);
        hierarchy = d3.hierarchy(rootData).sum(function(d){ return d.weight; });
        _voronoiTreemap
          .clip(circlingPolygon)
        	(hierarchy);
        
        drawTreemap(hierarchy);
      });
      
      function initData(rootData) {
        circlingPolygon = computeCirclingPolygon(treemapRadius);
        fontScale.domain([0, 40]).range([8*treemapRadius/350, 25*treemapRadius/350]).clamp(true);
        iconScale.domain([0, 40]).range([25*treemapRadius/350, 100*treemapRadius/350]).clamp(true);
      }
      
      function computeCirclingPolygon(radius) {
        var points = 60,
            increment = _2PI/points,
            circlingPolygon = [];
        
        for (var a=0, i=0; i<points; i++, a+=increment) {
          circlingPolygon.push(
            [radius + radius*Math.cos(a), radius + radius*Math.sin(a)]
          )
        }
        
      	return circlingPolygon;
      };
      
      function initLayout(rootData) {
        svg = d3.select("svg")
          .attr("width", svgWidth)
          .attr("height", svgHeight);
        
        drawingArea = svg.append("g")
        	.classed("drawingArea", true)
        	.attr("transform", "translate("+[margin.left,margin.top]+")");
        
        treemapContainer = drawingArea.append("g")
        	.classed("treemap-container", true)
        	.attr("transform", "translate("+treemapCenter+")");
        
        treemapContainer.append("path")
        	.classed("world", true)
        	.attr("transform", "translate("+[-treemapRadius,-treemapRadius]+")")
        	.attr("d", "M"+circlingPolygon.join(",")+"Z");
        
       // drawTitle();
        drawFooter();
        //drawLegends(rootData);
      }
      
      function drawTitle() {
        drawingArea.append("text")
        	.attr("id", "title")
        	.attr("transform", "translate("+[0, titleY]+")")
        	.attr("text-anchor", "left")
          .text("DIRECT GLOBAL GREENHOUSE GAS EMISSIONS BY ECONOMIC SECTOR")
      }
      
      function drawFooter() {
        drawingArea.append("text")
        	.classed("tiny light", true)
        	.attr("transform", "translate("+[0, height]+")")
        	.attr("text-anchor", "start")
        	.text("Source: 2017 data by Rhodium Group")
        /*drawingArea.append("text")
        	.classed("tiny light", true)
        	.attr("transform", "translate("+[halfWidth, height]+")")
        	.attr("text-anchor", "middle")
        	.text("by @_Kcnarf")
        drawingArea.append("text")
        	.classed("tiny light", true)
        	.attr("transform", "translate("+[width, height]+")")
        	.attr("text-anchor", "end")
        	.text("bl.ocks.org/Kcnarf/fa95aa7b076f537c00aed614c29bb568")*/
      }
      
      function drawLegends(rootData) {
        var legendHeight = 13,
            interLegend = 4,
            colorWidth = legendHeight*6,
            continents = rootData.children.reverse();
        
        var legendContainer = drawingArea.append("g")
        	.classed("legend", true)
        	.attr("transform", "translate("+[0, legendsMinY]+")");
        
        var legends = legendContainer.selectAll(".legend")
        	.data(continents)
        	.enter();
        
        var legend = legends.append("g")
        	.classed("legend", true)
        	.attr("transform", function(d,i){
            return "translate("+[0, -i*(legendHeight+interLegend)]+")";
          })
        	
        legend.append("rect")
        	.classed("legend-color", true)
        	.attr("y", -legendHeight)
        	.attr("width", colorWidth)
        	.attr("height", legendHeight)
        	.style("fill", function(d){ return d.color; });
        legend.append("text")
        	.classed("tiny", true)
        	.attr("transform", "translate("+[colorWidth+5, -2]+")")
        	.text(function(d){ return d.name; });
        
        legendContainer.append("text")
        	.attr("transform", "translate("+[0, -continents.length*(legendHeight+interLegend)-5]+")")
          .text("Continents");
      }
      
      function drawTreemap(hierarchy) {
        var leaves=hierarchy.leaves();


        var leaf = treemapContainer.selectAll("g")
          .data(leaves)
          .enter().append("g")
                .attr("transform", "translate("+[-treemapRadius,-treemapRadius]+")")


        leaf.append("path")
        			.classed("cell", true)
        			.attr("d", function(d){ return "M"+d.polygon.join(",")+"z"; })
        			.style("fill", function(d){
                return d.data.color; // previously d.parent.data.color;
          		});
          
                      
        leaf.append("svg:image")
        .attr('x', function(d){ return d.polygon.site.x ;} )
        .attr('y', function(d){ return d.polygon.site.y+20;} )
        .attr('width', function(d){ return iconScale(d.data.weight); })
        .attr('height', function(d){ return iconScale(d.data.weight); })
        .attr("xlink:href",  function(d){return "icons/"+d.data.name.split(",")[0]+".png";})
        
        var labels = treemapContainer.append("g")
        	.classed('labels', true)
        	.attr("transform", "translate("+[-treemapRadius,-treemapRadius]+")")
	        .selectAll(".label")
        	.data(leaves)
        	.enter()
        		.append("g")
        			.classed("label", true)
        			.attr("transform", function(d){
          			return "translate("+[d.polygon.site.x, d.polygon.site.y-treemapRadius/17.5]+")";
              })
        			.style("font-size", function(d){ return fontScale(d.data.weight); });
        
        labels.append("text")
        	.classed("name", true)
            .attr("dy",  '0.5em')
        	.html(function(d){
          	return (d.data.weight<1)? d.data.code : d.data.name;
        	}).call(wrap,treemapRadius/1.25);
        labels.append("text")
        	.classed("value", true)
            .attr("dy",  '-2em')
        	.text(function(d){ return d.data.weight+"%"; });



        var hoverers = treemapContainer.append("g")
        	.classed('hoverers', true)
        	.attr("transform", "translate("+[-treemapRadius,-treemapRadius]+")")
	        .selectAll(".hoverer")
        	.data(leaves)
        	.enter()
        		.append("path")
        			.classed("hoverer", true)
        			.attr("d", function(d){ return "M"+d.polygon.join(",")+"z"; });
        
        hoverers.append("title")
          .text(function(d) { return d.data.name + "\n" + d.value+"%"; });
      }


        function wrap(text, width) {
        text.each(function() {

            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
            while (word = words.pop()) {
            line.push(word)
            tspan.text(line.join(" "))
            if (tspan.node().getComputedTextLength() > width) {
                line.pop()
                tspan.text(line.join(" "))
                line = [word]
                lineNumber++
                
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", (1 * lineHeight) + 'em').text(word)
            }
            }
        })
        }
