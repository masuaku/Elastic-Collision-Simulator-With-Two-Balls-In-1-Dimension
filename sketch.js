let m1 = 10; // mass left ball 
let m2 = 100000; // mass right ball
let diameter = 50;
let xBall1 = 200; // x coordinate of left ball
let yBall1 = 200; // y coordinate of left ball
let xBall2 = 375; // x coordinate of right ball
let yBall2 = 200; // y coordinate of right ball
let touchWall1 = diameter / 2; // x coordinate of center location of left ball while tangent to left wall
let touchWall2 = 5000 - (diameter/2); // x coordinate of center location of right ball while tangent to right wall
let initialDistanceBwBallCenters = xBall2 - xBall1;
let maxDistance = touchWall2 - touchWall1;
let t = 0; // time 
let deltaT = 0.01; // time step
let preVel1 = 0; // previous velocity of left ball
let preVel2 = -10; // previous velocity of right ball
let deltaX1 = deltaT*preVel1; // space interval of left ball
let deltaX2 = deltaT*preVel2; // space interval of right ball
let counter = 0; // counts how many times balls hit the walls and each other.
let finalEnergy = 0; // check for conservation of total energy
let difference = 0; // overlap distance of two balls 
let i = 0; 

// Clack sound while collision 
function preload() {
  clack = loadSound('clack.wav');
}

// Calculation of New Velocities After Collision
function calculateNewVelocities() {
  let massSub = m1 - m2;
  let massAdd = m1 + m2;
  let nextVel1 = preVel1*(massSub/massAdd)+ preVel2*(2*m2/massAdd);
  let nextVel2 = preVel2*(-massSub/massAdd)+ preVel1*(2*m1/massAdd);
  let nextEnergy1 = (1/2)*m1*nextVel1*nextVel1;
  let nextEnergy2 = (1/2)*m2*nextVel2*nextVel2;
  finalEnergy = nextEnergy1 + nextEnergy2;
  
  preVel1 = nextVel1;
  preVel2 = nextVel2;
  
  if (preVel1 < 0 && preVel2 > 0){
    initialDistanceBwBallCenters = 2*maxDistance;
  }
  else if (preVel1 > 0 && preVel2 < 0){
    initialDistanceBwBallCenters = xBall2-xBall1;  
  }
  else if (preVel1 >= 0 && preVel2 > 0){
    // 
    if (preVel1 <= preVel2) {
      initialDistanceBwBallCenters = 2*touchWall2 - xBall2 - xBall1;       
    }
    else if (preVel1 > preVel2) {
      initialDistanceBwBallCenters = xBall2 - xBall1;       
    }
  }
  else if (preVel1 > 0 && preVel2 >= 0){
    if (preVel1 <= preVel2) {
      initialDistanceBwBallCenters = 2*touchWall2 - xBall2 - xBall1;       
    }
    else if (preVel1 > preVel2) {
      initialDistanceBwBallCenters = xBall2 - xBall1;       
    }
  }
  else if (preVel1 <= 0 && preVel2 < 0){
    if (preVel1 <= preVel2) {
      initialDistanceBwBallCenters = xBall1 + xBall2 - 2*touchWall1;
    }
    else if (preVel1 > preVel2) {
      initialDistanceBwBallCenters = xBall2 - xBall1;       
    }
  }
  else if (preVel1 < 0 && preVel2 <= 0){
    if (preVel1 <= preVel2) {
      initialDistanceBwBallCenters = xBall1 + xBall2 - 2*touchWall1;
    }
    else if (preVel1 > preVel2) {
      initialDistanceBwBallCenters = xBall2 - xBall1;       
    }
  }  
}

// Translation of balls for each time interval. 
function movingObjects(){
  if (i > 0) {
    // Check for left ball and left wall collision
    if (xBall1 <= touchWall1) {
      let overlapWall1 = touchWall1 - xBall1;
      xBall1 = xBall1 + overlapWall1;
      preVel1 = -preVel1;
      counter++;
      clack.play();
    }  
    if (xBall2 >= touchWall2) {
      // Check for right ball and right wall collision
      let overlapWall2 = xBall2 - touchWall2;
      xBall2 = xBall2 - overlapWall2;
      preVel2 = -preVel2;
      clack.play();
    }
  }
  //changing space increment after new velocities
  deltaX1 = deltaT*preVel1;
  xBall1 = xBall1 + deltaX1;
  deltaX2 = deltaT*preVel2;
  xBall2 = xBall2 + deltaX2;
}
function setup() {
  createCanvas(5000, 400);
}

function draw() {
  frameRate(60);
      // Deciding Whether the balls are Colliding or Not 
      // Overlap exists
      if (initialDistanceBwBallCenters <= diameter) {
        difference = diameter - initialDistanceBwBallCenters;
        let firstPortion = Math.abs(preVel1*difference)/(Math.abs(preVel1) + Math.abs(preVel2));
        let secondPortion = Math.abs(preVel2*difference)/(Math.abs(preVel1) + Math.abs(preVel2));
        xBall1 = xBall1 - firstPortion;
        xBall2 = xBall2 + secondPortion;

          //Left Wall Overlap  
          if (xBall1 <= touchWall1) {
            let overlapWall1 = touchWall1 - xBall1;
            xBall1 = xBall1 + overlapWall1;
            xBall2 = xBall2 + overlapWall1;
          }
          // Right Wall Overlap
          else if (xBall2 >= touchWall2) {
            let overlapWall2 = xBall2 - touchWall2;
            xBall1 = xBall1 - overlapWall2;
            xBall2 = xBall2 - overlapWall2;
          }
        counter++;
        clack.play();
        calculateNewVelocities();   
        t = 0;
      }
      
      // No Overlap
      else if (initialDistanceBwBallCenters > diameter){
        
          t = t + deltaT;
          // Before Collision in Opposite Direction
          if (preVel1 > 0 && preVel2 < 0) {
            deltaX1 = deltaT*preVel1;
            xBall1 = xBall1 + deltaX1;
            deltaX2 = deltaT*preVel2;
            xBall2 = xBall2 + deltaX2;
            initialDistanceBwBallCenters = xBall2 - xBall1;
            
            //console.log(initialDistanceBwBallCenters);
          }
          // Both are at rest.
          else if (preVel1 == 0 && preVel2 == 0) {
            initialDistanceBwBallCenters = xBall2 - xBall1;
          }
          // 1 After Collision in Opposite Direction
          else if (preVel1 <= 0 && preVel2 > 0) {
            movingObjects();
            initialDistanceBwBallCenters = maxDistance + (xBall1 - touchWall1 + touchWall2 - xBall2);
          }
          // 2 After Collision in Opposite Direction
          else if (preVel1 < 0 && preVel2 >= 0) {
            movingObjects();
            initialDistanceBwBallCenters = maxDistance + (xBall1 - touchWall1 + touchWall2 - xBall2);
          }
          // 1 After Collision in Same Direction 
          else if (preVel1 >= 0 && preVel2 > 0){
            if (preVel1 <= preVel2) {
              movingObjects();
              initialDistanceBwBallCenters = 2*touchWall2 - xBall2 - xBall1;        
            }
            else if (preVel1 > preVel2) {
              movingObjects();
              initialDistanceBwBallCenters = xBall2-xBall1;        
            }      
          }
          // 2 After Collision in Same Direction 
          else if (preVel1 > 0 && preVel2 >= 0){
            if (preVel1 <= preVel2) {
              movingObjects();
              initialDistanceBwBallCenters = 2*touchWall2 - xBall2 - xBall1;        
            }
            else if (preVel1 > preVel2) {
              movingObjects();
              initialDistanceBwBallCenters = xBall2-xBall1;        
            }      
          }
          // 3 After Collision in Same Direction
          else if (preVel1 < 0 && preVel2 <= 0){
            if (preVel1 <= preVel2) {
              movingObjects();
              initialDistanceBwBallCenters = xBall1 + xBall2 - 2*touchWall1;        
            }
            else if (preVel1 > preVel2) {
              movingObjects();
              initialDistanceBwBallCenters = xBall2-xBall1;        
            }      
          }
          // 4 After Collision in Same Direction
          else if (preVel1 <= 0 && preVel2 < 0){
            if (preVel1 <= preVel2) {
              movingObjects();
              initialDistanceBwBallCenters = xBall1 + xBall2 - 2*touchWall1;        
            }
            else if (preVel1 > preVel2) {
              movingObjects();
              initialDistanceBwBallCenters = xBall2-xBall1;        
            }      
          }
      }
        
  background(220);  
  fill(0,0,0);
  circle(xBall1, yBall1, diameter);
  fill(0,0,255);
  circle(xBall2, yBall2, diameter);    

  console.log(counter);
  //console.log(finalEnergy);
  i++;

}
