var studentPromise = d3.json("classData.json");

studentPromise.then(
function(students){
console.log("student data",students);
initGraph("#QuizLines",students)},
function(err){console.log("failed:",err)});

var getQuiz = function(student){
    return student.quizes.map(function(quize){return quize.grade})
}

var initGraph = function(target,students)
{
    //the size of the screen
    var screen = {width:500, height:500};
    
    //how much space will be on each side of the graph
    var margins = {top:15,bottom:40,left:70,right:40};
    
    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    
    //set the screen size
    d3.select(target)
        .attr("width",screen.width)
        .attr("height",screen.height)
    
    //create a group for the graph
    var g = d3.select(target)
        .append("g")
        .classed("graph",true)
        .attr("transform","translate("+margins.left+","+
             margins.top+")");
        
    //create scales for all of the dimensions
    
    
    var xScale = d3.scaleLinear()
        .domain([0,students[1].quizes.length-1])
        .range([0,graph.width])
    

    
    var yScale = d3.scaleLinear()
                .domain([
                          d3.min(students,getQuiz),
                          d3.max(students,getQuiz)
                        ])
        .range([graph.height,0])
    
    
    
    
    //create the axis and labels
    createLabels(screen,margins,graph,target);
    createAxes(screen,margins,graph,target,xScale,yScale);

    drawLines(students, graph,target,
              xScale,yScale);
}

var createLabels = function(screen,margins,
graph,target)
{
        var labels = d3.select(target)
        .append("g")
        .classed("labels",true)
        
    labels.append("text")
        .text("Quiz Over Time")
        .classed("title",true)
        .attr("text-anchor","middle")
        .attr("x",margins.left+(graph.width/2))
        .attr("y",margins.top)
    
    labels.append("text")
        .text("Date")
        .classed("label",true)
        .attr("text-anchor","middle")
        .attr("x",margins.left+(graph.width/2))
        .attr("y",screen.height)
    
    labels.append("g")
        .attr("transform","translate(20,"+ 
              (margins.top+(graph.height/2))+")")
        .append("text")
        .text("Quiz Grade")
        .classed("label",true)
        .attr("text-anchor","middle")
        .attr("transform","rotate(90)")
    
}


var createAxes = function(screen,margins,graph,
                           target,xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    var axes = d3.select(target)
        .append("g")
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .call(xAxis)
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        .call(yAxis)
}   

var drawLines = function(students,graph,target,
              xScale,yScale)
{
    
    var lineGenerator = d3.line()
        .x(function(quize,i) { return xScale(i);})
        .y(function(quize)   { return yScale(quize);})
    
    
    var lines = d3.select(target)
        .select(".graph")
        .selectAll("g")
        .data(students)
        .enter()
        .append("g")
        .classed("line",true)
        .attr("fill","none")
        .on("mouseover",function(subject)
        {   
            if(! d3.select(this).classed("off"))
            {
            d3.selectAll(".line")
            .classed("fade",true);
            
            d3.select(this)
                .classed("fade",false)
                .raise(); //move to top
            }
        })
        .on("mouseout",function(subject)
           {
            if(! d3.select(this).classed("off"))
            {
            
            d3.selectAll(".line")
                .classed("fade",false);
            }
            
        })

    
    lines.append("path")
        .datum(function(student) 
            { return student.quizes.map(function(quize){return quize.grade})})
        .attr("d",lineGenerator); 
}