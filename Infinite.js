const canvas = document.getElementById('orrery');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let zoomLevel = 1; // Start with a default zoom level of 1
let zoomFactor = 0.1; // How much zooming in/out each step
const zoomMax = 0.35;

const sun = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 50,
    image: "assets/sun.png",
    name: "Sun",
    mass: 1.989e30, // kg
    diameter: 1391000, // km
    rotationPeriod: 25, // Earth days
    orbitalPeriod: 1, // Earth years
    distanceFromSun: 0 // AU
};

const planets = [
    {
        name: "Mercury",
        radius: 20,
        distance: 100,
        speed: 47.87,
        angle: 0,
        image: "assets/mercury.png",
        mass: 3.301e23, // kg
        diameter: 4880, // km
        rotationPeriod: 58.6, // Earth days
        orbitalPeriod: 0.241, // Earth years
        distanceFromSun: 0.39 // AU
    },
    {
        name: "Venus",
        radius: 20,
        distance: 150,
        speed: 35.02,
        angle: 0,
        image: "assets/venus.png",
        mass: 4.867e24, // kg
        diameter: 12104, // km
        rotationPeriod: 243, // Earth days
        orbitalPeriod: 0.615, // Earth years
        distanceFromSun: 0.72 // AU
    },
    {
        name: "Earth",
        radius: 20,
        distance: 200,
        speed: 29.78,
        angle: 0,
        image: "assets/earth.png",
        mass: 5.972e24, // kg
        diameter: 12742, // km
        rotationPeriod: 1, // Earth days
        orbitalPeriod: 1, // Earth years
        distanceFromSun: 1 // AU
    },
    {
        name: "Mars",
        radius: 20,
        distance: 300,
        speed: 24.07,
        angle: 0,
        image: "assets/mars.png",
        mass: 6.417e23, // kg
        diameter: 6779, // km
        rotationPeriod: 1.03, // Earth days
        orbitalPeriod: 1.88, // Earth years
        distanceFromSun: 1.52 // AU
    },
    {
        name: "Jupiter",
        radius: 20,
        distance: 400,
        speed: 13.07,
        angle: 0,
        image: "assets/jupiter.png",
        mass: 1.898e27, // kg
        diameter: 139820, // km
        rotationPeriod: 0.41, // Earth days
        orbitalPeriod: 11.86, // Earth years
        distanceFromSun: 5.20 // AU
    },
    {
        name: "Saturn",
        radius: 20,
        distance: 500,
        speed: 9.69,
        angle: 0,
        image: "assets/saturn.png",
        mass: 5.683e26, // kg
        diameter: 116460, // km
        rotationPeriod: 0.45, // Earth days
        orbitalPeriod: 29.46, // Earth years
        distanceFromSun: 9.58 // AU
    },
    {
        name: "Uranus",
        radius: 20,
        distance: 600,
        speed: 6.81,
        angle: 0,
        image: "assets/uranus.png",
        mass: 8.681e25, // kg
        diameter: 50724, // km
        rotationPeriod: 0.72, // Earth days
        orbitalPeriod: 84.01, // Earth years
        distanceFromSun: 19.22 // AU
    },
    {
        name: "Neptune",
        radius: 20,
        distance: 700,
        speed: 5.43,
        angle: 0,
        image: "assets/neptune.png",
        mass: 1.024e26, // kg
        diameter: 49244, // km
        rotationPeriod: 0.67, // Earth days
        orbitalPeriod: 164.8, // Earth years
        distanceFromSun: 30.05 // AU
    }
];

function drawSun() {
    context.beginPath();
    let sunImg = new Image();
    sunImg.src = sun.image;
    context.drawImage(sunImg, sun.x - sun.radius * zoomLevel, sun.y - sun.radius * zoomLevel, sun.radius * 2 * zoomLevel, sun.radius * 2 * zoomLevel);
    context.closePath();
}

function drawPlanet(planet) {
    const x = sun.x + planet.distance * zoomLevel * Math.cos(planet.angle);
    const y = sun.y + planet.distance * zoomLevel * Math.sin(planet.angle);

    context.beginPath();

    let planetImg = new Image();
    planetImg.src = planet.image;
    context.drawImage(planetImg, x - planet.radius * zoomLevel, y - planet.radius * zoomLevel, planet.radius * 2 * zoomLevel, planet.radius * 2 * zoomLevel);
    context.closePath();

    // Update the angle for the next frame
    planet.angle += planet.speed * 1000 / 86400 / 100; // Scale the speed for animation
}

function drawOrbit(distance) {
    context.beginPath();
    context.arc(sun.x, sun.y, distance * zoomLevel, 0, Math.PI * 2);
    context.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    context.stroke();
    context.closePath();
}

function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawSun();
    planets.forEach(planet => {
        drawOrbit(planet.distance);
        drawPlanet(planet);
    });

    requestAnimationFrame(animate);
}

// Function to check if a click is on a planet
    function planetClicked(x, y) {
        for (let i = 0; i < planets.length; i++) {
            const planet = planets[i];
            const planetx = sun.x + planet.distance * zoomLevel * Math.cos(planet.angle);
            const planety = sun.y + planet.distance * zoomLevel * Math.sin(planet.angle);
            
            const distance = Math.sqrt((x - planetx) ** 2 + (y - planety) ** 2);
            if (distance <= planet.radius * zoomLevel) {
                return planet;
            }
        }
        return null;
    }

    function sunClicked(x, y) {
        const sunx = sun.x;
        const suny = sun.y;
        
        const distance = Math.sqrt((x - sunx) ** 2 + (y - suny) ** 2);
        if (distance <= sun.radius * zoomLevel) {
            return sun;
        }
    }

    // Handle mouse click event
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const clickedSun = sunClicked(mouseX, mouseY);
    const clickedPlanet = planetClicked(mouseX, mouseY);
    if (clickedPlanet) {
        document.getElementById("infoBox").style.display = "flex";
        document.getElementById("infoBox").innerHTML = `
        <strong id="title">${clickedPlanet.name}</strong><br>
        <img src="${clickedPlanet.image}">
        <br><br>
        Mass: ${clickedPlanet.mass.toExponential(2)} kg<br>
        Diameter: ${clickedPlanet.diameter.toLocaleString()} km<br>
        Rotation Period: ${clickedPlanet.rotationPeriod} days<br>
        Orbital Period: ${clickedPlanet.orbitalPeriod} years<br>
        Distance from Sun: ${clickedPlanet.distanceFromSun} AU
    `;
    }
    else if (clickedSun) {
        document.getElementById("infoBox").style.display = "flex";
        document.getElementById("infoBox").innerHTML = `
        <strong id="title">${clickedSun.name}</strong><br>
        <img src="${clickedSun.image}">
        <br><br>
        Mass: ${clickedSun.mass.toExponential(2)} kg<br>
        Diameter: ${clickedSun.diameter.toLocaleString()} km<br>
        Rotation Period: ${clickedSun.rotationPeriod} days<br>
        Orbital Period: ${clickedSun.orbitalPeriod} years<br>
        Distance from Sun: ${clickedSun.distanceFromSun} AU
    `;
    }
    else {
        document.getElementById("infoBox").style.display = "none";

    }
});

// Event listener for zooming
window.addEventListener('wheel', (event) => {
    if (event.deltaY < 0) {
        // Zoom in
        zoomLevel += zoomFactor;
    } else {
        // Zoom out, but don't allow zoom level to go below a minimum threshold
        zoomLevel = Math.max(zoomMax, zoomLevel - zoomFactor);
    }

    // Update the background size based on the zoom level
    document.body.style.backgroundSize = `${100 * zoomLevel}% ${100 * zoomLevel}%`;
});


animate();



