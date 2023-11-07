//The two extensions I did was to add advanced graphics and add sounds into the game.

//For the advanced graphics, I tried to give objects a shadow effect, by adding another color to the back of the items.
//Issue I faced with is doing up the shadow of the trees, which had turned out weird as the biggest ellips was one top of the middle ellipse.
//Skills I practised through this extension is to check for the position of the code, which in this case is the ellipse.
//Problems solved, after shifting the positions of the ellipse.

//The problem I faced when adding the sound into the game is that the falling sound kept playing even though my character has  respawn.
//To tackle this issue, the skills I tried to practise in this case is to recall the condition of 'fallingSound.play()'.
//With that, I tackle the issue by implementing a code, which stop the sound from playing when the character is off the screen.

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isJumping;

var trees_x;
var clouds;
var mountains;

var collectables;
var canyons;

var game_score;
var flagpole;
var lives;

var enemies;

var platforms;

var jumpSound;
var collectableSound;
var fallingSound;


function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.5);
    
    collectableSound = loadSound('assets/Collectable.wav');
    collectableSound.setVolume(0.5);
    
    //https://mixkit.co/free-sound-effects/scream/
    fallingSound = loadSound('assets/falling.mp3');
    fallingSound.setVolume(0.6);
   
}



function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;    
    lives = 3;
    startGame();
    font = loadFont('pixel_operator/PixelOperatorHBSC.ttf');
}


function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(127, 255, 212);
	rect(0, floorPos_y, width, height/4); // draw some green ground

    push();
    translate(scrollPos, 0);
    drawClouds();
    drawMountains();
    drawTrees();
    
    for (var i = 0; i < platforms.length; i++)
        {
            platforms[i].draw();
        }

	// Draw canyons.
    for (var i = 0; i<canyons.length; i++)
        {
            drawCanyon(canyons[i]);
            if(canyons[i].isPlummeting == false)
            {
                drawCanyon(canyons[i]);
            }
            else(canyons[i].isPlummeting == true)
            {
                checkCanyon(canyons[i]);
            }
        };

	// Draw collectable items.
    for(var i = 0; i <collectables.length; i++)
        {
            if(!collectables[i].isFound)
            {
                drawCollectable(collectables[i]);  
                checkCollectable(collectables[i]);
            }
        };
    
    renderFlagpole();
    
    for (var i = 0; i< enemies.length;i++)
        {
            enemies[i].draw(); 
            var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y)
            
            if (isContact)
                {
                    if(lives>0)
                        {
                            startGame();
                            lives -= 1;    
                            break;
                        }
                }
        }
    
    pop();
    
	// Draw game character.
	drawGameChar();
    
    //draw game score    
    fill(186,85,211);
    textSize(25);
    textFont(font);
    text("Score:" + " " + game_score, 11,26);
    text("lives:" + " " + lives, 841,26);
    
    fill(255,250,250);
    text("Score:" + " " + game_score, 10,25);
    text("Lives:" + " " + lives, 840,25);
    
    
    checkPlayerDie();
    
    if(lives<1)
    {
        fill(186,85,211);    
        textSize(100);
        text("GAME OVER", width/2-224, height/2-19);

        textSize(40);
        text("press space to continue.", width/2-224, height/2+10);
        
        fill(255,250,250);
        textSize(100);
        text("GAME OVER", width/2-223, height/2-18);
        textSize(40);
        text("press space to continue.", width/2-223, height/2+11);
    };
    
    if(flagpole.isReached)
    {
        fill(186,85,211);    
        textSize(70);
        text("LEVEL COMPLETE!", width/2-249, height/2-19);

        textSize(40);
        text("press space to continue.", width/2-224, height/2+10);
        
        fill(255,250,250);
        textSize(70);
        text("LEVEL COMPLETE!", width/2-248, height/2-18);
        textSize(40);
        text("press space to continue.", width/2-223, height/2+11);  
    };
    

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    // character jumping + ensuring it jumps when touches the ground
    if ((isJumping == true) && (gameChar_y == floorPos_y) )
    {
        gameChar_y -= 100;
    }
    
    // character above the ground will fall
    if (gameChar_y<floorPos_y)
    {
        var isContact = false;
        for (var i = 0; i <platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x,gameChar_y) == true)
            {
                isContact = true;
                break;
            }
        }
            
        if (isContact == false)
            {
            gameChar_y += 5;
            isFalling = true;        
            }
    }
        
    else     
    {
        isFalling = false;
    }
    
    if(!flagpole.isReached)
    {
    checkFlagpole();    
    }
    
    
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
    
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
//	console.log("press" + keyCode);
//	console.log("press" + key);
    
    if(keyCode == 37)
    {
//      console.log("left arrow");
        isLeft = true;
    }
    else if(keyCode == 39)
    {
//       console.log("right arrow");
        isRight = true;
    }
    else if(keyCode == 32 && gameChar_y == floorPos_y)
    {
//      console.log("spacebar");
        isJumping = true;
        jumpSound.play();
    }

}

function keyReleased()
{

//	console.log("release" + keyCode);
//	console.log("release" + key);
    
    if(keyCode == 37)
     {
//            console.log("left arrow");
        isLeft = false;
     }
    else if(keyCode == 39)
     {
//            console.log("right arrow");
       isRight = false;
     }
    else if(keyCode == 32)
     {
//            console.log("spacebar");
      isJumping = false;
     }
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
    // draw game character
    
    
    if(isLeft && isFalling)
    {
    // add your jumping-left code
    //feet
    fill(255,140,0);
    rect(gameChar_x-1,gameChar_y - 15, 5,10)
    arc(gameChar_x, gameChar_y-1,10,10, PI - PI/4,TWO_PI - PI/4);
    fill(255,165,0);
    rect(gameChar_x,gameChar_y - 15, 5,10)

    //body
    fill(255,240,0);
    ellipse(gameChar_x, gameChar_y - 25,35,30);
    ellipse(gameChar_x, gameChar_y - 45,30);
    fill(255,215,0);
    arc(gameChar_x,gameChar_y-40,15,20,TWO_PI - PI/4, PI - PI/4);

    //feet
    fill(255,165,0);
    arc(gameChar_x+1, gameChar_y-1,10,10, PI - PI/4,TWO_PI - PI/4);

    //mouth
    ellipse(gameChar_x-15, gameChar_y -40,15, 10);
    fill(255,140,0);
    arc(gameChar_x-15,gameChar_y-40,13,8,0, PI)

    //eyes
    fill(0);
    ellipse(gameChar_x-5, gameChar_y -50,5);
	}
    
	else if(isRight && isFalling)
	{
    // add your jumping-right code
    //legs
    fill(255,140,0);
    rect(gameChar_x-4,gameChar_y - 16, 5,10)
    arc(gameChar_x, gameChar_y -2,10,10,PI + PI/4,PI/4);
    fill(255,165,0);
    rect(gameChar_x-5,gameChar_y - 15, 5,10)

    //body
    fill(255,240,0);
    ellipse(gameChar_x, gameChar_y - 25,35,30);
    ellipse(gameChar_x, gameChar_y - 45,30);
    fill(255,215,0);
    arc(gameChar_x,gameChar_y-40,15,20,PI/4, PI + PI/4);

    //feet
    fill(255,165,0);
    arc(gameChar_x-1, gameChar_y -1,10,10,PI + PI/4,PI/4);

    //mouth
    ellipse(gameChar_x+15, gameChar_y -40,15, 10);
    fill(255,140,0);
    arc(gameChar_x+15,gameChar_y-40,13,8,0, PI)

    //eyes
    fill(0);
    ellipse(gameChar_x+5, gameChar_y -50,5);
	}
	else if(isLeft)
	{
    // add your walking left code
    //feet
    fill(255,165,0);
    rect(gameChar_x,gameChar_y - 15, 5,10);

    //body
    fill(255,240,0);
    ellipse(gameChar_x, gameChar_y - 25,35,30);
    ellipse(gameChar_x, gameChar_y - 45,30);
    fill(255,215,0);
    arc(gameChar_x-10,gameChar_y-25,15,20,TWO_PI - PI/4, PI - PI/4);

    //feet
    fill(255,165,0);
    arc(gameChar_x-1, gameChar_y -5,10,10,PI, TWO_PI);

    //mouth
    ellipse(gameChar_x-15, gameChar_y -40,15, 10);
    fill(255,140,0);
    arc(gameChar_x-15,gameChar_y-40,13,8,0, PI)

    //eyes
    fill(0);
    ellipse(gameChar_x-5, gameChar_y -50,5);
	}
	else if(isRight)
	{
    // add your walking right code
    //legs
    fill(255,165,0);
    rect(gameChar_x-5,gameChar_y - 15, 5,10)

    //body
    fill(255,240,0);
    ellipse(gameChar_x, gameChar_y - 25,35,30);
    ellipse(gameChar_x, gameChar_y - 45,30);
    fill(255,215,0);
    arc(gameChar_x+10,gameChar_y-25,15,20,PI/4, PI + PI/4);

    //feet
    fill(255,165,0);
    arc(gameChar_x+1, gameChar_y -5,10,10,PI, TWO_PI);

    //mouth
    ellipse(gameChar_x+15, gameChar_y -40,15, 10);
    fill(255,140,0);
    arc(gameChar_x+15,gameChar_y-40,13,8,0, PI)

    //eyes
    fill(0);
    ellipse(gameChar_x+5, gameChar_y -50,5);
	}
    
	else if(isFalling || isPlummeting || isJumping)
	{
    // add your jumping facing forwards code
    //Jumping facing forwards
    //feet
    fill(255,165,0);
    ellipse(gameChar_x-5, gameChar_y -6,10,11);
    ellipse(gameChar_x+5, gameChar_y -6,10,11);
    rect(gameChar_x-7.5,gameChar_y - 20, 5,10)
    rect(gameChar_x+2.5,gameChar_y - 20, 5,10)

    //body
    fill(255,240,0);
    ellipse(gameChar_x, gameChar_y - 30,35,30);
    ellipse(gameChar_x, gameChar_y - 50,30);
    fill(255,215,0);
    arc(gameChar_x-15,gameChar_y-40,15,20,PI/4, PI + PI/4);
    arc(gameChar_x+15,gameChar_y-40,15,20,TWO_PI - PI/4, PI - PI/4);

    //mouth
    fill(255,165,0);
    ellipse(gameChar_x, gameChar_y -45,10, 15);
    fill(255,140,0);
    ellipse(gameChar_x,gameChar_y-45,5,11)

    //eyes
    fill(0);
    ellipse(gameChar_x-5, gameChar_y -55,5);
    ellipse(gameChar_x+5, gameChar_y -55,5);
	}
    
	else
	{
    // add your standing front facing code
    //legs
    fill(255,165,0);
    rect(gameChar_x-7.5,gameChar_y - 15, 5,10)
    rect(gameChar_x+2.5,gameChar_y - 15, 5,10)
    
    //body
    fill(255,240,0);
    ellipse(gameChar_x, gameChar_y - 25,35,30);
    ellipse(gameChar_x, gameChar_y - 45,30);
    fill(255,215,0);
    arc(gameChar_x-10,gameChar_y-25,15,20,PI/4, PI + PI/4);
    arc(gameChar_x+10,gameChar_y-25,15,20,TWO_PI - PI/4, PI - PI/4);
    
    //feet
    fill(255,165,0);
    arc(gameChar_x-5, gameChar_y -5,10,10,PI, TWO_PI);
    arc(gameChar_x+5, gameChar_y -5,10,10,PI, TWO_PI);
    
    //mouth
    ellipse(gameChar_x, gameChar_y -40,15, 10);
    fill(255,140,0);
    arc(gameChar_x,gameChar_y-40,13,8,0, PI)
    
    //eyes
    fill(0);
    ellipse(gameChar_x-5, gameChar_y -50,5);
    ellipse(gameChar_x+5, gameChar_y -50,5);  
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i< clouds.length; i++)
        {
        fill(186,85,211);
        ellipse(clouds[i].x_pos-1 + 150*clouds[i].scale, clouds[i].y_pos+1 + 40, 80*clouds[i].scale);
        ellipse(clouds[i].x_pos-1 + 110*clouds[i].scale, clouds[i].y_pos+1 + 40, 60*clouds[i].scale);
        ellipse(clouds[i].x_pos-1 + 190*clouds[i].scale, clouds[i].y_pos+1 + 40, 60*clouds[i].scale);
        fill(255)
        ellipse(clouds[i].x_pos + 150*clouds[i].scale, clouds[i].y_pos + 40, 80*clouds[i].scale);
        ellipse(clouds[i].x_pos + 110*clouds[i].scale, clouds[i].y_pos + 40, 60*clouds[i].scale);
        ellipse(clouds[i].x_pos + 190*clouds[i].scale, clouds[i].y_pos + 40, 60*clouds[i].scale);
        
        }
}

// Function to draw mountains objects.
function drawMountains()
{
    for (var i = 0; i < mountains.length; i++)
    {
    
    fill(169);
    triangle(mountains[i].x_pos + 375*mountains[i].scale,
             mountains[i].y_pos + 332*mountains[i].scale,
             mountains[i].x_pos + 575*mountains[i].scale,
             mountains[i].y_pos + 332*mountains[i].scale,
             mountains[i].x_pos + 495*mountains[i].scale,
             mountains[i].y_pos + 50*mountains[i].scale);
        
    fill(169);
    triangle(mountains[i].x_pos + 300*mountains[i].scale,
             mountains[i].y_pos + 332*mountains[i].scale,
             mountains[i].x_pos + 500*mountains[i].scale,
             mountains[i].y_pos + 332*mountains[i].scale,
             mountains[i].x_pos + 400*mountains[i].scale,
             mountains[i].y_pos + 170*mountains[i].scale);
    }
}


// Function to draw trees objects.
function drawTrees()
{
    for (var i = 0; i < trees_x.length; i++)
    {
//        console.log(trees_x[i]);  
        fill(255, 131, 150);
        ellipse(trees_x[i]+39,floorPos_y-46,40);
        fill(255,182,193);
        ellipse(trees_x[i]+40,floorPos_y-47,40);
        
        fill(172,108,45);
        rect(trees_x[i]-1,floorPos_y-60,30,60);
        
        fill(205,133,63);
        rect(trees_x[i],floorPos_y-60,30,60);
        fill(255, 131, 150);
        ellipse(trees_x[i]-15,floorPos_y-59,65);
        fill(255, 131, 150);
        ellipse(trees_x[i]+19,floorPos_y-81,90);
        fill(255,182,193);
        ellipse(trees_x[i]+20,floorPos_y-82,90);
        ellipse(trees_x[i]-14,floorPos_y-60,65);
        
    }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(19,79,79);
    beginShape();
    vertex(t_canyon.x_pos-34*t_canyon.width, 432*t_canyon.width);
    vertex(t_canyon.x_pos-54*t_canyon.width, 488*t_canyon.width);
    vertex(t_canyon.x_pos-33*t_canyon.width, 504*t_canyon.width);
    vertex(t_canyon.x_pos-56*t_canyon.width, 561*t_canyon.width);
    vertex(t_canyon.x_pos-41*t_canyon.width, 580*t_canyon.width);
    vertex(t_canyon.x_pos+46*t_canyon.width, 580*t_canyon.width);
    vertex(t_canyon.x_pos+55*t_canyon.width, 546*t_canyon.width);
    vertex(t_canyon.x_pos+25*t_canyon.width, 520*t_canyon.width);
    vertex(t_canyon.x_pos+40*t_canyon.width, 482*t_canyon.width);
    vertex(t_canyon.x_pos+17*t_canyon.width, 478*t_canyon.width);
    vertex(t_canyon.x_pos+41*t_canyon.width, 432*t_canyon.width);
    endShape(CLOSE);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if((gameChar_world_x<(t_canyon.x_pos+18)) && (gameChar_world_x>(t_canyon.x_pos-15))) 
    {
        t_canyon.isPlummeting = true;
    }
    else{t_canyon.isPlummeting = false;}

    if(t_canyon.isPlummeting == true)
        {
        gameChar_y += 5;
        isFalling = true;
        }
    if((gameChar_y > floorPos_y) && ((gameChar_world_x<(t_canyon.x_pos+18)) && (gameChar_world_x>(t_canyon.x_pos-15))))
    {
        isLeft = false;
        isRight = false;
        fallingSound.play();
    } 
    
    
    
    
    if(gameChar_y > (height + 75) ){
        fallingSound.stop();
    }

}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    fill(0);
    ellipse(t_collectable.x_pos+3*t_collectable.size,
            t_collectable.y_pos+8*t_collectable.size,
            30*t_collectable.size,
            15*t_collectable.size);
    rect(t_collectable.x_pos-12*t_collectable.size,
         t_collectable.y_pos+2*t_collectable.size,
         30*t_collectable.size,
         20*t_collectable.size,
         20*t_collectable.size);
    fill(255);
    ellipse(t_collectable.x_pos+3*t_collectable.size,
            t_collectable.y_pos+6*t_collectable.size,
            30*t_collectable.size,
            15*t_collectable.size); 
}

 //Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos)<50)
        {
            t_collectable.isFound = true; 
            game_score += 1
            collectableSound.play();
        }
}

function renderFlagpole ()
{

    //torii
    push();
    fill(220,20,60);
    rect(flagpole.x_pos+50, floorPos_y-125, 25, 125);
    rect(flagpole.x_pos-50, floorPos_y-125, 25, 125);  
    rect(flagpole.x_pos, floorPos_y-135, 25, 40);  
    rect(flagpole.x_pos-75, floorPos_y-100, 175, 15);    
    rect(flagpole.x_pos-75, floorPos_y-140, 175, 15);    

    fill(0);
    rect(flagpole.x_pos+48, floorPos_y-15, 29, 15);    
    rect(flagpole.x_pos-52, floorPos_y-15, 29, 15);
    rect(flagpole.x_pos+46, floorPos_y-5, 33, 5);    
    rect(flagpole.x_pos-54, floorPos_y-5, 33, 5);  
    rect(flagpole.x_pos-80, floorPos_y-150, 185, 15);    
    arc(flagpole.x_pos-80,floorPos_y-150,25,25,HALF_PI,PI);
    arc(flagpole.x_pos+105,floorPos_y-150,25,25,0,HALF_PI);

    //flagpole
    fill(192);
    rect(flagpole.x_pos+125, floorPos_y-145, 5, 145);  
    ellipse(flagpole.x_pos+128, floorPos_y-145, 15); 
    
    if(flagpole.isReached)
        {
        //flag1
        fill(49,79,79);
        arc(flagpole.x_pos+142.5, floorPos_y-120,125,20,PI + HALF_PI, TWO_PI);
        arc(flagpole.x_pos+142.5, floorPos_y-120,125,20,0, HALF_PI);
        arc(flagpole.x_pos+210, floorPos_y-120,25,15,PI,PI + HALF_PI);
        arc(flagpole.x_pos+210, floorPos_y-120,25,15,HALF_PI, PI);

        fill(255);
        ellipse(flagpole.x_pos+152, floorPos_y-125, 5,6);
        arc(flagpole.x_pos+142.5, floorPos_y-118,115,18,0, HALF_PI);

        fill(0);
        ellipse(flagpole.x_pos+152, floorPos_y-125, 3,4);

        stroke(220);
        fill(220);
        ellipse(flagpole.x_pos+142.5, floorPos_y-120, 10,20);
        noFill();
        beginShape();
        vertex(flagpole.x_pos+142.5, floorPos_y-130);
        vertex(flagpole.x_pos+127.5, floorPos_y-120);
        vertex(flagpole.x_pos+142.5, floorPos_y-110);
        endShape();

        noStroke();
        fill(240,248, 255);
        ellipse(flagpole.x_pos+142.5, floorPos_y-120, 8,18);

        //flag2
        fill(205,92,92);
        arc(flagpole.x_pos+142.5, floorPos_y-90,105,20,PI + HALF_PI, TWO_PI);
        arc(flagpole.x_pos+142.5, floorPos_y-90,105,20,0, HALF_PI);
        arc(flagpole.x_pos+200, floorPos_y-90,20,15,PI,PI + HALF_PI);
        arc(flagpole.x_pos+200, floorPos_y-90,20,15,HALF_PI, PI);

        fill(255);
        ellipse(flagpole.x_pos+152, floorPos_y-95, 5,6);
        arc(flagpole.x_pos+142.5, floorPos_y-88,95,18,0, HALF_PI);

        fill(0);
        ellipse(flagpole.x_pos+152, floorPos_y-95, 3,4);

        stroke(220);
        fill(220);
        ellipse(flagpole.x_pos+142.5, floorPos_y-90, 10,20);
        noFill();
        beginShape();
        vertex(flagpole.x_pos+142.5, floorPos_y-100);
        vertex(flagpole.x_pos+127.5, floorPos_y-90);
        vertex(flagpole.x_pos+142.5, floorPos_y-80);
        endShape();

        noStroke();
        fill(255,228,225);
        ellipse(flagpole.x_pos+142.5, floorPos_y-90, 8,18);
        }
    
    else{
        //flag1
        fill(49,79,79);
        arc(flagpole.x_pos+142.5, floorPos_y-40,125,20,PI + HALF_PI, TWO_PI);
        arc(flagpole.x_pos+142.5, floorPos_y-40,125,20,0, HALF_PI);
        arc(flagpole.x_pos+210, floorPos_y-40,25,15,PI,PI + HALF_PI);
        arc(flagpole.x_pos+210, floorPos_y-40,25,15,HALF_PI, PI);

        fill(255);
        ellipse(flagpole.x_pos+152, floorPos_y-45, 5,6);
        arc(flagpole.x_pos+142.5, floorPos_y-38,115,18,0, HALF_PI);

        fill(0);
        ellipse(flagpole.x_pos+152, floorPos_y-45, 3,4);

        stroke(220);
        fill(220);
        ellipse(flagpole.x_pos+142.5, floorPos_y-40, 10,20);
        noFill();
        beginShape();
        vertex(flagpole.x_pos+142.5, floorPos_y-50);
        vertex(flagpole.x_pos+127.5, floorPos_y-40);
        vertex(flagpole.x_pos+142.5, floorPos_y-30);
        endShape();

        noStroke();
        fill(240,248, 255);
        ellipse(flagpole.x_pos+142.5, floorPos_y-40, 8,18);

        //flag2
        fill(205,92,92);
        arc(flagpole.x_pos+142.5, floorPos_y-10,105,20,PI + HALF_PI, TWO_PI);
        arc(flagpole.x_pos+142.5, floorPos_y-10,105,20,0, HALF_PI);
        arc(flagpole.x_pos+200, floorPos_y-10,20,15,PI,PI + HALF_PI);
        arc(flagpole.x_pos+200, floorPos_y-10,20,15,HALF_PI, PI);

        fill(255);
        ellipse(flagpole.x_pos+152, floorPos_y-15, 5,6);
        arc(flagpole.x_pos+142.5, floorPos_y-8,95,18,0, HALF_PI);

        fill(0);
        ellipse(flagpole.x_pos+152, floorPos_y-15, 3,4);

        stroke(220);
        fill(220);
        ellipse(flagpole.x_pos+142.5, floorPos_y-10, 10,20);
        noFill();
        beginShape();
        vertex(flagpole.x_pos+142.5, floorPos_y-20);
        vertex(flagpole.x_pos+127.5, floorPos_y-10);
        vertex(flagpole.x_pos+142.5, floorPos_y);
        endShape();

        noStroke();
        fill(255,228,225);
        ellipse(flagpole.x_pos+142.5, floorPos_y-10, 8,18);
        }
    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_world_x - 19 - flagpole.x_pos)
        
    if(d<15)
        {
            flagpole.isReached = true;
        }
}

function Enemy(x,y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        if (this.currentX >= this.x + this.range)
            {
                this.inc = -1;
            }
        else if(this.currentX < this.x){
            this.inc = 1;
        }
    }
    
    this.draw = function()
    {
        this.update();
         
        //
        fill(149,69,53);
        rect(this.currentX-10,this.y - 15, 10,20,5)
        rect(this.currentX,this.y - 15, 10,20,5)

        //body
        fill(149,69,53);
        ellipse(this.currentX, this.y - 25,30,40);
        fill(179,139,109);
        ellipse(this.currentX, this.y - 25,20,30);

        //arms
        fill(149,69,53);
        rect(this.currentX+12, this.y-35, 10, 20, 5);
        rect(this.currentX-22, this.y-35, 10, 20, 5);

        //head
        fill(149,69,53);
        ellipse(this.currentX, this.y - 45,35);

        //ears
        fill(149,69,53);
        arc(this.currentX+10,this.y-55,20,20, PI + PI/4,PI/4);
        arc(this.currentX-10,this.y-55,20,20, PI - PI/4,TWO_PI - PI/4);
        fill(179,139,109);
        arc(this.currentX+10,this.y-55,10,10, PI + PI/4,PI/4);
        arc(this.currentX-10,this.y-55,10,10, PI - PI/4,TWO_PI - PI/4);

        //mouth
        fill(0);
        triangle(this.currentX, this.y -40, this.currentX-2.5, this.y -45, this.currentX+2.5, this.y -45)
        stroke(0);
        line(this.currentX, this.y-40, this.currentX-4, this.y-35);
        line(this.currentX, this.y-40, this.currentX+4, this.y-35)

        //eyes
        noStroke();
        fill(0);
        ellipse(this.currentX-5, this.y -50,4);
        ellipse(this.currentX+5, this.y -50,4);
        stroke(0);
        line(this.currentX-4, this.y-52, this.currentX-10, this.y-55);
        line(this.currentX+4, this.y-52, this.currentX+10, this.y-55);
        noStroke();
    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y)
        if(d<20)
            {
                return true;
            }
            return false;
    }
}

function createPlatforms(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function(){
            fill(19,79,79);
            arc(this.x+(this.length/2), this.y+10,this.length-20,this.length-30,0, PI);
            fill(127, 255, 212);
            rect(this.x, this.y, this.length, 20, 5);
            },
        checkContact: function(gc_x, gc_y) {
        if (gc_x>this.x && gc_x<this.x +this.length)
            {
                var d = this.y - gc_y;
                if(d>=0 && d<5)
                    {
                     return true;
                    }
            }
            return false;
        }
    }
    return p;
}

function checkPlayerDie()
{
    if(gameChar_y - 75 > height)
    {
        startGame();
        if(lives>0)
        {
        lives -= 1;    
        }
    }
    if(lives<=0 || flagpole.isReached)
    {
        isLeft = false;
        isRight = false;
        isFalling = false;
        isPlummeting = false;
        isJumping = false; 
    }
    for (var i = 0; i<lives; i++)
    {
        fill(255,215,0);
        arc(856 + i*60,44,25, 25,PI, TWO_PI);
        arc(876 + i*60,44,25, 25,PI, TWO_PI);
        triangle(844.5 +i*60, 44,867 +i*60, 69, 890 +i*60, 44)
        
        fill(238,105,105);
        arc(854 + i*60,45,25, 25,PI, TWO_PI);
        arc(874 + i*60,45,25, 25,PI, TWO_PI);
        triangle(841.5 +i*60, 45,864 +i*60, 70, 887 +i*60, 45)
    }
    
}

function startGame()
{
    //    console.log(floorPos_y)
	gameChar_x = width/5;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos; 

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    isJumping = false;

	// Initialise arrays of scenery objects.
    trees_x = [103, 397,801,1104,1434,1778, 2398,2774,3102,3534,3890, 4357, 4590];
    clouds = [
        {x_pos: 32, y_pos: 129, scale: 1.26},
        {x_pos: 450, y_pos: 45, scale: 0.74},
        {x_pos: 678, y_pos: 81, scale: 0.63},
        {x_pos: 1049, y_pos: 106, scale: 0.79},
        {x_pos: 1523, y_pos: 164, scale: 0.7},
        {x_pos: 1867, y_pos: 200, scale: 0.82},
        {x_pos: 2254, y_pos: 102, scale: 0.9},
        {x_pos: 2485, y_pos: 167, scale: 1.04},
        {x_pos: 2635, y_pos: 80, scale: 0.7},
        {x_pos: 2837, y_pos: 177, scale: 1},
        {x_pos: 3164, y_pos: 96, scale: 0.63},
        {x_pos: 3312, y_pos: 126, scale: 0.75},
        {x_pos: 3571, y_pos: 173, scale: 0.67},
        {x_pos: 3924, y_pos: 141, scale: 0.87},
        {x_pos: 4093, y_pos: 62, scale: 0.84},
        {x_pos: 4348, y_pos: 179, scale: 0.64},        
    ];
    
    mountains = [
        {x_pos: -345, y_pos: 100, scale: 1},
        {x_pos: 480, y_pos: 100, scale: 1},
        {x_pos: 1290, y_pos: 100, scale: 1},
        {x_pos: 1807, y_pos: 100, scale: 1},
        {x_pos: 2550, y_pos: 100, scale: 1},
        {x_pos: 3270, y_pos: 100, scale: 1},
        {x_pos: 4050, y_pos: 100, scale: 1},
    ];
    
    collectables = [
        {x_pos: 450, y_pos: floorPos_y - 40, size: 1, isFound: false},
        {x_pos: 738, y_pos: floorPos_y - 80, size: 1, isFound: false},
        {x_pos: 1287, y_pos: floorPos_y - 40, size: 1, isFound: false},
        {x_pos: 1587, y_pos: floorPos_y - 40, size: 1, isFound: false},
        {x_pos: 1803, y_pos: floorPos_y - 40, size: 1, isFound: false},
        {x_pos: 2489, y_pos: floorPos_y - 80, size: 1, isFound: false},
        {x_pos: 2776, y_pos: floorPos_y - 40, size: 1, isFound: false},
        {x_pos: 3576, y_pos: floorPos_y - 80, size: 1, isFound: false},
        {x_pos: 3935, y_pos: floorPos_y - 80, size: 1, isFound: false},
        {x_pos: 4293, y_pos: floorPos_y - 40, size: 1, isFound: false}
    ];
    
    canyons = [
        {x_pos: 549, width: 1, isPlummeting: false},
        {x_pos: 1252, width: 1, isPlummeting: false},
        {x_pos: 1762, width: 1, isPlummeting: false},
        {x_pos: 2463, width: 1, isPlummeting: false},
        {x_pos: 2987, width: 1, isPlummeting: false},   
         {x_pos: 3560, width: 1, isPlummeting: false},
        {x_pos: 4065, width: 1, isPlummeting: false}
    ];
    
    platforms = [];
    
    platforms.push(createPlatforms(300,floorPos_y - 100,100));
    platforms.push(createPlatforms(1500,floorPos_y - 100,120));
    platforms.push(createPlatforms(2750,floorPos_y - 100,120));
    platforms.push(createPlatforms(1024,floorPos_y - 100,100));
    platforms.push(createPlatforms(1825,floorPos_y - 100,120));
    platforms.push(createPlatforms(2287,floorPos_y - 100,120));
    platforms.push(createPlatforms(3529,floorPos_y - 100,100));
    platforms.push(createPlatforms(4180,floorPos_y - 100,100));
    platforms.push(createPlatforms(3626,floorPos_y - 100,120));
    
    game_score = 0;
    
    flagpole = {isReached: false, x_pos: 4500};
    
    enemies = [];
    enemies.push(new Enemy(350, floorPos_y -10, 100));
    enemies.push(new Enemy(1520, floorPos_y -10, 100));
    enemies.push(new Enemy(2594, floorPos_y -10, 100));
    enemies.push(new Enemy(1832, floorPos_y -10, 100));
    enemies.push(new Enemy(1084, floorPos_y -10, 100));
    enemies.push(new Enemy(3180, floorPos_y -10, 100));
    enemies.push(new Enemy(4128, floorPos_y -10, 100));
    
}
