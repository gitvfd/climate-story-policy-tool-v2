var widthPol = document.getElementById("sketch").offsetWidth;

var heightPol = widthPol;

var cellLength = widthPol/7;

var svgSel = d3.select("#sketch").append("svg")
    .attr("width",widthPol)
    .attr("height", heightPol)

var sketchChart= svgSel.append("g")
    .attr("class", "compChart")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");


for (j = 0; j <= 5; j++) {
    sketchChart.append("rect")
        .attr("class", "highlightRect")
        .attr("id", "rect-sector-" + j)
        .attr("x", cellLength / 2)
        .attr("y", cellLength / 2 + (j) * cellLength)
        .attr("width", 6 * cellLength)
        .attr("height", cellLength)
        .style("fill", "#007BC6")
        .style("opacity", 0);
}

for (i = 0; i <= 5; i++) {
    sketchChart.append("rect")
        .attr("class", "highlightRect")
        .attr("id", "rect-area-" + i)
        .attr("x", cellLength / 2 + (i) * cellLength)
        .attr("y", cellLength / 2)
        .attr("width", cellLength)
        .attr("height", 6 * cellLength)
        .style("fill", "#0BB89C")
        .style("opacity",0);
}


for (i = 0; i <= 5; i++) {
    for (j = 0 ;j <= 5; j++){
        if (i==0 && j==0){
            //nothing
        } else if (i == 0) {
            var imgNaming=  'img/sector-'+ j + ".png"
            sketchChart.append("svg:image")
                .attr("class","sector-"+j)
                .attr("x", cellLength / 2 + 0.05 * cellLength)
                .attr("y", cellLength / 2 + 0.05 * cellLength + (j)*cellLength)
                .attr("width", 0.9*cellLength)
                .attr("height", 0.9 *cellLength)
                .attr("xlink:href", imgNaming)
                .on("mouseover", function () {
                    d3.select(this).style("opacity", 0.5)
                })
                .on("mousemove", function () {
                    var ind = d3.select(this).attr("class")[7];

                    //Change titles
                    if (ind == 1)
                        d3.select("#chart-tooltip .tooltip-title").html("Agriculture")
                    else if (ind == 2)
                        d3.select("#chart-tooltip .tooltip-title").html("Buildings")
                    else if (ind == 3)
                        d3.select("#chart-tooltip .tooltip-title").html("Electricity")
                    else if (ind == 4)
                        d3.select("#chart-tooltip .tooltip-title").html("Industry")
                    else if (ind == 5)
                        d3.select("#chart-tooltip .tooltip-title").html("Transport")

                    //Place & show the tooltip
                    d3.select("#chart-tooltip")
                        .style("top", (window.event.pagetY + 1 + "px"))
                        .style("left", (window.event.pageX  + 1 + "px"))
                        .style("opacity", 1)
                })
                .on("mouseout", function () {

                    d3.select("#chart-tooltip")
                        .style("opacity", 0)
                    d3.select(this).style("opacity", 1)

                });

        } else if (j == 0) {
            var imgNaming = 'img/area-' + i + ".png"
            sketchChart.append("svg:image")
                .attr("class", "area-" + i)
                .attr("x", cellLength / 2 + 0.05 * cellLength + (i ) * cellLength)
                .attr("y", cellLength / 2 + 0.05 * cellLength)
                .attr("width", 0.9 *cellLength)
                .attr("height", 0.9 *cellLength)
                .attr("xlink:href", imgNaming)

                .on("mouseover", function () {
                    d3.select(this).style("opacity", 0.5)
                })
                .on("mousemove", function () {
                    var ind = d3.select(this).attr("class")[5];
                    //Change titles
                    if (ind == 1)
                        d3.select("#chart-tooltip .tooltip-title").html("Invest")
                    else if (ind == 2)
                        d3.select("#chart-tooltip .tooltip-title").html("Regulate")
                    else if (ind == 3)
                        d3.select("#chart-tooltip .tooltip-title").html("Tax & subsidise")
                    else if (ind == 4)
                        d3.select("#chart-tooltip .tooltip-title").html("Lead")
                    else if (ind == 5)
                        d3.select("#chart-tooltip .tooltip-title").html("Inform & educate")

                    //Place & show the tooltip
                    d3.select("#chart-tooltip")
                        .style("top", (window.event.pageY + 1 + "px"))
                        .style("left", (window.event.pageX + 1 + "px"))
                        .style("opacity", 1)
                })
                .on("mouseout", function () {

                    d3.select("#chart-tooltip")
                        .style("opacity", 0)
                    d3.select(this).style("opacity", 1)

                });
        }else{
            sketchChart.append("circle")
                .attr("cx", cellLength  + (j  ) * cellLength)
                .attr("cy", cellLength  + (i ) * cellLength)
                .attr("r", cellLength/4)
                .style("fill", "#C7C7C7")
                .style("opacity", 1)
                .attr("class", "policyCircle")
                .attr("id", function () {
                    var polNumberCalc = 5 * (i - 1) + j;
                    if (polNumberCalc < 10)
                        polNumberCalc = "0" + polNumberCalc
                    return "policy-" + i + "-" + j + "-" + polNumberCalc;
                })
                .on("mouseover", function () {
                    d3.select(this).style("opacity", 1)

                    var rectSectorID = "#rect-sector-" + d3.select(this).attr("id")[7];
                    var rectAreaID = "#rect-area-" + d3.select(this).attr("id")[9];

                    d3.select(rectSectorID).style("opacity", 0.3);
                    d3.select(rectAreaID).style("opacity", 0.3);
                })
                .on("mouseout", function () {

                    d3.select(this).style("opacity", 1)

                    d3.selectAll('.highlightRect').style("opacity", 0)
                })
                .on("click", function () { policyUpdate(d3.select(this).attr("id").substr(-2))})

            sketchChart.append("text")
                .attr("x", cellLength + (j) * cellLength)
                .attr("y", cellLength + (i) * cellLength)
                .attr("class", "polNumber")
                .attr("text-anchor", "middle").attr("alignment-baseline", "middle")
                .text(function () {
                    return 5 * (i - 1) + j;
                })
        }
        
    }
}

function findRef(refPolicy) {
var temp;
    if (refPolicy == "01")
        temp = "policy-1-1-01";

    if (refPolicy == "02")
        temp = "policy-1-2-02";

    if (refPolicy == "03")
        temp = "policy-1-3-03";

    if (refPolicy == "04")
        temp = "policy-1-4-04";

    if (refPolicy == "05")
        temp = "policy-1-5-05";

    if (refPolicy == "06")
        temp = "policy-2-1-06";

    if (refPolicy == "07")
        temp = "policy-2-2-07";

    if (refPolicy == "08")
        temp = "policy-2-3-08";

    if (refPolicy == "09")
        temp = "policy-2-4-09";

    if (refPolicy == "10")
        temp = "policy-2-5-10";

    if (refPolicy == "11")
        temp = "policy-3-1-11";

    if (refPolicy == "12")
        temp = "policy-3-2-12";

    if (refPolicy == "13")
        temp = "policy-3-3-13";

    if (refPolicy == "14")
        temp = "policy-3-4-14";

    if (refPolicy == "15")
        temp = "policy-3-5-15";

    if (refPolicy == "16")
        temp = "policy-4-1-16";

    if (refPolicy == "17")
        temp = "policy-4-2-17";

    if (refPolicy == "18")
        temp = "policy-4-3-18";

    if (refPolicy == "19")
        temp = "policy-4-4-19";

    if (refPolicy == "20")
        temp = "policy-4-5-20";

    if (refPolicy == "21")
        temp = "policy-5-1-21";

    if (refPolicy == "22")
        temp = "policy-5-2-22";

    if (refPolicy == "23")
        temp = "policy-5-3-23";

    if (refPolicy == "24")
        temp = "policy-5-4-24";

    if (refPolicy == "25")
        temp = "policy-5-5-25";
    
    return temp;
}

function policyUpdate(refPolicy){


    var refPolicyFull=findRef(refPolicy)

    d3.selectAll(".policyCircle")
        .style("fill", "#C7C7C7")
        .style("opacity", 1)


    
    var selector = "#" + refPolicyFull;

    d3.select(selector).style("fill", "#0bb89c")

    var sectorIDsrc = "img/sector-" + refPolicyFull[7] + ".png";
    var areaIDsrc = "img/area-" + refPolicyFull[9] + ".png";

    //rotate cube (source: https://html-online.com/articles/css3-cube/)
    var keyGen=Math.random()
    if (keyGen<=1/3)    
        turnLeft();
    else if (keyGen <= 2 / 3)  
        turnRight();  
    else if (keyGen <=1)  
        flipCube()



    document.getElementById("sectorPic").src = sectorIDsrc
    document.getElementById("sectorPic2").src = sectorIDsrc
    document.getElementById("areaPic").src = areaIDsrc
    document.getElementById("areaPic2").src = areaIDsrc

    //update Policy Number
    document.getElementById("policyNumber").innerHTML = refPolicy.substr(-2)
    
    //update Policy Title
    data.forEach(function (d) {
        if (d.policyNumber == refPolicy.substr(-2))
            document.getElementById("policyTitle").innerHTML = d.title;
    })   

    //update Policy Desc
    data.forEach(function (d) {
        if (d.policyNumber == refPolicy.substr(-2))
            document.getElementById("policyDesc").innerHTML = d.Text;
    })  

    //update extra Data 
    data.forEach(function (d) {
        if (d.policyNumber == refPolicy.substr(-2)){
            document.getElementById("extraDataTag").innerHTML = d.DataIntro ;
            document.getElementById("dataTitle").innerHTML = d.DataTitle ;
            document.getElementById("dataTitle").href = d.DataLink;

       
    //update extra Report 

            document.getElementById("extraReportTag").innerHTML = d.ReportIntro;
            document.getElementById("reportTitle").innerHTML = d.ReportTitle;
            document.getElementById("reportTitle").href = d.ReportLink;
       
    //update extra Brief 
       
            document.getElementById("extraBriefTag").innerHTML = d.BriefIntro;
            document.getElementById("briefTitle").innerHTML = d.BriefTitle;
            document.getElementById("briefTitle").href = d.BriefLink;
        }
    })  

   if(['section1', 'section2', 'section3', 'section4'].includes(window.location.href.substr(-8))){
    if(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'].includes(window.location.href.substr(0,window.location.href.length-9).substr(-2))){
        window.history.pushState("object or string", "Page Title", window.location.href.substr(0,window.location.href.length-16)+ "?key=" + refPolicy.substr(-2) + window.location.href.substr(-9) );    
    }
    else{
        window.history.pushState("object or string", "Page Title", window.location.href.substr(0,window.location.href.length-9)+ "?key=" + refPolicy.substr(-2) + window.location.href.substr(-9) );    
    
    }
    
    }
    else if (['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'].includes(window.location.href.substr(-2))){
        window.history.pushState("object or string", "Page Title", window.location.href.substr(0,window.location.href.length-7)+ "?key=" + refPolicy.substr(-2));    

    }
    else{
    window.history.pushState("object or string", "Page Title", window.location.href+ "?key=" + refPolicy.substr(-2));       
    }


    //update URL
   // window.history.pushState("object or string", "Page Title", window.location+ "?key=" + refPolicy.substr(-2));
//window.location.pushState("object or string", "Page Title", "?key=" + refPolicy.substr(-2));

//var urlnew=window.location+"?key=" + refPolicy.substr(-2);

//console.log(window.history.pushState("object or string", "Page Title", window.location+ "?key=" + refPolicy.substr(-2)))
//window.history.pushState({}, '', urlnew);


}


//start app
var url=window.location;

var data = [];
var counter = 0;
d3.tsv("data/policy.tsv").then( function (temp) {
    temp.forEach(function (d) {
        data.push(d)
        counter++
        if (counter == temp.length){
            if (['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'].includes(url.href.substr(-2)))
                policyUpdate(url.href.substr(-2))
            else
                policyUpdate("01")
        }
    })
})


//Rotate the cube
var cubex = -22,    // initial rotation
    cubey = -38,
    cubez = 0;
function rotate(variableName, degrees) {
    /*dataLayer.push({
        'siteName': 'Climate 25 actions Desktop Tool',
        'siteEnvironment': 'Mobile version',
        'pageLanguage': 'English',
        'event': 'gtm.dom'
    });*/
    window[variableName] = window[variableName] + degrees;
    rotCube(cubex, cubey, cubez);
}
function rotCube(degx, degy, degz) {
    segs = "rotateX(" + degx + "deg) rotateY(" + degy + "deg) rotateZ(" + degz + "deg) translateX(0) translateY(0) translateZ(0)";
    document.getElementById("cube").style.transform= segs;
}
function turnRight() {
    rotate("cubey", 180);
}
function turnLeft() {
    rotate("cubey", -180);
}
function flipCube() {
    rotate("cubez", -360);
}


