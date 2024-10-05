const zoomIntensity = 0.2;

const canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const width = 600;
const height = 200;

let scale = 1;
let originx = 0;
let originy = 0;
let visibleWidth = width;
let visibleHeight = height;

function draw(){
    const img = new Image();
    img.src = 'https://www.transparenttextures.com/patterns/stardust.png';

    img.onload = function() {
        context.drawImage(img, 10, 10);
        context.fillRect(0, 0, width, height);
    }

    /* background: transparent  repeat;
    animation: moveStars 50s linear infinite; */
    // Clear screen to white.
    context.fillStyle = "blue";
    context.fillRect(originx, originy, width/scale, height/scale);
    // Draw the black square.
    context.fillStyle = "black";
    context.fillRect(50, 50, 100, 100);

    // Schedule the redraw for the next display refresh.
    window.requestAnimationFrame(draw);
}
// Begin the animation loop.
draw();

canvas.onwheel = function (event){
    event.preventDefault();
    // Get mouse offset.
    const mousex = event.clientX - canvas.offsetLeft;
    const mousey = event.clientY - canvas.offsetTop;
    // Normalize mouse wheel movement to +1 or -1 to avoid unusual jumps.
    const wheel = event.deltaY < 0 ? 1 : -1;

    // Compute zoom factor.
    const zoom = Math.exp(wheel * zoomIntensity);
    
    // Translate so the visible origin is at the context's origin.
    context.translate(originx, originy);
  
    // Compute the new visible origin. Originally the mouse is at a
    // distance mouse/scale from the corner, we want the point under
    // the mouse to remain in the same place after the zoom, but this
    // is at mouse/new_scale away from the corner. Therefore we need to
    // shift the origin (coordinates of the corner) to account for this.
    originx -= mousex/(scale*zoom) - mousex/scale;
    originy -= mousey/(scale*zoom) - mousey/scale;
    
    // Scale it (centered around the origin due to the translate above).
    context.scale(zoom, zoom);
    // Offset the visible origin to it's proper position.
    context.translate(-originx, -originy);

    // Update scale and others.
    scale *= zoom;
    visibleWidth = width / scale;
    visibleHeight = height / scale;
}