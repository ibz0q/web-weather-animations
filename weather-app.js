class WeatherApp {
  constructor() {
    this.canvas = document.getElementById('weather-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.weatherTypes = [
      { name: 'Clear', key: 'clear' },
      { name: 'Clear (Night)', key: 'clear-night' },
      { name: 'Partly Cloudy', key: 'partlycloudy' },
      { name: 'Partly Cloudy (Night)', key: 'partlycloudy-night' },
      { name: 'Cloudy', key: 'cloudy' },
      { name: 'Windy', key: 'windy' },
      { name: 'Haze', key: 'haze' },
      { name: 'Fog', key: 'fog' },
      { name: 'Drizzle', key: 'drizzle' },
      { name: 'Rain', key: 'rain' },
      { name: 'Heavy Rain', key: 'heavy-rain' },
      { name: 'Freezing Rain', key: 'freezing-rain' },
      { name: 'Thunderstorm', key: 'thunderstorm' },
      { name: 'Snow', key: 'snow' },
      { name: 'Heavy Snow', key: 'heavy-snow' },
      { name: 'Sunrise', key: 'sunrise' },
      { name: 'Sunset', key: 'sunset' },
    ];
    this.currentWeatherIdx = 0; // Start with Clear
    this.time = 0;
    this.transitionProgress = 1; // 0 = transitioning, 1 = complete
    this.transitionSpeed = 0.05;
    this.isTransitioning = false;
    this.showMoon = true; // Moon visibility toggle
    this.moonPhase = 0.5; // 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter
    this.moonPosition = 0; // Position across the sky (0 to 1)
    this.moonSpeed = 0.0001; // Very slow movement speed
    this.sunPosition = 0.3; // Sun position across the sky (0 to 1)
    this.sunSpeed = 0.00008; // Very slow sun movement speed
    this.sunRayRotation = 0; // Sun ray rotation angle
    
    this.initializeElements();
    this.setupEventListeners();
    this.updateMoonToggleButton();
    this.updateMoonPhaseLabel();
    this.updateSunPositionLabel();
    this.resizeCanvas();
    this.initializeWeather();
    this.animate();
  }

  initializeElements() {
    this.weatherLabel = document.getElementById('weather-label');
    this.prevBtn = document.getElementById('prev-weather');
    this.nextBtn = document.getElementById('next-weather');
    this.moonToggle = document.getElementById('moon-toggle');
    this.moonPhasePrev = document.getElementById('moon-phase-prev');
    this.moonPhaseNext = document.getElementById('moon-phase-next');
    this.moonPhaseLabel = document.getElementById('moon-phase-label');
    this.sunPositionPrev = document.getElementById('sun-position-prev');
    this.sunPositionNext = document.getElementById('sun-position-next');
    this.sunPositionLabel = document.getElementById('sun-position-label');
  }

  setupEventListeners() {
    this.prevBtn.addEventListener('click', () => this.cycleWeather(-1));
    this.nextBtn.addEventListener('click', () => this.cycleWeather(1));
    this.moonToggle.addEventListener('click', () => this.toggleMoon());
    this.moonPhasePrev.addEventListener('click', () => this.cycleMoonPhase(-1));
    this.moonPhaseNext.addEventListener('click', () => this.cycleMoonPhase(1));
    this.sunPositionPrev.addEventListener('click', () => this.adjustSunPosition(-0.1));
    this.sunPositionNext.addEventListener('click', () => this.adjustSunPosition(0.1));
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initializeWeather();
  }

  cycleWeather(direction) {
    if (this.isTransitioning) return; // Prevent cycling during transition
    
    this.isTransitioning = true;
    this.transitionProgress = 0;
    
    this.currentWeatherIdx = (this.currentWeatherIdx + direction + this.weatherTypes.length) % this.weatherTypes.length;
    this.weatherLabel.textContent = this.weatherTypes[this.currentWeatherIdx].name;
    this.initializeWeather();
  }

  initializeWeather() {
    const weather = this.weatherTypes[this.currentWeatherIdx].key;
    
    // Initialize weather-specific systems
    if (weather === 'clear' || weather === 'clear-night') {
      this.initializeClear();
    } else if (weather === 'partlycloudy' || weather === 'partlycloudy-night') {
      this.initializePartlyCloudy();
    } else if (weather === 'cloudy') {
      this.initializeCloudy();
    } else if (weather === 'windy') {
      this.initializeWindy();
    } else if (weather === 'haze') {
      this.initializeHaze();
    } else if (weather === 'fog') {
      this.initializeFog();
    } else if (weather === 'drizzle') {
      this.initializeDrizzle();
    } else if (weather === 'rain') {
      this.initializeRain();
    } else if (weather === 'heavy-rain') {
      this.initializeHeavyRain();
    } else if (weather === 'freezing-rain') {
      this.initializeFreezingRain();
    } else if (weather === 'thunderstorm') {
      this.initializeThunderstorm();
    } else if (weather === 'snow') {
      this.initializeSnow();
    } else if (weather === 'heavy-snow') {
      this.initializeHeavySnow();
    } else if (weather === 'sunrise' || weather === 'sunset') {
      this.initializeSunriseSunset();
    }
  }

  // Clear weather initialization
  initializeClear() {
    this.sunAngle = 0;
    this.clouds = [];
  }

  // Partly cloudy initialization
  initializePartlyCloudy() {
    this.sunAngle = 0;
    this.createLightClouds();
  }

  // Cloudy weather initialization
  initializeCloudy() {
    this.createClouds('cloudy');
  }

  // Windy weather initialization
  initializeWindy() {
    this.createClouds('windy');
    this.windLines = [];
    for (let i = 0; i < 30; i++) {
      this.windLines.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        length: 20 + Math.random() * 40,
        speed: 8 + Math.random() * 12,
        opacity: 0.3 + Math.random() * 0.4
      });
    }
  }

  // Haze initialization
  initializeHaze() {
    this.hazeParticles = [];
    for (let i = 0; i < 100; i++) {
      this.hazeParticles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: 30 + Math.random() * 60,
        speed: 0.1 + Math.random() * 0.2,
        alpha: 0.05 + Math.random() * 0.1,
        drift: Math.random() * 0.1 - 0.05
      });
    }
  }

  // Fog weather initialization
  initializeFog() {
    this.fogParticles = [];
    for (let i = 0; i < 60; i++) {
      this.fogParticles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: 60 + Math.random() * 120,
        speed: 0.3 + Math.random() * 0.4,
        alpha: 0.15 + Math.random() * 0.2,
        drift: Math.random() * 0.2 - 0.1
      });
    }
  }

  // Drizzle initialization
  initializeDrizzle() {
    this.createClouds('drizzle');
    this.drizzleDrops = [];
    this.drizzleSplashes = [];
    for (let i = 0; i < 80; i++) {
      this.drizzleDrops.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        speed: 4 + Math.random() * 3,
        length: 8 + Math.random() * 6,
        opacity: 0.4 + Math.random() * 0.3
      });
    }
  }

  // Rain weather initialization
  initializeRain() {
    this.createClouds('rain');
    this.raindrops = [];
    this.rainSplashes = [];
    for (let i = 0; i < 200; i++) {
      this.raindrops.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        speed: 12 + Math.random() * 8,
        length: 20 + Math.random() * 15,
        opacity: 0.6 + Math.random() * 0.4
      });
    }
  }

  // Heavy rain initialization
  initializeHeavyRain() {
    this.createClouds('heavy-rain');
    this.raindrops = [];
    this.rainSplashes = [];
    for (let i = 0; i < 350; i++) {
      this.raindrops.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        speed: 18 + Math.random() * 12,
        length: 25 + Math.random() * 20,
        opacity: 0.7 + Math.random() * 0.3
      });
    }
  }

  // Freezing rain initialization
  initializeFreezingRain() {
    this.createClouds('freezing-rain');
    this.freezingDrops = [];
    this.freezingSplashes = [];
    for (let i = 0; i < 150; i++) {
      this.freezingDrops.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        speed: 10 + Math.random() * 6,
        length: 15 + Math.random() * 10,
        opacity: 0.6 + Math.random() * 0.3,
        isIce: Math.random() > 0.7
      });
    }
  }

  // Thunderstorm weather initialization
  initializeThunderstorm() {
    this.createClouds('thunderstorm');
    this.lightningBolts = [];
    this.nextLightning = performance.now() + 2000;
    // Add rain to thunderstorm
    this.raindrops = [];
    this.rainSplashes = [];
    for (let i = 0; i < 250; i++) {
      this.raindrops.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        speed: 15 + Math.random() * 10,
        length: 22 + Math.random() * 18,
        opacity: 0.7 + Math.random() * 0.3
      });
    }
  }

  // Snow weather initialization
  initializeSnow() {
    this.snowflakes = [];
    for (let i = 0; i < 80; i++) {
      this.snowflakes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: 2 + Math.random() * 4,
        speed: 0.5 + Math.random() * 1.5, // Much slower
        drift: Math.random() * 0.3 - 0.15, // Gentler drift
        opacity: 0.6 + Math.random() * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01, // Very slow rotation
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.02
      });
    }
  }

  // Heavy snow initialization
  initializeHeavySnow() {
    this.snowflakes = [];
    for (let i = 0; i < 150; i++) {
      this.snowflakes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: 3 + Math.random() * 6,
        speed: 1 + Math.random() * 2.5, // Slower than before
        drift: Math.random() * 0.5 - 0.25,
        opacity: 0.7 + Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.015 + Math.random() * 0.025
      });
    }
  }

  // Sunrise/Sunset initialization
  initializeSunriseSunset() {
    this.sunAngle = 0;
    this.clouds = [];
    this.createLightClouds();
  }

  // Initialize stars for night scenes
  initializeStars() {
    this.stars = [];
    for (let i = 0; i < 80; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height * 0.7, // Keep stars in upper portion
        size: 0.5 + Math.random() * 2,
        brightness: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.01 + Math.random() * 0.02,
        driftX: (Math.random() - 0.5) * 0.02, // Very slow horizontal drift
        driftY: (Math.random() - 0.5) * 0.01, // Very slow vertical drift
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  }

  createLightClouds() {
    this.clouds = [];
    for (let i = 0; i < 8; i++) {
      this.clouds.push({
        x: Math.random() * this.canvas.width,
        y: this.canvas.height * (0.2 + Math.random() * 0.3),
        radius: 80 + Math.random() * 60,
        speed: 0.3 + Math.random() * 0.2,
        opacity: 0.6 + Math.random() * 0.3
      });
    }
  }

  createClouds(type) {
    this.clouds = [];
    const cloudCount = type === 'thunderstorm' ? 12 : 15;
    const layers = 3;
    
    for (let layer = 0; layer < layers; layer++) {
      for (let i = 0; i < cloudCount / layers; i++) {
        this.clouds.push({
          x: Math.random() * this.canvas.width,
          y: this.canvas.height * (0.1 + 0.25 * layer) + Math.random() * 60,
          radius: 120 + Math.random() * 100 + layer * 40,
          speed: (0.5 - layer * 0.15) + Math.random() * 0.3,
          layer: layer,
          opacity: type === 'thunderstorm' ? 0.8 + Math.random() * 0.2 : 0.7 + Math.random() * 0.3,
          type: type
        });
      }
    }
  }

  // Rain splash creation
  createRainSplash(x, y, intensity = 1) {
    const splashCount = Math.floor(3 + Math.random() * 4) * intensity;
    for (let i = 0; i < splashCount; i++) {
      this.rainSplashes.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y,
        vx: (Math.random() - 0.5) * 6 * intensity,
        vy: -Math.random() * 4 * intensity - 2,
        life: 1.0,
        decay: 0.05 + Math.random() * 0.03,
        size: 1 + Math.random() * 2
      });
    }
  }

  createDrizzleSplash(x, y) {
    const splashCount = Math.floor(1 + Math.random() * 2);
    for (let i = 0; i < splashCount; i++) {
      this.drizzleSplashes.push({
        x: x + (Math.random() - 0.5) * 5,
        y: y,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2 - 1,
        life: 1.0,
        decay: 0.08 + Math.random() * 0.04,
        size: 0.5 + Math.random() * 1
      });
    }
  }

  createFreezingSplash(x, y, isIce) {
    if (isIce) {
      // Ice pellets create smaller, sharper splashes
      const splashCount = Math.floor(2 + Math.random() * 3);
      for (let i = 0; i < splashCount; i++) {
        this.freezingSplashes.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y,
          vx: (Math.random() - 0.5) * 5,
          vy: -Math.random() * 3 - 1,
          life: 1.0,
          decay: 0.06 + Math.random() * 0.03,
          size: 0.8 + Math.random() * 1.2,
          isIce: true
        });
      }
    } else {
      // Regular freezing rain splashes
      this.createRainSplash(x, y, 0.8);
    }
  }

  animate() {
    this.time += 0.016; // ~60fps
    
    // Handle transitions
    if (this.isTransitioning) {
      this.transitionProgress += this.transitionSpeed;
      if (this.transitionProgress >= 1) {
        this.transitionProgress = 1;
        this.isTransitioning = false;
      }
    }
    
    const weather = this.weatherTypes[this.currentWeatherIdx].key;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Apply transition fade
    this.ctx.save();
    this.ctx.globalAlpha = this.transitionProgress;
    
    // Render based on weather type
    switch(weather) {
      case 'clear':
        this.renderClear();
        break;
      case 'clear-night':
        this.renderClearNight();
        break;
      case 'partlycloudy':
        this.renderPartlyCloudy();
        break;
      case 'partlycloudy-night':
        this.renderPartlyCloudyNight();
        break;
      case 'cloudy':
        this.renderCloudy();
        break;
      case 'windy':
        this.renderWindy();
        break;
      case 'haze':
        this.renderHaze();
        break;
      case 'fog':
        this.renderFog();
        break;
      case 'drizzle':
        this.renderDrizzle();
        break;
      case 'rain':
        this.renderRain();
        break;
      case 'heavy-rain':
        this.renderHeavyRain();
        break;
      case 'freezing-rain':
        this.renderFreezingRain();
        break;
      case 'thunderstorm':
        this.renderThunderstorm();
        break;
      case 'snow':
        this.renderSnow();
        break;
      case 'heavy-snow':
        this.renderHeavySnow();
        break;
      case 'sunrise':
        this.renderSunrise();
        break;
      case 'sunset':
        this.renderSunset();
        break;
    }
    
    this.ctx.restore();
    
    requestAnimationFrame(() => this.animate());
  }

  drawGradient(colors) {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderClear() {
    this.drawGradient(['#87CEEB', '#E0F6FF', '#F0F8FF']);
    this.drawSun(this.canvas.width * 0.75, this.canvas.height * 0.25, 70);
  }

  renderClearNight() {
    this.drawGradient(['#191970', '#2F2F4F', '#483D8B']);
    this.drawMoon(this.canvas.width * 0.75, this.canvas.height * 0.25, 50);
    this.drawStars();
  }

  renderPartlyCloudy() {
    this.drawGradient(['#87CEEB', '#E0F6FF', '#F0F8FF']);
    this.drawSun(this.canvas.width * 0.7, this.canvas.height * 0.2, 60);
    this.updateAndDrawLightClouds();
  }

  renderPartlyCloudyNight() {
    this.drawGradient(['#191970', '#2F2F4F', '#483D8B']);
    this.drawMoon(this.canvas.width * 0.7, this.canvas.height * 0.2, 45);
    this.drawStars();
    this.updateAndDrawLightClouds();
  }

  renderCloudy() {
    this.drawGradient(['#708090', '#A9A9A9', '#C0C0C0']);
    this.updateAndDrawClouds();
  }

  renderWindy() {
    this.drawGradient(['#87CEEB', '#B0C4DE', '#D3D3D3']);
    this.updateAndDrawClouds();
    this.updateAndDrawWind();
  }

  renderHaze() {
    this.drawGradient(['#F5DEB3', '#DDD8C7', '#E5E5DC']);
    this.updateAndDrawHaze();
  }

  renderFog() {
    this.drawGradient(['#D3D3D3', '#E5E5E5', '#F5F5F5']);
    this.updateAndDrawFog();
  }

  renderDrizzle() {
    this.drawGradient(['#778899', '#A9A9A9', '#C0C0C0']);
    this.updateAndDrawClouds();
    this.updateAndDrawDrizzle();
  }

  renderRain() {
    this.drawGradient(['#4682B4', '#6495ED', '#87CEEB']);
    this.updateAndDrawClouds();
    this.updateAndDrawRain();
  }

  renderHeavyRain() {
    this.drawGradient(['#2F4F4F', '#4682B4', '#5F9EA0']);
    this.updateAndDrawClouds();
    this.updateAndDrawRain();
  }

  renderFreezingRain() {
    this.drawGradient(['#4682B4', '#B0C4DE', '#E6E6FA']);
    this.updateAndDrawClouds();
    this.updateAndDrawFreezingRain();
  }

  renderThunderstorm() {
    this.drawGradient(['#2C3E50', '#34495E', '#5D6D7E']);
    this.updateAndDrawClouds();
    this.updateAndDrawRain();
    this.updateAndDrawLightning();
  }

  renderSnow() {
    this.drawGradient(['#2F4F4F', '#708090', '#A9A9A9']);
    this.updateAndDrawSnow();
  }

  renderHeavySnow() {
    this.drawGradient(['#1C1C1C', '#2F4F4F', '#696969']);
    this.updateAndDrawSnow();
  }

  renderSunrise() {
    this.drawGradient(['#1e3c72', '#2a5298', '#ff7b7b', '#ffd89b', '#87CEEB']);
    this.drawSun(this.canvas.width * 0.8, this.canvas.height * 0.7, 80);
    this.updateAndDrawLightClouds();
  }

  renderSunset() {
    this.drawGradient(['#0f2027', '#203a43', '#2c5364', '#ff6b6b', '#feca57', '#48cae4']);
    this.drawSun(this.canvas.width * 0.2, this.canvas.height * 0.7, 80);
    this.updateAndDrawLightClouds();
  }

  drawSun(x, y, radius) {
    // Update sun position slowly across the sky
    this.sunPosition += this.sunSpeed;
    if (this.sunPosition > 1) this.sunPosition = 0;
    
    // Update sun ray rotation slowly
    this.sunRayRotation += 0.002; // Very slow rotation
    
    // Calculate sun position based on movement
    const sunX = this.canvas.width * (0.1 + this.sunPosition * 0.8);
    const sunY = y + Math.sin(this.sunPosition * Math.PI) * -80; // Arc movement
    
    this.ctx.save();
    
    // Outer glow
    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, radius + 40, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
    this.ctx.fill();
    
    // Middle glow
    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, radius + 25, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
    this.ctx.fill();
    
    // Sun rays (slower rotation)
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 3;
    this.ctx.shadowColor = '#FFD700';
    this.ctx.shadowBlur = 10;
    
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI * 2 / 16) + this.sunRayRotation;
      const x1 = sunX + Math.cos(angle) * (radius + 20);
      const y1 = sunY + Math.sin(angle) * (radius + 20);
      const x2 = sunX + Math.cos(angle) * (radius + 45);
      const y2 = sunY + Math.sin(angle) * (radius + 45);
      
      this.ctx.globalAlpha = 0.8 + 0.2 * Math.sin(this.time * 2 + i); // Gentle pulsing
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }
    
    // Sun body with gradient
    this.ctx.globalAlpha = 1;
    const sunGradient = this.ctx.createRadialGradient(sunX - radius * 0.3, sunY - radius * 0.3, 0, sunX, sunY, radius);
    sunGradient.addColorStop(0, '#FFFF99');
    sunGradient.addColorStop(0.4, '#FFD700');
    sunGradient.addColorStop(1, '#FFA500');
    
    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = sunGradient;
    this.ctx.shadowColor = '#FFD700';
    this.ctx.shadowBlur = 20;
    this.ctx.fill();
    
    // Sun surface texture
    this.drawSunTexture(sunX, sunY, radius);
    
    // Lens flare effect
    this.drawSunLensFlare(sunX, sunY, radius);
    
    this.ctx.restore();
  }

  drawSunTexture(x, y, radius) {
    this.ctx.save();
    this.ctx.globalAlpha = 0.3;
    
    // Create solar flares and surface details
    const flares = [
      { x: -0.2, y: -0.3, size: 0.1 },
      { x: 0.3, y: -0.1, size: 0.08 },
      { x: -0.1, y: 0.2, size: 0.12 },
      { x: 0.2, y: 0.3, size: 0.06 },
      { x: -0.3, y: 0.1, size: 0.07 }
    ];
    
    for (let flare of flares) {
      const flareX = x + flare.x * radius;
      const flareY = y + flare.y * radius;
      const flareRadius = flare.size * radius;
      
      // Bright spots
      this.ctx.beginPath();
      this.ctx.arc(flareX, flareY, flareRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      this.ctx.fill();
      
      // Flare glow
      this.ctx.beginPath();
      this.ctx.arc(flareX, flareY, flareRadius * 1.5, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  drawSunLensFlare(x, y, radius) {
    this.ctx.save();
    
    // Main lens flare - bright center
    this.ctx.globalAlpha = 0.4;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius * 0.2, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
    this.ctx.shadowBlur = 20;
    this.ctx.fill();
    
    // Secondary flare rings
    const flareRings = [
      { distance: 1.8, size: 0.6, alpha: 0.2, color: 'rgba(255, 200, 100, 0.3)' },
      { distance: 2.5, size: 0.4, alpha: 0.15, color: 'rgba(100, 200, 255, 0.25)' },
      { distance: 3.2, size: 0.3, alpha: 0.1, color: 'rgba(255, 150, 200, 0.2)' }
    ];
    
    for (let ring of flareRings) {
      this.ctx.globalAlpha = ring.alpha;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius * ring.distance, 0, Math.PI * 2);
      this.ctx.strokeStyle = ring.color;
      this.ctx.lineWidth = radius * ring.size * 0.05;
      this.ctx.shadowBlur = 10;
      this.ctx.stroke();
    }
    
    // Subtle distant light rays (moved further out)
    this.ctx.globalAlpha = 0.15;
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = 1;
    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    this.ctx.shadowBlur = 15;
    
    // Horizontal streak (far from center)
    this.ctx.beginPath();
    this.ctx.moveTo(x - radius * 4, y);
    this.ctx.lineTo(x - radius * 2, y);
    this.ctx.moveTo(x + radius * 2, y);
    this.ctx.lineTo(x + radius * 4, y);
    this.ctx.stroke();
    
    // Vertical streak (far from center)
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - radius * 4);
    this.ctx.lineTo(x, y - radius * 2);
    this.ctx.moveTo(x, y + radius * 2);
    this.ctx.lineTo(x, y + radius * 4);
    this.ctx.stroke();
    
    this.ctx.restore();
  }

  drawMoon(x, y, radius) {
    if (!this.showMoon) return;
    
    // Update moon position slowly across the sky
    this.moonPosition += this.moonSpeed;
    if (this.moonPosition > 1) this.moonPosition = 0;
    
    // Calculate moon position based on movement
    const moonX = this.canvas.width * (0.2 + this.moonPosition * 0.6);
    const moonY = y + Math.sin(this.moonPosition * Math.PI) * -50; // Arc movement
    
    this.ctx.save();
    
    // Moon glow
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, radius + 15, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(245, 245, 220, 0.1)';
    this.ctx.shadowColor = 'rgba(245, 245, 220, 0.3)';
    this.ctx.shadowBlur = 30;
    this.ctx.fill();
    
    // Main moon body
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = '#F5F5DC';
    this.ctx.shadowColor = '#F5F5DC';
    this.ctx.shadowBlur = 20;
    this.ctx.fill();
    
    // Moon texture (craters)
    this.drawMoonTexture(moonX, moonY, radius);
    
    // Moon phase shadow
    if (this.moonPhase !== 0.5) { // Not full moon
      this.drawMoonPhase(moonX, moonY, radius);
    }
    
    this.ctx.restore();
  }

  drawMoonTexture(x, y, radius) {
    this.ctx.save();
    this.ctx.globalAlpha = 0.3;
    
    // Create several craters for texture
    const craters = [
      { x: -0.3, y: -0.2, size: 0.15 },
      { x: 0.2, y: -0.4, size: 0.1 },
      { x: -0.1, y: 0.3, size: 0.12 },
      { x: 0.4, y: 0.1, size: 0.08 },
      { x: -0.4, y: 0.2, size: 0.06 },
      { x: 0.1, y: -0.1, size: 0.05 },
      { x: 0.3, y: 0.4, size: 0.07 }
    ];
    
    for (let crater of craters) {
      const craterX = x + crater.x * radius;
      const craterY = y + crater.y * radius;
      const craterRadius = crater.size * radius;
      
      // Crater shadow
      this.ctx.beginPath();
      this.ctx.arc(craterX, craterY, craterRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      this.ctx.fill();
      
      // Crater highlight
      this.ctx.beginPath();
      this.ctx.arc(craterX - craterRadius * 0.3, craterY - craterRadius * 0.3, craterRadius * 0.6, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  drawMoonPhase(x, y, radius) {
    this.ctx.save();
    
    // Create clipping mask for the moon
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.clip();
    
    // Draw phase shadow
    this.ctx.beginPath();
    
    if (this.moonPhase === 0) { // New moon - completely dark
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      this.ctx.fill();
    } else if (this.moonPhase === 0.25) { // First quarter - right half lit
      this.ctx.arc(x, y, radius, Math.PI * 0.5, Math.PI * 1.5);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fill();
    } else if (this.moonPhase === 0.75) { // Last quarter - left half lit
      this.ctx.arc(x, y, radius, Math.PI * 1.5, Math.PI * 0.5);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  drawStars() {
    if (!this.stars) {
      this.initializeStars();
    }
    
    this.ctx.save();
    
    for (let star of this.stars) {
      // Very slow drift movement
      star.x += star.driftX;
      star.y += star.driftY;
      
      // Wrap around screen edges
      if (star.x > this.canvas.width) star.x = 0;
      if (star.x < 0) star.x = this.canvas.width;
      if (star.y > this.canvas.height * 0.7) star.y = 0;
      if (star.y < 0) star.y = this.canvas.height * 0.7;
      
      // Gentle twinkling effect
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = 0.5 + 0.5 * Math.sin(star.twinklePhase);
      const alpha = star.brightness * twinkle;
      
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.shadowColor = '#FFFFFF';
      this.ctx.shadowBlur = star.size * 2;
      
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  updateAndDrawWind() {
    if (!this.windLines) return;
    
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    this.ctx.lineWidth = 2;
    
    for (let line of this.windLines) {
      line.x += line.speed;
      if (line.x > this.canvas.width) {
        line.x = -line.length;
        line.y = Math.random() * this.canvas.height;
      }
      
      this.ctx.globalAlpha = line.opacity;
      this.ctx.beginPath();
      this.ctx.moveTo(line.x, line.y);
      this.ctx.lineTo(line.x + line.length, line.y);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  updateAndDrawHaze() {
    if (!this.hazeParticles) return;
    
    this.ctx.save();
    for (let particle of this.hazeParticles) {
      particle.x += particle.speed;
      particle.y += particle.drift;
      
      if (particle.x - particle.radius > this.canvas.width) {
        particle.x = -particle.radius;
      }
      
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillStyle = '#DDD8C7';
      this.ctx.shadowColor = 'rgba(221, 216, 199, 0.3)';
      this.ctx.shadowBlur = 25;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  updateAndDrawRain() {
    if (!this.raindrops) return;
    
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(173, 216, 230, 0.8)';
    this.ctx.lineWidth = 3;
    this.ctx.shadowColor = 'rgba(173, 216, 230, 0.4)';
    this.ctx.shadowBlur = 2;
    
    for (let drop of this.raindrops) {
      drop.y += drop.speed;
      drop.x -= 2;
      
      if (drop.y > this.canvas.height - 5) {
        // Create splash when raindrop hits ground
        this.createRainSplash(drop.x, this.canvas.height - 5, 1);
        drop.y = -drop.length;
        drop.x = Math.random() * this.canvas.width;
      }
      
      this.ctx.globalAlpha = drop.opacity;
      this.ctx.beginPath();
      this.ctx.moveTo(drop.x, drop.y);
      this.ctx.lineTo(drop.x - 3, drop.y + drop.length);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
    
    // Draw splashes
    this.updateAndDrawRainSplashes();
  }

  updateAndDrawRainSplashes() {
    if (!this.rainSplashes) return;
    
    this.ctx.save();
    
    for (let i = this.rainSplashes.length - 1; i >= 0; i--) {
      const splash = this.rainSplashes[i];
      
      // Update splash physics
      splash.x += splash.vx;
      splash.y += splash.vy;
      splash.vy += 0.3; // gravity
      splash.life -= splash.decay;
      
      if (splash.life <= 0) {
        this.rainSplashes.splice(i, 1);
        continue;
      }
      
      // Draw splash particle
      this.ctx.globalAlpha = splash.life * 0.6;
      this.ctx.fillStyle = 'rgba(173, 216, 230, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(splash.x, splash.y, splash.size * splash.life, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  updateAndDrawFreezingRain() {
    if (!this.freezingDrops) return;
    
    this.ctx.save();
    
    for (let drop of this.freezingDrops) {
      drop.y += drop.speed;
      drop.x -= 1.5;
      
      if (drop.y > this.canvas.height - 4) {
        this.createFreezingSplash(drop.x, this.canvas.height - 4, drop.isIce);
        drop.y = -drop.length;
        drop.x = Math.random() * this.canvas.width;
      }
      
      this.ctx.globalAlpha = drop.opacity;
      
      if (drop.isIce) {
        // Draw ice pellets
        this.ctx.fillStyle = 'rgba(200, 220, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(drop.x, drop.y, 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Draw freezing rain
        this.ctx.strokeStyle = 'rgba(173, 216, 230, 0.7)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(drop.x, drop.y);
        this.ctx.lineTo(drop.x - 2, drop.y + drop.length);
        this.ctx.stroke();
      }
    }
    
    this.ctx.restore();
    
    this.updateAndDrawFreezingSplashes();
  }

  updateAndDrawFreezingSplashes() {
    if (!this.freezingSplashes) return;
    
    this.ctx.save();
    
    for (let i = this.freezingSplashes.length - 1; i >= 0; i--) {
      const splash = this.freezingSplashes[i];
      
      splash.x += splash.vx;
      splash.y += splash.vy;
      splash.vy += 0.25;
      splash.life -= splash.decay;
      
      if (splash.life <= 0) {
        this.freezingSplashes.splice(i, 1);
        continue;
      }
      
      this.ctx.globalAlpha = splash.life * 0.7;
      if (splash.isIce) {
        this.ctx.fillStyle = 'rgba(200, 220, 255, 0.9)';
      } else {
        this.ctx.fillStyle = 'rgba(173, 216, 230, 0.8)';
      }
      this.ctx.beginPath();
      this.ctx.arc(splash.x, splash.y, splash.size * splash.life, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  updateAndDrawLightClouds() {
    if (!this.clouds) return;
    
    this.ctx.save();
    for (let cloud of this.clouds) {
      cloud.x += cloud.speed;
      if (cloud.x - cloud.radius > this.canvas.width) {
        cloud.x = -cloud.radius;
      }
      
      this.ctx.globalAlpha = cloud.opacity;
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      this.ctx.shadowBlur = 20;
      
      this.drawCloudShape(cloud.x, cloud.y, cloud.radius);
    }
    this.ctx.restore();
  }

  updateAndDrawClouds() {
    if (!this.clouds) return;
    
    this.ctx.save();
    for (let cloud of this.clouds) {
      cloud.x += cloud.speed;
      if (cloud.x - cloud.radius > this.canvas.width) {
        cloud.x = -cloud.radius;
      }
      
      this.ctx.globalAlpha = cloud.opacity;
      
      if (cloud.type === 'thunderstorm') {
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.shadowColor = 'rgba(44, 62, 80, 0.5)';
      } else if (cloud.type === 'rain' || cloud.type === 'heavy-rain') {
        this.ctx.fillStyle = '#5D6D7E';
        this.ctx.shadowColor = 'rgba(93, 109, 126, 0.5)';
      } else if (cloud.type === 'drizzle') {
        this.ctx.fillStyle = '#778899';
        this.ctx.shadowColor = 'rgba(119, 136, 153, 0.5)';
      } else if (cloud.type === 'freezing-rain') {
        this.ctx.fillStyle = '#B0C4DE';
        this.ctx.shadowColor = 'rgba(176, 196, 222, 0.5)';
      } else {
        this.ctx.fillStyle = '#95A5A6';
        this.ctx.shadowColor = 'rgba(149, 165, 166, 0.5)';
      }
      
      this.ctx.shadowBlur = 25;
      this.drawCloudShape(cloud.x, cloud.y, cloud.radius);
    }
    this.ctx.restore();
  }

  drawCloudShape(x, y, radius) {
    this.ctx.beginPath();
    this.ctx.arc(x - radius * 0.5, y, radius * 0.6, 0, Math.PI * 2);
    this.ctx.arc(x - radius * 0.2, y - radius * 0.3, radius * 0.8, 0, Math.PI * 2);
    this.ctx.arc(x + radius * 0.2, y - radius * 0.2, radius * 0.7, 0, Math.PI * 2);
    this.ctx.arc(x + radius * 0.5, y, radius * 0.6, 0, Math.PI * 2);
    this.ctx.arc(x, y + radius * 0.2, radius * 0.9, 0, Math.PI * 2);
    this.ctx.fill();
  }

  updateAndDrawLightning() {
    const now = performance.now();
    
    if (now > this.nextLightning) {
      this.createLightningBolt();
      this.nextLightning = now + (2000 + Math.random() * 3000);
    }
    
    // Update and draw lightning bolts
    this.ctx.save();
    for (let i = this.lightningBolts.length - 1; i >= 0; i--) {
      const bolt = this.lightningBolts[i];
      bolt.alpha *= 0.9;
      
      if (bolt.alpha < 0.05) {
        this.lightningBolts.splice(i, 1);
        continue;
      }
      
      this.ctx.globalAlpha = bolt.alpha;
      this.ctx.strokeStyle = '#E8F4FD';
      this.ctx.lineWidth = 5;
      this.ctx.shadowColor = '#E8F4FD';
      this.ctx.shadowBlur = 20;
      
      this.ctx.beginPath();
      this.ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
      for (let j = 1; j < bolt.points.length; j++) {
        this.ctx.lineTo(bolt.points[j].x, bolt.points[j].y);
      }
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  createLightningBolt() {
    if (!this.clouds || this.clouds.length === 0) return;
    
    const cloud = this.clouds[Math.floor(Math.random() * this.clouds.length)];
    const startX = cloud.x + (Math.random() - 0.5) * cloud.radius;
    const startY = cloud.y + cloud.radius * 0.5;
    const endX = startX + (Math.random() - 0.5) * 100;
    const endY = this.canvas.height * (0.8 + Math.random() * 0.2);
    
    const points = [{ x: startX, y: startY }];
    const segments = 20;
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const x = startX + (endX - startX) * t + (Math.random() - 0.5) * 40 * (1 - t);
      const y = startY + (endY - startY) * t + (Math.random() - 0.5) * 20;
      points.push({ x, y });
    }
    
    this.lightningBolts.push({ points, alpha: 1 });
  }

  updateAndDrawSnow() {
    if (!this.snowflakes) return;
    
    this.ctx.save();
    
    // Pre-calculate common values
    const timeOffset = this.time * 0.005;
    
    for (let flake of this.snowflakes) {
      flake.y += flake.speed;
      flake.x += flake.drift + Math.sin(timeOffset + flake.y * 0.005) * 0.2;
      flake.rotation += flake.rotationSpeed;
      
      // Simplified twinkle effect
      flake.twinkle += flake.twinkleSpeed;
      const twinkleAlpha = 0.7 + 0.3 * Math.sin(flake.twinkle);
      
      if (flake.y > this.canvas.height) {
        flake.y = -flake.radius;
        flake.x = Math.random() * this.canvas.width;
      }
      
      this.ctx.globalAlpha = flake.opacity * twinkleAlpha;
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.shadowBlur = 8; // Reduced shadow blur
      
      // Simple circle for smaller flakes, detailed for larger ones
      if (flake.radius <= 4) {
        // Simple circle for performance
        this.ctx.beginPath();
        this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Detailed snowflake only for larger flakes
        this.ctx.save();
        this.ctx.translate(flake.x, flake.y);
        this.ctx.rotate(flake.rotation);
        
        // Main body
        this.ctx.beginPath();
        this.ctx.arc(0, 0, flake.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Simplified arms (only 6 main arms, no branches)
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.lineWidth = 1;
        this.ctx.shadowBlur = 4;
        
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          this.ctx.moveTo(0, 0);
          this.ctx.lineTo(Math.cos(angle) * flake.radius * 0.8, Math.sin(angle) * flake.radius * 0.8);
        }
        this.ctx.stroke();
        
        this.ctx.restore();
      }
    }
    this.ctx.restore();
  }

  updateAndDrawFog() {
    if (!this.fogParticles) return;
    
    this.ctx.save();
    for (let particle of this.fogParticles) {
      particle.x += particle.speed;
      particle.y += particle.drift;
      
      if (particle.x - particle.radius > this.canvas.width) {
        particle.x = -particle.radius;
      }
      
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillStyle = '#E5E5E5';
      this.ctx.shadowColor = 'rgba(229, 229, 229, 0.5)';
      this.ctx.shadowBlur = 30;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  updateAndDrawDrizzle() {
    if (!this.drizzleDrops) return;
    
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(173, 216, 230, 0.6)';
    this.ctx.lineWidth = 1;
    
    for (let drop of this.drizzleDrops) {
      drop.y += drop.speed;
      drop.x -= 0.5;
      
      if (drop.y > this.canvas.height - 3) {
        this.createDrizzleSplash(drop.x, this.canvas.height - 3);
        drop.y = -drop.length;
        drop.x = Math.random() * this.canvas.width;
      }
      
      this.ctx.globalAlpha = drop.opacity;
      this.ctx.beginPath();
      this.ctx.moveTo(drop.x, drop.y);
      this.ctx.lineTo(drop.x - 1, drop.y + drop.length);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
    
    this.updateAndDrawDrizzleSplashes();
  }

  updateAndDrawDrizzleSplashes() {
    if (!this.drizzleSplashes) return;
    
    this.ctx.save();
    
    for (let i = this.drizzleSplashes.length - 1; i >= 0; i--) {
      const splash = this.drizzleSplashes[i];
      
      splash.x += splash.vx;
      splash.y += splash.vy;
      splash.vy += 0.2;
      splash.life -= splash.decay;
      
      if (splash.life <= 0) {
        this.drizzleSplashes.splice(i, 1);
        continue;
      }
      
      this.ctx.globalAlpha = splash.life * 0.4;
      this.ctx.fillStyle = 'rgba(173, 216, 230, 0.6)';
      this.ctx.beginPath();
      this.ctx.arc(splash.x, splash.y, splash.size * splash.life, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  toggleMoon() {
    this.showMoon = !this.showMoon;
    this.updateMoonToggleButton();
  }

  updateMoonToggleButton() {
    if (this.showMoon) {
      this.moonToggle.classList.remove('moon-hidden');
      this.moonToggle.textContent = '🌙';
    } else {
      this.moonToggle.classList.add('moon-hidden');
      this.moonToggle.textContent = '🌑';
    }
  }

  cycleMoonPhase(direction) {
    const phases = [0, 0.25, 0.5, 0.75]; // new, first quarter, full, last quarter
    let currentIndex = phases.indexOf(this.moonPhase);
    currentIndex = (currentIndex + direction + phases.length) % phases.length;
    this.moonPhase = phases[currentIndex];
    this.updateMoonPhaseLabel();
  }

  updateMoonPhaseLabel() {
    const phaseNames = {
      0: 'New Moon',
      0.25: 'First Quarter', 
      0.5: 'Full Moon',
      0.75: 'Last Quarter'
    };
    this.moonPhaseLabel.textContent = phaseNames[this.moonPhase];
  }

  updateSunPositionLabel() {
    let positionName;
    if (this.sunPosition < 0.2) {
      positionName = '🌅 Sunrise';
    } else if (this.sunPosition < 0.4) {
      positionName = '🌤️ Morning';
    } else if (this.sunPosition < 0.6) {
      positionName = '☀️ Midday';
    } else if (this.sunPosition < 0.8) {
      positionName = '🌇 Afternoon';
    } else {
      positionName = '🌆 Sunset';
    }
    this.sunPositionLabel.textContent = positionName;
  }

  adjustSunPosition(direction) {
    this.sunPosition = (this.sunPosition + direction + 1) % 1;
    this.updateSunPositionLabel();
  }
}

// Initialize the weather app
new WeatherApp();