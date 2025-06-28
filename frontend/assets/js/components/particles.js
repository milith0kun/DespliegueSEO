class Queue {
    constructor(array = []) {
        this.queue = array;
    }
    
    getLength() { return this.queue.length; }
    enqueue(element) { this.queue.unshift(element); }
    dequeue() { this.queue.pop(); }
}

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.magnitude = Math.sqrt((x * x) + (y * y));
        this.angle = Math.atan2(y, x);
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.magnitude = Math.sqrt((this.x * this.x) + (this.y * this.y));
        this.angle = Math.atan2(this.y, this.x);
        return this;
    }

    setAngle(angle) {
        this.angle = angle;
        this.x = this.magnitude * Math.cos(angle);
        this.y = this.magnitude * Math.sin(angle);
        return this;
    }

    setMagnitude(magnitude) {
        this.magnitude = magnitude;
        this.x = Math.cos(this.angle) * magnitude;
        this.y = Math.sin(this.angle) * magnitude;
        return this;
    }
}

class ParticleSystem {
    constructor() {
        this.container = document.querySelector('.particles-container');
        this.elements = document.querySelectorAll('.element');
        this.bounds = this.container.getBoundingClientRect();
        
        // Mejorar el cálculo del punto central para mejor posicionamiento
        const logoContainer = document.querySelector('.logo-container');
        const letterE = document.querySelector('.letter:nth-child(2)');
        const containerBounds = this.container.getBoundingClientRect();
        
        // Si no existe el logo, usar el centro del contenedor
        if (!letterE) {
            this.centerPoint = {
                x: this.bounds.width / 2,
                y: this.bounds.height / 2
            };
        } else {
            const eBounds = letterE.getBoundingClientRect();
            this.centerPoint = {
                x: (eBounds.left + eBounds.width / 2) - containerBounds.left,
                y: (eBounds.top + eBounds.height / 2) - containerBounds.top - 20 // Ajuste vertical
            };
        }
        
        this.particles = [];
        this.init();
    }

    init() {
        this.elements.forEach((element, index) => {
            const side = Math.floor(Math.random() * 4);
            let startX, startY, vx, vy;
            
            switch(side) {
                case 0: // top
                    startX = Math.random() * this.bounds.width;
                    startY = -10;
                    vx = (Math.random() - 0.5) * 0.5;
                    vy = 0.5 + Math.random() * 0.3;
                    break;
                case 1: // right
                    startX = this.bounds.width + 10;
                    startY = Math.random() * this.bounds.height;
                    vx = -(0.5 + Math.random() * 0.3);
                    vy = (Math.random() - 0.5) * 0.5;
                    break;
                case 2: // bottom
                    startX = Math.random() * this.bounds.width;
                    startY = this.bounds.height + 10;
                    vx = (Math.random() - 0.5) * 0.5;
                    vy = -(0.5 + Math.random() * 0.3);
                    break;
                case 3: // left
                    startX = -10;
                    startY = Math.random() * this.bounds.height;
                    vx = 0.5 + Math.random() * 0.3;
                    vy = (Math.random() - 0.5) * 0.5;
                    break;
            }
            
            const particle = new Particle({
                element: element,
                x: startX,
                y: startY,
                vx: vx,
                vy: vy,
                mass: 3 + Math.random() * 2,
                maxSpeed: 1.2,
                maxForce: 0.15,
                trailLength: 8,
                bounds: this.bounds,
                phase: 'entering'
            });
            
            this.particles.push(particle);
        });

        this.animate();
    }

    animate() {
        this.particles.forEach((particle, index) => {
            const distanceToCenter = Math.sqrt(
                Math.pow(this.centerPoint.x - particle.x, 2) + 
                Math.pow(this.centerPoint.y - particle.y, 2)
            );

            // Manejo de colisiones con los límites
            if (particle.x <= 0 || particle.x >= this.bounds.width) {
                particle.velocity.x *= -0.8; // Rebote con pérdida de energía
                particle.x = particle.x <= 0 ? 0 : this.bounds.width;
            }
            if (particle.y <= 0 || particle.y >= this.bounds.height) {
                particle.velocity.y *= -0.8;
                particle.y = particle.y <= 0 ? 0 : this.bounds.height;
            }

            // Transiciones de fase
            if (particle.phase === 'entering' && distanceToCenter < 80) { // Increased detection radius
                particle.phase = 'bouncing';
                particle.maxSpeed = 2.5; // Increased speed
                particle.maxForce = 0.35;
            } else if (particle.phase === 'bouncing' && particle.timeInPhase > 100) { // Reduced transition time
                particle.phase = 'positioning';
                particle.maxSpeed = 0.8;
                particle.maxForce = 0.2;
                
                // Adjust final positions around letters
                const letterSpacing = 30; // Increased spacing between letters
                const particlesPerLetter = Math.ceil(this.particles.length / 3);
                const letterIndex = Math.floor(index / particlesPerLetter);
                const angleOffset = (index % particlesPerLetter) / particlesPerLetter * Math.PI * 2;
                
                const letterPositions = [
                    {x: this.centerPoint.x - letterSpacing, y: this.centerPoint.y - 5}, // S
                    {x: this.centerPoint.x, y: this.centerPoint.y - 5},                 // E
                    {x: this.centerPoint.x + letterSpacing, y: this.centerPoint.y - 5}  // O
                ];
                
                const radius = 20 + Math.random() * 8; // Increased orbit radius
                particle.targetPosition = {
                    x: letterPositions[letterIndex].x + Math.cos(angleOffset) * radius,
                    y: letterPositions[letterIndex].y + Math.sin(angleOffset) * radius
                };
            }

            // Adjust phase transitions and positioning
            if (particle.phase === 'entering' && distanceToCenter < 60) {
                particle.phase = 'bouncing';
                particle.maxSpeed = 2;
                particle.maxForce = 0.3;
            } else if (particle.phase === 'bouncing' && particle.timeInPhase > 100) {
                particle.phase = 'positioning';
                particle.maxSpeed = 0.6;
                particle.maxForce = 0.15;
                
                const letterSpacing = 25; // Reduced spacing
                const particlesPerLetter = Math.ceil(this.particles.length / 3);
                const letterIndex = Math.floor(index / particlesPerLetter);
                const angleOffset = (index % particlesPerLetter) / particlesPerLetter * Math.PI * 2;
                
                const letterPositions = [
                    {x: this.centerPoint.x - letterSpacing, y: this.centerPoint.y - 15}, // S
                    {x: this.centerPoint.x, y: this.centerPoint.y - 15},                 // E
                    {x: this.centerPoint.x + letterSpacing, y: this.centerPoint.y - 15}  // O
                ];
                
                const radius = 12 + Math.random() * 5; // Reduced radius for tighter orbits
                particle.targetPosition = {
                    x: letterPositions[letterIndex].x + Math.cos(angleOffset) * radius,
                    y: letterPositions[letterIndex].y + Math.sin(angleOffset) * radius
                };
            }

            particle.timeInPhase = (particle.timeInPhase || 0) + 1;
            particle.update(this.centerPoint);
        });
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(opts = {}) {
        this.bounds = opts.bounds;
        this.x = opts.x || 0;
        this.y = opts.y || 0;
        this.element = opts.element;
        this.trail = opts.element.querySelector('.trail');
        this.velocity = new Vector(opts.vx || 0, opts.vy || 0);
        this.acceleration = new Vector();
        this.mass = opts.mass || 20;
        this.maxSpeed = opts.maxSpeed || 4;
        this.maxForce = opts.maxForce || 0.5;
        this.trailPoints = new Queue([]); // Inicializar con un array vacío
        this.trailLength = opts.trailLength || 10;
        this.phase = opts.phase || 'entering';
        this.targetPosition = null;
    }

    update(centerPoint) {
        // Asegurarnos de que acceleration siempre sea un Vector
        if (!this.acceleration) {
            this.acceleration = new Vector();
        }

        switch(this.phase) {
            case 'entering':
            case 'bouncing':
                const dx = centerPoint.x - this.x;
                const dy = centerPoint.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const force = 0.0001 * distance;
                this.acceleration.x = dx * force;
                this.acceleration.y = dy * force;
                break;
            case 'positioning':
                this.moveToPosition();
                break;
        }

        if (this.acceleration && this.acceleration.magnitude) {
            this.accelerate();
        }

        this.trailPoints.enqueue({ x: this.x, y: this.y });
        if (this.trailPoints.getLength() >= this.trailLength) {
            this.trailPoints.dequeue();
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.updateTrail();

        // Actualizar la rotación del icono
        const rotation = Math.atan2(this.velocity.y, this.velocity.x);
        const icon = this.element.querySelector('.icon');
        if (icon) {
            icon.style.transform = `rotate(${rotation}rad)`;
        }
    }

    accelerate() {
        if (this.acceleration.magnitude > this.maxForce) {
            this.acceleration.setMagnitude(this.maxForce);
        }
        this.velocity.add(this.acceleration);
        
        if (this.velocity.magnitude > this.maxSpeed) {
            this.velocity.setMagnitude(this.maxSpeed);
        }
        
        // Resetear aceleración después de aplicarla
        this.acceleration = new Vector();
    }

    updateTrail() {
        if (this.trailPoints.getLength() < 2) return;
        
        const opacity = 0.4;
        const width = Math.min(20, this.velocity.magnitude * 8);
        
        this.trail.style.width = `${width}px`;
        this.trail.style.opacity = opacity;
        const angle = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI;
        this.trail.style.transform = `rotate(${angle}rad)`;
    }

    spin(centerPoint) {
        const dx = centerPoint.x - this.x;
        const dy = centerPoint.y - this.y;
        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const spiralForce = 0.6;
        const tangentialForce = 0.9;
        const verticalBias = 0.2;
        
        this.acceleration.x = (Math.cos(angle) * spiralForce) + 
                            (Math.cos(angle + Math.PI/2) * tangentialForce * (this.spinDirection || 1));
        this.acceleration.y = (Math.sin(angle) * spiralForce) + 
                            (Math.sin(angle + Math.PI/2) * tangentialForce * (this.spinDirection || 1)) +
                            verticalBias;
    }

    moveToPosition() {
        if (!this.targetPosition) return;
        
        const dx = this.targetPosition.x - this.x;
        const dy = this.targetPosition.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 0.3) {
            this.velocity.x *= 0.9; // Desaceleración más suave
            this.velocity.y *= 0.9;
            if (Math.abs(this.velocity.x) < 0.01 && Math.abs(this.velocity.y) < 0.01) {
                this.velocity.x = 0;
                this.velocity.y = 0;
            }
            return;
        }
        
        const force = 0.02 + (distance * 0.0001); // Fuerza adaptativa
        this.acceleration.x = dx * force;
        this.acceleration.y = dy * force;
    }
}

// Remove duplicate class definitions and keep only the export at the end
export { ParticleSystem, Queue, Vector, Particle };