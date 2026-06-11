Project 4: 2D Physics-Based Puzzle Game

Description
A physics puzzle game (similar to Angry Birds) where players launch projectiles from a slingshot/cannon to knock down structures and hit targets using realistic gravity and collisions.

Tools & Resources
1.	Frontend: HTML5 Canvas, JavaScript.
2.	Physics Engine: Matter.js (a 2D rigid body physics engine for the web).

Steps
1.	Engine Setup: Initialize the Matter.js runner, world, and viewport canvas.
2.	Environment Building: Create static ground bodies and stackable dynamic bodies (rectangles/circles) to form structures.
3.	Sling Mechanics: Implement a mouse constraint that lets players click, drag, and snap back a projectile ball.
4.	Win/Loss Logic: Track when target blocks fall below a certain height or off-screen, and trigger a "Level Complete" menu.
5.	Level Design: Hardcode a JSON array containing different coordinate layouts for 3 to 5 unique levels.

Architecture
The game is powered by a continuous Game/Physics Loop. The Input Handler captures player drag-and-release vectors, applying physical force to the projectile. The Matter.js Engine calculates real-time velocity, gravity, and object collisions, then updates the Canvas Renderer to redraw the updated positions frame-by-frame.

Outcome
A polished, addictive web game with realistic gravity, satisfying block destruction, and smooth level progression saved locally.
