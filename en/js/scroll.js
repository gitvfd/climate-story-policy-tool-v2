
				const container = d3.select('#scrolly-side');
				var figure = container.select('figure');
				var article = container.select('article');
				const stepSel = article.selectAll('.step');


				const containerLever = d3.select('#scrolly-side-lever');
				var figureLever = containerLever.select('figure');
				var articleLever = containerLever.select('article');
				const stepSelLever = articleLever.selectAll('.step');

	    		// instantiate the scrollama
				const scroller = scrollama();
				const scrollerLever = scrollama();

				// generic window resize listener event
				function handleResize() {
					// 1. update height of step elements
				/*	var stepH = Math.floor(window.innerHeight * 0.75);
					stepSel.style('height', stepH + 'px');*/
					var figureHeight = window.innerHeight / 2
					var figureMarginTop = (window.innerHeight - figureHeight) / 2  
					figure
						.style('height', figureHeight + 'px')
						.style('top', figureMarginTop + 'px');

					figureLever
						.style('height', figureHeight/2 + 'px')
						.style('top', figureMarginTop + 'px');
					// 3. tell scrollama to update new element dimensions
					scroller.resize();
				}

				// scrollama event handlers
				function handleStepEnter(response) {
					updateChart(response.index)
				}

				function updateChart(index) {
					const sel = container.select(`[data-index='${index}']`);
					//const width = sel.attr('name');
					stepSel.classed('is-active', (d, i) => i === index);
					//container.select('.bar-inner').style('width', width);
                     document.getElementsByClassName("sticky")[0].src = "tools/"+ sel.attr('name')+".png";
				}


				// scrollama event handlers
				function handleStepEnterLever(response) {
					updateChartLever(response.index)
				}

				function updateChartLever(index) {
                    const selLever = containerLever.select(`[data-index='${index}']`);
					//const width = sel.attr('name');
					stepSelLever.classed('is-active', (d, i) => i === index);
					//container.select('.bar-inner').style('width', width);
                     document.getElementsByClassName("stickyLever")[0].src = "tools/"+ selLever.attr('name')+".png";
				}

				function init() {
					Stickyfill.add(d3.select('.sticky').node());
					Stickyfill.add(d3.select('.stickyLever').node());

					// 1. force a resize on load to ensure proper dimensions are sent to scrollama
					handleResize();

					// 2. setup the scroller passing options
					// this will also initialize trigger observations
					// 3. bind scrollama event handlers (this can be chained like below)
                        scroller.setup({
                            step: '#scrolly-side article .step',
                            offset: 0.6,
                            debug: false
                        })
                        .onStepEnter(handleStepEnter)
                    


                        scrollerLever.setup({
                            step: '#scrolly-side-lever article .step',
                            offset: 0.7,
                            debug: false
                        })
                        .onStepEnter(handleStepEnterLever)
					// setup resize event
					window.addEventListener('resize', handleResize);

				}

				init()