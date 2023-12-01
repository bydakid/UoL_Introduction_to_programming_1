
// This is my final game project. I had a lot of fun learning to code this project.
// There were bits I found more complicated to understand, like the platform concept I found it quite hard to understand and the reason for using this technique.
// I learned a lot about variables and how useful it is. This helped me a lot to simplify my code when it gets too long and to fetch a variable easily. 
// I also tried to use variables that are easy to understand so I can recongnise easily what this variable belongs to.
// I also learned a lot about how functions work and how I can create them myself which I then can call in my project. 
// I realized that function is a very strong tool in coding because this gives the command for certain things to do the things you want. 

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var collectables;
var canyons;
var platforms;
var enemies;
 
var game_score;
var flagpole;
var lives;
var jumpSound;


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
	lives = 3;
	startGame();
}


function preload()
{	
	//sound effect
    soundFormats('mp3', 'wav');
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.2);
}


function startGame()
{
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	scrollPos = 0;
	gameChar_world_x = gameChar_x - scrollPos;
	game_score = 0;

	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	isFound = false;

	trees_x = [-2000,-1100,-900,-50,350,1350,1000,2000];
    
	clouds = [
        {x_pos: 100, y_pos: 170, size: 90},
        {x_pos: 600, y_pos: 100, size: 100},
        {x_pos: 800, y_pos: 200, size: 90},
		{x_pos: -200, y_pos: 150, size: 90},
		{x_pos: 1300, y_pos: 100, size: 90},
		{x_pos: -600, y_pos: 100, size: 90},
		{x_pos: -900, y_pos: 120, size: 80},
		{x_pos: -1300, y_pos: 90, size: 100},
		{x_pos: -1600, y_pos: 100, size: 90},
		{x_pos: -1800, y_pos: 100, size: 90}];
	
	mountains = [
		{x_pos: -300, width: 232},
		{x_pos: 1600, width: 232},
		{x_pos: -500, width: 232},
		{x_pos: -1900, width: 232}];
	
	canyons = [
		{x_pos: 650, y_pos: floorPos_y},
		{x_pos: 1200, y_pos: floorPos_y},
		{x_pos: -750, y_pos: floorPos_y},
		{x_pos: -1500, y_pos: floorPos_y},
		{x_pos: -1560, y_pos: floorPos_y},
		{x_pos: -1610, y_pos: floorPos_y},
		{x_pos: -1660, y_pos: floorPos_y},
		{x_pos: -1710, y_pos: floorPos_y},];
	
	collectables = [
		{x_pos: 950, y_pos: 400, size: 30, isFound : false},
		{x_pos: 200, y_pos: 310, size: 30, isFound : false},
		{x_pos: 150, y_pos: 310, size: 30, isFound : false},
		{x_pos: 100, y_pos: 310, size: 30, isFound : false},
		{x_pos: 400, y_pos: 410, size: 30, isFound : false},
		{x_pos: 50, y_pos: 410, size: 30, isFound : false},
		{x_pos: 1300, y_pos: 410, size: 30, isFound : false},
		{x_pos: -800, y_pos: 410, size: 30, isFound : false}];

	platforms = [];
	platforms.push(createPlatforms(50,floorPos_y - 80, 200));
	platforms.push(createPlatforms(625 ,floorPos_y - 35, 125));

	enemies = [];
	enemies.push(new Enemy(100, floorPos_y - 10, 100));

	flagpole = {isReached: false, x_pos: 1800};
}


function draw()
{
	background(100, 155, 255); 
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); 

	push();

    translate(scrollPos,0);
	drawClouds();
	drawMountains();
	drawTrees();
	renderFlagpole();
	checkPlayerDie();

	for(var i = 0; i < platforms.length; i++)
	{
		platforms[i].draw();
	}

	for(var i = 0; i < canyons.length; i++)
	{
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}

	for(var i = 0; i < collectables.length; i++)
	{	
		if(!collectables[i].isFound)
		{
			drawCollectable(collectables[i]);
			checkCollectable(collectables[i]);
		}
	}

	if (isPlummeting == true) 
	{
		gameChar_y +=5;
	}

	for(var i = 0; i < enemies.length; i++)
	{
		enemies[i].draw();

		var isContact = enemies[i].checkContact(gameChar_world_x,gameChar_y);
		if(isContact)
		{
			if(lives > 0)
			{
				lives -= 1;
				startGame();
				break;
			}
		}
	}

	pop();

	drawGameChar();
	drawScoreText();
	drawRemainingLives();
	gameChar_world_x = gameChar_x - scrollPos;

	if(lives < 1)
	{
		push();
		textSize(40);
		fill(255,0,0)
		text("GAME OVER. Refresh the page to continue.", width/2 - 400, height/2 - 100);
		pop();

		return;
	}
	
	if(flagpole.isReached)
	{
		push();
		textSize(40);
		fill(0,255,0);
		text("Level complete. Refresh the page to restart.", width/2 - 400, height/2 - 100);
		pop();
		
		return;
	}

	if(!flagpole.is)
	{
		checkFlagpole();
	}
	
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 3;
		}
		else
		{
			scrollPos += 4;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{	
			gameChar_x  += 3;
		}
		else
		{
			scrollPos -= 4;
		}
	}

	if(gameChar_y < floorPos_y)
	{
		var isContact = false;
		for(var i = 0; i < platforms.length; i++)
		{
			if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
			{
				isContact = true;
				break;
			}
		}
		if(isContact == false)
		{
			gameChar_y += 2;
			isFalling = true;
		}
			
	}

	else
		{
			isFalling = false;
	}
}


function keyPressed(){
	
	// move left
	if(keyCode == 37)
    {
        isLeft = true;
		isRight = false;
    }
	
	// move rigth
    if(keyCode == 39)
    {
        isRight = true;
		isLeft = false;
    }

	// stop move
	if(keyCode == 40)
	{
		isRight = false;
		isLeft = false;
	}

	// jump
	if(keyCode == 32)
	{
		if(gameChar_y == floorPos_y)
		{
			gameChar_y -= 100;
            jumpSound.play();
		}
	}

}


function drawGameChar()
{
	if(isLeft && isFalling)
	{
		fill(155,0,0);
		ellipse(gameChar_x,gameChar_y - 25,30,50);
		ellipse(gameChar_x - 20,gameChar_y - 30,15,30)
		fill(200,150,150);
		ellipse(gameChar_x,gameChar_y - 60,30,35);
		fill(0);
		ellipse(gameChar_x - 10, gameChar_y - 60,10,15);
		ellipse(gameChar_x - 10,gameChar_y - 5,10,15);
		ellipse(gameChar_x + 10,gameChar_y - 5,10,15);
		fill(200);
		ellipse(gameChar_x - 10, gameChar_y - 60,5,5);
	}

	else if(isRight && isFalling)
	{
		fill(155,0,0);
		ellipse(gameChar_x, gameChar_y - 25,30,50);
		ellipse(gameChar_x + 20, gameChar_y - 30,15,30);
		fill(200,150,150);
		ellipse(gameChar_x, gameChar_y - 60,30,35);
		fill(0);
		ellipse(gameChar_x + 10, gameChar_y - 60,10,15);
		ellipse(gameChar_x - 10,gameChar_y - 5,10,15);
		ellipse(gameChar_x + 10,gameChar_y - 5,10,15); 
		fill(200);
		ellipse(gameChar_x + 10, gameChar_y - 60,5,5);
	}

	else if(isLeft)
	{
		fill(155,0,0);
		ellipse(gameChar_x,gameChar_y - 25,30,50);
		ellipse(gameChar_x - 20,gameChar_y - 35,30,10);
		ellipse(gameChar_x - 20,gameChar_y - 25,30,10);
		fill(200,150,150);
		ellipse(gameChar_x,gameChar_y - 60,30,35);
		fill(0);
		ellipse(gameChar_x - 10, gameChar_y - 60,10,15);
		ellipse(gameChar_x - 10, gameChar_y - 5,15,10);
		ellipse(gameChar_x + 10, gameChar_y - 5,15,10);
		fill(200);
		ellipse(gameChar_x - 10, gameChar_y - 60,5,5);
	}

	else if(isRight)
	{
		fill(155,0,0);
		ellipse(gameChar_x, gameChar_y - 25,30,50);
		ellipse(gameChar_x + 20, gameChar_y - 35,30,10);
		ellipse(gameChar_x + 20, gameChar_y - 25,30,10);
		fill(200,150,150);
		ellipse(gameChar_x, gameChar_y - 60,30,35);
		fill(0);
		ellipse(gameChar_x + 10, gameChar_y - 60,10,15);
		ellipse(gameChar_x - 10, gameChar_y - 5,15,10);
		ellipse(gameChar_x + 10, gameChar_y - 5,15,10);
		fill(200);
		ellipse(gameChar_x + 10, gameChar_y - 60,5,5);
	}

	else if(isFalling || isPlummeting)
	{
		fill(155,0,0);
		ellipse(gameChar_x,gameChar_y - 25,30,50);
		ellipse(gameChar_x + 20,gameChar_y - 30,15,30);
		ellipse(gameChar_x - 20,gameChar_y - 30,15,30);
		fill(200,150,150);
		ellipse(gameChar_x,gameChar_y - 60,25,35);
		fill(0);
		ellipse(gameChar_x - 4,gameChar_y - 60,20,15);
		ellipse(gameChar_x + 4,gameChar_y - 60,20,15);
		ellipse(gameChar_x - 10,gameChar_y - 5,10,15);
		ellipse(gameChar_x + 10,gameChar_y - 5,10,15);
		fill(200);
		ellipse(gameChar_x + 8,gameChar_y - 60,8,8);
		ellipse(gameChar_x - 8,gameChar_y - 60,8,8);  
	}

	else
	{
		fill(155,0,0);
		ellipse(gameChar_x,gameChar_y - 25,30,50);
		ellipse(gameChar_x + 20,gameChar_y - 30,30,15);
		ellipse(gameChar_x - 20,gameChar_y - 30,30,15);
		fill(200,150,150);
		ellipse(gameChar_x,gameChar_y - 60,35);
		fill(0);
		ellipse(gameChar_x - 8,gameChar_y - 60,20,15);
		ellipse(gameChar_x + 8,gameChar_y - 60,20,15);
		ellipse(gameChar_x - 10,gameChar_y - 5,15,10);
		ellipse(gameChar_x + 10,gameChar_y - 5,15,10);
		fill(200);
		ellipse(gameChar_x + 8,gameChar_y - 60,8,8);
		ellipse(gameChar_x - 8,gameChar_y - 60,8,8);
	}
}


function drawMountains()
{
	for(var i = 0; i < mountains.length; i++)
	{
		fill(80,84,62);
		triangle(				
			mountains[i].x_pos - 140, mountains[i].width + 200,
			mountains[i].x_pos, mountains[i].width +30,
			mountains[i].x_pos + 80, mountains[i].width +200);
		triangle(				
			mountains[i].x_pos - 40, mountains[i].width+ 200,
			mountains[i].x_pos + 120, mountains[i].width - 100,
			mountains[i].x_pos + 180, mountains[i].width +200);
		fill(230,250,255);
		triangle(
			mountains[i].x_pos - 32, mountains[i].width+ 70,
			mountains[i].x_pos + 10, mountains[i].width + 10,
			mountains[i].x_pos + 13, mountains[i].width + 60)
		beginShape();
		vertex(mountains[i].x_pos + 93, mountains[i].width- 50);
		vertex(mountains[i].x_pos + 125, mountains[i].width- 70);
		vertex(mountains[i].x_pos + 120, mountains[i].width- 100);
		endShape();
	}
}


function drawClouds()
{
	for(var i = 0; i < clouds.length; i++)
    {
        fill(250,250,250)
        ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].size);
        ellipse(clouds[i].x_pos + 60, clouds[i].y_pos, clouds[i].size - 20);
        ellipse(clouds[i].x_pos + 110, clouds[i].y_pos, clouds[i].size - 50);
    }
}


function drawTrees()
{
	for(var i = 0; i < trees_x.length; i++)
        {
            fill(150,75,0);
            rect(trees_x[i], -200/2 + floorPos_y,40,100);
            fill(0,102,0);
            triangle(
                trees_x[i] - 40, -100 + floorPos_y,
                trees_x[i] + 20, -200 + floorPos_y,
                trees_x[i] + 80, -100 + floorPos_y);
            triangle(
                trees_x[i] - 60, -50 + floorPos_y,
                trees_x[i] + 20, -150 + floorPos_y,
                trees_x[i] + 100, -50 + floorPos_y);
			ellipse(trees_x[i] + 20, floorPos_y - 190, 20, 40);
        }
}


function drawCanyon(t_canyon)
{
	fill(100,0,0);
	rect(t_canyon.x_pos, t_canyon.y_pos, 80,200);
	fill(100, 155, 255);
	rect(t_canyon.x_pos + 10, t_canyon.y_pos, 60,130);
	fill(100,0,0);
	triangle(
		t_canyon.x_pos + 20,t_canyon.y_pos + 100,
		t_canyon.x_pos + 50,t_canyon.y_pos+ 150,
		t_canyon.x_pos,t_canyon.y_pos+ 150);
	triangle(
		t_canyon.x_pos + 50,t_canyon.y_pos + 100,
		t_canyon.x_pos + 80,t_canyon.y_pos+ 150,
		t_canyon.x_pos + 20,t_canyon.y_pos+ 150);
	fill(202,0,0);
	triangle(
		t_canyon.x_pos + 20,t_canyon.y_pos + 100,
		t_canyon.x_pos + 37,t_canyon.y_pos+ 125,
		t_canyon.x_pos + 12,t_canyon.y_pos+ 120);
	triangle(
		t_canyon.x_pos + 50,t_canyon.y_pos + 100,
		t_canyon.x_pos + 62,t_canyon.y_pos+ 120,
		t_canyon.x_pos + 41,t_canyon.y_pos+ 115);
}


function checkCanyon(t_canyon)
{
	if(gameChar_world_x > t_canyon.x_pos -30 && gameChar_world_x < t_canyon.x_pos + 100 && gameChar_y >= floorPos_y)
	{
		isPlummeting = true;
	}
}


function drawCollectable(t_collectable)
{
	if(t_collectable.isFound == false)
	{
		fill(250,200,10);
		ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size);
		fill(100, 155, 255);
		ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size - 40);
	}
}


function checkCollectable(t_collectable)
{
	if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos,t_collectable.y_pos) < 50)
	{
		t_collectable.isFound = true;
		game_score += 1;
	}
}


function renderFlagpole()
{	
	push();

	stroke(200);
	strokeWeight(5);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
	fill(255,173,105);
	noStroke();
	
	if(flagpole.isReached)
		{
			rect(flagpole.x_pos, floorPos_y - 250, 70, 50);
			fill(32,32,232);
			ellipse(flagpole.x_pos + 35,floorPos_y - 230, 40,20);
			fill(255,255,0);
			ellipse(flagpole.x_pos + 35,floorPos_y - 210, 50,10);
		}
	else
		{
			rect(flagpole.x_pos, floorPos_y - 50, 70, 50);
			fill(32,32,232);
			ellipse(flagpole.x_pos + 35,floorPos_y - 30, 40,20);
			fill(255,255,0);
			ellipse(flagpole.x_pos + 35,floorPos_y - 10, 50,10);
		}
	
	pop(); 
}


function checkFlagpole()
{
	var d = abs(gameChar_world_x - flagpole.x_pos);

	if(d < 15)
	{
		flagpole.isReached = true;
	}
}


function drawScoreText()
{
	push();
	text("Score: " + game_score,20,50);
	pop();
}


function checkPlayerDie()
{	
	if(gameChar_y >= height + 50)
	{
		lives -= 1;

		if(lives > 0)
		{
			startGame();
		}
	}
}


function drawRemainingLives()
{
	push();
	text("Lives left :", 20,90);
	pop();

	for(var i = 0; i < lives; i++)
	{
		let x_offset = 50 + i * 60;
		let y_position = 140;

		fill(250,107,170);
		ellipse(x_offset + 70,y_position - 65, 22, 30);
		ellipse(x_offset + 50,y_position - 65, 22, 30);
		triangle(
			x_offset + 39,y_position - 60,
			x_offset + 81,y_position - 60,
			x_offset + 60,y_position - 30
		)
	}
}


function createPlatforms(x, y, length)
{
	var p = {
		x: x,
		y: y,
		length: length,
		draw: function()
		{
			fill(204,254,255);
			rect(this.x, this.y, this.length, 10);
		},
		checkContact: function(gameChar_x,gameChar_y)
		{
			if(gameChar_x > this.x && gameChar_x < this.x + this.length)
			{
				var d = this.y - gameChar_y;
				if(d >= 0 && d < 5)
				{
					return true;
				}
			}
			return false;
		}
	}
	return p;
}


function Enemy(x, y, range)
{
	this.x = x;
	this.y = y;
	this.range = range;
	
	this.currentX = x;
	this.inc = 1;

	this.update = function()
	{
		this.currentX += this.inc;

		if(this.currentX >= this.x + this.range)
		{
			this.inc = -1;
		}

		else if(this.currentX < this.x)
		{
			this.inc = 1;
		}
	}

	this.draw = function()
	{
		this.update();
		// body
		fill(255,0,0);
		ellipse(this.currentX, this.y-10, 40, 40);
		rect(this.currentX + 10, this.y - 20, 20,10)
		fill(255,200,0);
		ellipse(this.currentX, this.y-10, 20, 40);
		
		// head
		fill(254,163,122);
		ellipse(this.currentX, this.y - 30, 30, 30);
		fill(25,0,0);
		ellipse(this.currentX, this.y-5, 10, 10);
		ellipse(this.currentX - 5, this.y - 30, 6, 7);
		ellipse(this.currentX + 5, this.y - 30, 6, 7);

		// weapon
		fill(129,66,50);
		rect(this.currentX + 30, this.y - 40, 5,50);
		fill(215,215,225);
		triangle(
			this.currentX + 20, this.y - 25,
			this.currentX + 33, this.y - 50,
			this.currentX + 45, this.y - 25)
		
	}

	this.checkContact = function(gameChar_x,gameChar_y)
	{
		var d = dist(gameChar_x, gameChar_y, this.currentX, this.y)

		if(d < 20)
		{
			return true;
		}

		return false;
	}
}
