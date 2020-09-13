let mouseIsDown = false
let l1Points = []
//Add start points for the drawn line to an array
function onMouseDown(event) {
    l1Points.splice(0, 2, {x: event.offsetX, y: event.offsetY})
    mouseIsDown = true
}
//Add end points for the drawn line to an array and draws it
function onMouseMove(event) {
    if(mouseIsDown){
        l1Points.splice(1,1,{x: event.offsetX, y: event.offsetY})
        setup()
        addPoly(l1Points,'red')
    }
}
function onMouseUp() {
    mouseIsDown = false
    
    const poly1 = [];
    const poly2 = [];
    
    let checkPoint = false
    let intersectionCount = 0
    //Check the intersection points and add line segment points to the appropriate polygon array
    for(let i = 0; i < points.length; i++){
        let l2Points = i == points.length-1 ? [points[i],points[0]] : [points[i], points[i+1]]
        let t = getT(l1Points,l2Points)
        let u = getU(l1Points,l2Points)

        if(0 <= t && t <= 1 && 0 <= u && u <= 1){
            intersectionCount++
            checkPoint = !checkPoint
            
            poly2.push(getIntersectionPoint(l1Points, t))

            if(intersectionCount == 1){
                poly1.push(points[i])
                poly2.push(points[i+1])
            }
            poly1.push(getIntersectionPoint(l1Points, t))
        }else{
            checkPoint ? poly2.push(points[i+1]) : poly1.push(points[i])
        }
    }
    //Generate the two sets of points for the split polygons
    if(intersectionCount == 2){
        clearPoly();
        addPoly(poly1, 'blue');
        addPoly(poly2, 'green');
    }
}
//Algorithms needed to find the intersection point
function getT(l1,l2){
    return ((l1[0].x - l2[0].x) * (l2[0].y - l2[1].y) - (l1[0].y - l2[0].y)*(l2[0].x - l2[1].x)) /
            ((l1[0].x - l1[1].x) * (l2[0].y - l2[1].y) - (l1[0].y - l1[1].y)*(l2[0].x - l2[1].x))
}
function getU(l1,l2){
    return -(((l1[0].x - l1[1].x) * (l1[0].y - l2[0].y) - (l1[0].y - l1[1].y) * (l1[0].x - l2[0].x)) /
            ((l1[0].x - l1[1].x) * (l2[0].y - l2[1].y) - (l1[0].y - l1[1].y) * (l2[0].x - l2[1].x)))
}
function getIntersectionPoint(l1,t){
    return {x: l1[0].x + t*(l1[1].x - l1[0].x),
            y: l1[0].y + t*(l1[1].y - l1[0].y)}
}

//Draws a polygon from the given points and sets a stroke with the specified color
function addPoly(points, color = 'black') {
    if(points.length < 2) {
        console.error("Not enough points");
        return;
    }
    
    const content = document.getElementById('content');
    
    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var svgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    let path = 'M' + points[0].x + ' ' + points[0].y
    
    for(const point of points) {
        path += ' L' + point.x + ' ' + point.y;
    }
    path += " Z";
    svgPath.setAttribute('d', path);
    svgPath.setAttribute('stroke', color);
    
    svgElement.setAttribute('height', "500"); 
    svgElement.setAttribute('width', "500");
    svgElement.setAttribute('style', 'position: absolute;');
    svgElement.setAttribute('fill', 'transparent');
    
    svgElement.appendChild(svgPath);
    content.appendChild(svgElement);
}

//Clears the all the drawn polygons
function clearPoly() {
    const content = document.getElementById('content');
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
}

//Sets the mouse events needed for the exercise
function setup() {
    this.clearPoly();
    this.addPoly(points);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
}

const points = [
    { x : 100, y: 100 },
    { x : 200, y: 50 },
    { x : 300, y: 50 },
    { x : 400, y: 200 },
    { x : 350, y: 250 },
    { x : 200, y: 300 },
    { x : 150, y: 300 },
]

window.onload = () => setup()