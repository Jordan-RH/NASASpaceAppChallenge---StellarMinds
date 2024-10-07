const canvas = document.getElementById('orrery');
const context = canvas.getContext('2d');
const apiKey = 'placeholderkey'

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let zoomLevel = 1;
let zoomFactor = 0.1;
const zoomMax = 0.35;
const zoomMin = 5;

const sun = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 90,
    image: "assets/sun.png",
    name: "Sun",
    mass: 1.989e30, // kg
    diameter: 1391000, // km
    rotationPeriod: 25, // Earth days
    orbitalPeriod: 1, // Earth years
    distanceFromSun: 0 // AU
};

const moons = [{
    name: "Moon",
    radius: 2.25, 
    distance: 30,
    speed: 30,
    angle: 0,
    image: "assets/moon.png",
    mass: 7.342e22, 
    diameter: 3475, 
    rotationPeriod: 27.3,
    orbitalPeriod: 27.3, // Earth days (synchronous with rotation)
    distanceFromPlanet: 0.00257 // AU (distance from Earth in AU)
},];


const planets = [
    {
        name: "Mercury",
        radius: 15,
        distance: 100,
        speed: 100,
        angle: 0,
        image: "assets/mercury.png",
        mass: 3.301e23, // kg
        diameter: 4880, // km
        rotationPeriod: 58.6, // Earth days
        orbitalPeriod: 0.241, // Earth years
        distanceFromSun: 0.39, // AU
        eccentricity: 0.2056 // Eccentricity
    },
    {
        name: "Venus",
        radius: 18,
        distance: 175,
        speed: 50,
        angle: 0,
        image: "assets/venus.png",
        mass: 4.867e24, // kg
        diameter: 12104, // km
        rotationPeriod: 243, // Earth days
        orbitalPeriod: 0.615, // Earth years
        distanceFromSun: 0.72, // AU
        eccentricity: 0.0067 // Eccentricity
    },
    {
        name: "Earth",
        radius: 20,
        distance: 250,
        speed: 20,
        angle: 0,
        image: "assets/earth.png",
        mass: 5.972e24, // kg
        diameter: 12742, // km
        rotationPeriod: 1, // Earth days
        orbitalPeriod: 1, // Earth years
        distanceFromSun: 1, // AU
        eccentricity: 0.0167 // Eccentricity
    },
    {
        name: "Mars",
        radius: 16,
        distance: 325,
        speed: 10,
        angle: 0,
        image: "assets/mars.png",
        mass: 6.417e23, // kg
        diameter: 6779, // km
        rotationPeriod: 1.03, // Earth days
        orbitalPeriod: 1.88, // Earth years
        distanceFromSun: 1.52, // AU
        eccentricity: 0.0934 // Eccentricity

    },
    {
        name: "Jupiter",
        radius: 50,
        distance: 450,
        speed: 2.2,
        angle: 0,
        image: "assets/jupiter.png",
        mass: 1.898e27, // kg
        diameter: 139820, // km
        rotationPeriod: 0.41, // Earth days
        orbitalPeriod: 11.86, // Earth years
        distanceFromSun: 5.20, // AU
        eccentricity: 0.0489 // Eccentricity
    },
    {
        name: "Saturn",
        radius: 40,
        distance: 550,
        speed: 1.2,
        angle: 0,
        image: "assets/saturn.png",
        mass: 5.683e26, // kg
        diameter: 116460, // km
        rotationPeriod: 0.45, // Earth days
        orbitalPeriod: 29.46, // Earth years
        distanceFromSun: 9.58, // AU
        eccentricity: 0.0565 // Eccentricity
    },
    {
        name: "Uranus",
        radius: 35,
        distance: 650,
        speed: 0.5,
        angle: 0,
        image: "assets/uranus.png",
        mass: 8.681e25, // kg
        diameter: 50724, // km
        rotationPeriod: 0.72, // Earth days
        orbitalPeriod: 84.01, // Earth years
        distanceFromSun: 19.22, // AU
        eccentricity: 0.0463 // Eccentricity
    },
    {
        name: "Neptune",
        radius: 30,
        distance: 750,
        speed: 0.3,
        angle: 0,
        image: "assets/neptune.png",
        mass: 1.024e26, // kg
        diameter: 49244, // km
        rotationPeriod: 0.67, // Earth days
        orbitalPeriod: 164.8, // Earth years
        distanceFromSun: 30.05, // AU
        eccentricity: 0.0097 // Eccentricity
    },
    {
        name: "Pluto",
        radius: 5, // km
        distance: 850, // billion km from the Sun (~39.5 AU)
        speed: 0.1, // km/s (orbital speed)
        angle: 0, // Initial angle (depends on your simulation)
        image: "assets/pluto.png", // Image path can be correct if it's used locally
        mass: 1.303e22, // kg
        diameter: 2376.6, // km
        rotationPeriod: 6.39, // Earth days (Pluto's day length)
        orbitalPeriod: 248, // Earth years (Pluto's year)
        distanceFromSun: 39.5, // AU (average distance from the Sun)
        eccentricity: 0.2488 // Eccentricity (Pluto is a dwarf planet)
    },  
];

const asteroids = [
    {
        name: "Asteroid",
        type: "PHA",
        radius: 15,
        distance: 105,
        speed: 100,
        angle: 0,
        image: "assets/sun.png",
        mass: 3.301e23, // kg
        diameter: 4880, // km
        rotationPeriod: 58.6, // Earth days
        orbitalPeriod: 0.241, // Earth years
        distanceFromSun: 0.39, // AU
        eccentricity: 0.2056 // Eccentricity
    },
];

function drawSun() {
    context.beginPath();
    let sunImg = new Image();
    sunImg.src = sun.image;
    context.drawImage(sunImg, sun.x - sun.radius * zoomLevel, sun.y - sun.radius * zoomLevel, sun.radius * 2 * zoomLevel, sun.radius * 2 * zoomLevel);
    context.closePath();
}

function drawMoon(planet, moon) {
    const x = sun.x + planet.distance * zoomLevel * Math.cos(planet.angle); 
    const y = sun.y + planet.distance * zoomLevel * Math.sin(planet.angle);

    const moonX = x + moon.distance * zoomLevel * Math.cos(moon.angle);
    const moonY = y + moon.distance * zoomLevel * Math.sin(moon.angle);

    context.beginPath();
    let moonImg = new Image();
    moonImg.src = moon.image;
    context.drawImage(moonImg, moonX - moon.radius * zoomLevel, moonY - moon.radius * zoomLevel, moon.radius * 2 * zoomLevel, moon.radius * 2 * zoomLevel);
    context.closePath();

    moon.angle -= moon.speed * 1000 / 86400 / 100; 
}


function drawCelestialBody(body) {
    // Calculate the semi-major and semi-minor axes
    const semiMajorAxis = body.distance * zoomLevel;
    const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - Math.pow(body.eccentricity, 2));
    
    // Calculate the angle in radians and the focal point
    const focalPoint = Math.sqrt(Math.pow(semiMajorAxis, 2) - Math.pow(semiMinorAxis, 2));
    
    // Calculate the new position of the planet based on its angle
    const bodyX = sun.x + focalPoint + (semiMajorAxis * Math.cos(body.angle));
    const bodyY = sun.y + (semiMinorAxis * Math.sin(body.angle));
    
    // Draw the planet at the calculated position
    context.beginPath();
    let bodyImg = new Image();
    bodyImg.src = body.image;
    context.drawImage(bodyImg, bodyX - body.radius * zoomLevel, bodyY - body.radius * zoomLevel, body.radius * 2 * zoomLevel, body.radius * 2 * zoomLevel);
    context.closePath();
    
    // Update the angle based on the planet's speed
    body.angle += body.speed * 1000 / 86400 / 100;

}

function drawOrbit(body) {
    const eccentricity = body.eccentricity;
    const semiMajorAxis = body.distance * zoomLevel;
    const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - Math.pow(eccentricity, 2));
    
    // Calculate the focal point (where the sun should be)
    const focalPoint = Math.sqrt(Math.pow(semiMajorAxis, 2) - Math.pow(semiMinorAxis, 2));
    
    context.beginPath();
    // Draw the ellipse with the sun at one of the foci
    context.ellipse(
        sun.x + focalPoint, // x-coordinate of the center of the ellipse
        sun.y,              // y-coordinate of the center of the ellipse
        semiMajorAxis,      // major radius
        semiMinorAxis,      // minor radius
        0,                  // rotation
        0,                  // start angle
        Math.PI * 2         // end angle (full ellipse)
    );
    context.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    context.stroke();
    context.closePath();
}

// Function to check if a click is on a body
function bodyClicked(x, y, bodies) {
    for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        // Calculate the semi-major and semi-minor axes
const semiMajorAxis = body.distance * zoomLevel;
const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - Math.pow(body.eccentricity, 2));

// Calculate the angle in radians and the focal point
const focalPoint = Math.sqrt(Math.pow(semiMajorAxis, 2) - Math.pow(semiMinorAxis, 2));

// Calculate the new position of the body based on its angle
const bodyx = sun.x + focalPoint + (semiMajorAxis * Math.cos(body.angle));
const bodyy = sun.y + (semiMinorAxis * Math.sin(body.angle));
        
        const distance = Math.sqrt((x - bodyx) ** 2 + (y - bodyy) ** 2);
        if (distance <= body.radius * zoomLevel) {
            return body;
        }
    }
    return null;
}

// Function to check if a click is on a body
function moonClicked(x, y) {
    for (let i = 0; i < planets.length; i++) {
        const planet = planets[i];
    for (let i = 0; i < moons.length; i++) {
        const moon = moons[i];


    // Calculate the new position of the body based on its angle
    const x2 = sun.x + planet.distance * zoomLevel * Math.cos(planet.angle); 
    const y2 = sun.y + planet.distance * zoomLevel * Math.sin(planet.angle);

    const moonx = x2 + moon.distance * zoomLevel * Math.cos(moon.angle);
    const moony = y2 + moon.distance * zoomLevel * Math.sin(moon.angle);
        
        const distance = Math.sqrt((x - moonx) ** 2 + (y - moony) ** 2);
        if (distance <= moon.radius * zoomLevel) {
            return moon;
        }
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
    const clickedPlanet = bodyClicked(mouseX, mouseY, planets);
    const clickedMoon = moonClicked(mouseX, mouseY, moons);
    const clickedAsteroid = bodyClicked(mouseX, mouseY, asteroids);
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
    } else if (clickedSun) {
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
    else if (clickedAsteroid) {
        document.getElementById("infoBox").style.display = "flex";
        document.getElementById("infoBox").innerHTML = `
        <strong id="title">${clickedAsteroid.name}</strong><br>
        Type: ${clickedAsteroid.type}
        <img src="${clickedAsteroid.image}">
        <br><br>
        Mass: ${clickedAsteroid.mass.toExponential(2)} kg<br>
        Diameter: ${clickedAsteroid.diameter.toLocaleString()} km<br>
        Rotation Period: ${clickedAsteroid.rotationPeriod} days<br>
        Orbital Period: ${clickedAsteroid.orbitalPeriod} years<br>
        Distance from Sun: ${clickedAsteroid.distanceFromSun} AU
    `;
    }
    else if (clickedMoon) {
        document.getElementById("infoBox").style.display = "flex";
        document.getElementById("infoBox").innerHTML = `
        <strong id="title">${clickedMoon.name}</strong><br>
        <img src="${clickedMoon.image}">
        <br><br>
        Mass: ${clickedMoon.mass.toExponential(2)} kg<br>
        Diameter: ${clickedMoon.diameter.toLocaleString()} km<br>
        Rotation Period: ${clickedMoon.rotationPeriod} days<br>
        Orbital Period: ${clickedMoon.orbitalPeriod} years<br>
        Distance from Planet: ${clickedMoon.distanceFromPlanet} AU
    `;
    }
    else {
        document.getElementById("infoBox").style.display = "none";
    }
});

// Prevent scroll on the orrery when hovering over the info box
document.getElementById('infoBox').addEventListener('wheel', (event) => {
    event.stopPropagation();
});

// Prevent scroll on the chatbot when hovering over it
document.getElementById('chatbot').addEventListener('wheel', (event) => {
    event.stopPropagation();
});

// Event listener for zooming
window.addEventListener('wheel', (event) => {
    if (event.deltaY < 0) {
        zoomLevel = Math.min(zoomMin, zoomLevel + zoomFactor);
    } else {
        zoomLevel = Math.max(zoomMax, zoomLevel - zoomFactor);
    }
});

// Chatbot function
async function chatWithGPT(userInput) {
    const systemMessage = "You are a knowledgeable assistant that only discusses topics related to the solar system.";

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: userInput }
            ]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        return `Error: ${errorText}`;
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

document.getElementById('sendMessage').addEventListener('click', async () => {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() === '') return;

    const chatOutput = document.getElementById('chatOutput');
    chatOutput.innerHTML += `<div>You: ${userInput}</div>`;
    
    const response = await chatWithGPT(userInput);
    chatOutput.innerHTML += `<div>StellarBot: ${response}</div>`;

    document.getElementById('userInput').value = '';
    chatOutput.scrollTop = chatOutput.scrollHeight;
});

const chatOutput = document.getElementById('chatOutput');
chatOutput.innerHTML += '<div>StellarBot: Hello! I am StellarBot, your personal space exploration assistant. Ask me any questions you have about the Solar System.</div>';
chatOutput.scrollTop = chatOutput.scrollHeight;

let showSun = true;
let showPlanets = true;
let showMoons = true;
let showAsteroids = true;

document.getElementById('showSun').addEventListener('change', (event) => {
    showSun = event.target.checked;
});

document.getElementById('showPlanets').addEventListener('change', (event) => {
    showPlanets = event.target.checked;
});

document.getElementById('showMoons').addEventListener('change', (event) => {
    showMoons = event.target.checked;
});

document.getElementById('showAsteroids').addEventListener('change', (event) => {
    showAsteroids = event.target.checked;
});

function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (showSun) {
        drawSun();
    }

    if (showPlanets) {
        planets.forEach(planet => {
            drawOrbit(planet);
            drawCelestialBody(planet);
            if (planet.name === "Earth" && showMoons) {
                drawMoon(planet, moons[0]);
            }
        });
    }
    else {
        planets.forEach(planet => {
            planet.angle += planet.speed * 1000 / 86400 / 100;
        });
    }

    if (showAsteroids) {
        // Draw asteroids / NEOs / PHAs / NECs if implemented
        asteroids.forEach(asteroids => {
            drawOrbit(asteroids);
            drawCelestialBody(asteroids);
        });
    }
    else {
        asteroids.forEach(asteroid => {
            asteroid.angle += asteroid.speed * 1000 / 86400 / 100;
        });
    }

    requestAnimationFrame(animate);
}

// Get references to the logo button and chatbot
const logoButton = document.getElementById('logoButton');
const chatbot = document.getElementById('chatbot');

// Initially, the chatbot is shown. Add a flag to track visibility.
let isChatbotVisible = false;

// Add an event listener to the logo button to toggle visibility
logoButton.addEventListener('click', () => {
    if (isChatbotVisible) {
        chatbot.style.display = 'none';  // Hide the chatbot
    } else {
        chatbot.style.display = 'block';  // Show the chatbot
    }
    isChatbotVisible = !isChatbotVisible;  // Toggle the flag
});



// Start animation
animate();
