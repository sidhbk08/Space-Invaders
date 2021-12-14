let flag=1; 
let flagL=1;
let flaghard;

//Restart button triggers location.reload() which reloads the current url
function restart(){
    location.reload();
    return false;
}

let enemy_y=0;

function easy(){
    document.getElementById("easy").className="buttons active";
    document.getElementById("easy").onkeydown = function (e) {return false;};
    document.getElementById("easy").style.pointerEvents='none';
    document.getElementById("hard").style.pointerEvents='none';
}

function hard(){
    document.getElementById("hard").className="buttons active";
    document.getElementById("hard").onkeydown = function (e) {return false;};
    document.getElementById("hard").style.pointerEvents='none';
    document.getElementById("easy").style.pointerEvents='none';
    flaghard=0;
}

function hardfunc(){
    let upY=setInterval(updateY,1000);
    function updateY()
    {
        for(var i=0; i<STATE.enemies.length; i++){
            var enemy=STATE.enemies[i];
            enemy.y+=3;
            if(enemy.y>=450){
                clearInterval(upY);
                clearInterval(create_enemylaser);
                flagL=0;
                self_explosion.play(); //Trigger the destroy ship sound
                document.getElementById("countdown").style.fontSize="40px";
                document.getElementById("countdown").style.display="inline";
                document.getElementById("countdown").style.left="40%";
                document.getElementById("countdown").innerHTML="You Lost! Restart"; //Set the screen to You Lost
                flag=0;
            }
        }
    }
}

//This function handles the theme music as the page loads each time
document.getElementById("theme_song").play();


/*Choosing 3 ships using event listeners*/
document.getElementById("ship1").addEventListener("click",function(){
    chooseShip("/images/ship1.png");}
    );
document.getElementById("ship2").addEventListener("click",function(){
    chooseShip("/images/ship2.png");}
    );
document.getElementById("ship3").addEventListener("click",function(){
    chooseShip("/images/ship3.png");}
    );
/*-------------------------------------*/


//Function created to replace the chosen ship as the current ship
function chooseShip(spaceship){    
    document.getElementById("curShip").src=spaceship;
}

let playerShip = document.querySelector("#curShip");

/*-------------------------------------------------*/


//----variable declaration----'
const STATE = {
    lasers: [], //Stores the location of player laser as object
    enemyLasers: [], //Stores the location of enemy laser as object
    enemies : [], //Stores the location of enemy as object
    number_of_enemies: 27, //Stores the number of enemies spawned in the beginning as object
    lives: 3, //Stores lives of player's ship throughout the game.
    shipSpeed: 8 //stores the 
}
var x = 500; //Stores the intial x axis position of the ship in pixels
var y = 5; //Stores the intial y axis position of the ship in pixels

/*-------------------------------------------------*/




    //--------Creation of audio objects.----'

var shooting = new Audio("../audio/lasershoot.mp3");
var self_explosion = new Audio("../audio/disintegrate.mp3");
var alienlaser = new Audio("../audio/enemylaser.mp3");
var alienexplosion = new Audio("../audio/enemyexplosion.mp3")

/*-------------------------------------------------*/



        /*---------The Start Function-------*/
function start(){
    countdown(); //Calling the countdown fucntion
    document.getElementById("start").style.pointerEvents='none';    
    document.getElementById("easy").style.pointerEvents='none';
    document.getElementById("hard").style.pointerEvents='none';
    document.getElementById("start").onkeydown = function (e) {return false;}; //Function e ensures that keyboard input on start is ignored
}
    /*-------------------------------------------------*/




            //---------The Movement Tech--------'

let Keys = {
    left: false, //Stores the left arrow key as boolean object
    right: false, //Stores the right arrow key as boolean object
    space: false //Stores the space arrow key as boolean object
};


function move(){

    if(Keys.left) {
    /*If the left key is pressed the boolean becomes true and
    the following expression is executed*/
       if(x > 10){
        x -= STATE.shipSpeed; 
        document.getElementById("curShip").style.left = x + "px";
       }
    }

    if(Keys.right){
    /*If the right key is pressed the boolean becomes true and
    the following expression is executed*/
        if(x < 997)
        x += STATE.shipSpeed;
        document.getElementById("curShip").style.left = x + "px";
    }
}
         /*-------------------------------------------------*/
         



                 /*--------Countdown to begin the game--------*/
let create_enemylaser;
function countdown(){
    var i=6; //Variable that stores the counter 
    var id=setInterval(cd,1000); //Calling the countdown function every 1 second

    /*---------------The Countdown Fucntion----------*/
    function cd(){
        if(i==0){
            /*If the counter turns to 0 display the begin game message*/
            document.getElementById("countdown").style.left="43%";
            document.getElementById("countdown").innerHTML="Go!!";
            create_enemylaser = setInterval(createEnemyLaser,500);
            i--; //To ensure the counter now has -1 as that will be used as a condition to run the game
            if(flaghard==0){
                hardfunc();
            }
        }
        else if(i<0){
            //Clear the Countdown
            clearInterval(id);
            document.getElementById("countdown").style.display="none";

            //Remove the pointer events from ships
            document.getElementById("ships").style.pointerEvents="none";

            //Start the Movement KeyListeners
            document.addEventListener("keydown",function(e){

                /*Used multiple if conditions instead of switch case to listen
                for multiple events at once. Like moving the ship and firing at the same time.
                In future could also add diagonal movements*/
                
                var keycode = e.code;
                if(keycode == "ArrowLeft") Keys.left = true;
                if(keycode == "ArrowRight") Keys.right = true;
                if(keycode == "Space"){Keys.space = true;}
                if(flag==1)
                    move();
            });
           
            document.addEventListener("keyup",function(e){

                /*Keyup Event Listener to ensure that movement stop when the key is released
                or in case of Space the laser is fired*/

                var keycode = e.code;
                if(keycode == "ArrowLeft") Keys.left = false;
                if(keycode == "ArrowRight") Keys.right = false;
                if(keycode == "Space"){
                    Keys.space = false; 
                    shooting.play(); //Playing the ship shoot laser sound
                    if(flag==1) createLaser(); //To check the gameover condition is not triggered otherwise user can shoot lasers
                }
           });
        }
           
        else if(i>3){
            /*Decrement the countdown*/ 
            document.getElementById("countdown").style.marginLeft="5%";
            document.getElementById("countdown").style.fontSize="25px";
            document.getElementById("countdown").innerHTML="USE LEFT AND RIGHT ARROW KEYS TO MOVE AND SPACEBAR TO SHOOT";
            i--;
        }
        else{
            document.getElementById("countdown").style.left="47%";
            document.getElementById("countdown").style.top="40%";
            document.getElementById("countdown").style.fontSize="100px";
            document.getElementById("countdown").innerHTML=i;
            i--;
        }
    }
}
/*----------------------------------------------------------*/

/*-------------The Enemy Tech------------*/


let update_enemy =  setInterval(updateEnemies,10); //Calling the function to update the position of the enemies

 function createEnemyLaser()
 {
     /*Function to create the enemy laser on random enemy locations*/

     var index=Math.floor(Math.random()*(STATE.number_of_enemies)); //Generate a random index

     if(STATE.number_of_enemies>0)
     {
         /*If the enemies are greater than 0 then execute the following expression*/

         /*Generate a enemy laser using img*/
         const $enemylaser = document.createElement("img");
         $enemylaser.src = "images/enemyLaser.png";
         $enemylaser.className = "enemyLaser";
         alienlaser.play(); // Play sound when the enemy laser is created

         gameArea.appendChild($enemylaser); //Add the img to the gameArea in HTML

         /*Enemy is an object which contains their respective class, x and y postion*/
         var enemy=STATE.enemies[index];
         var x=enemy.cur_x+180;
         var y=enemy.cur_y;
         var enemylaser={x,y,$enemylaser};

         STATE.enemyLasers.push(enemylaser);
         $enemylaser.style.transform=`translate(${x}px,${y}px)`;
     }
 }

function setPosition(enemy, x, y) {
    /*Update the position of the enemy using transform where x = x + 180 
    as we want the enemies on 180px right of the game area*/
    enemy.style.transform = `translate(${x+180}px, ${y}px)`;
}

function createEnemy(gameArea, x, y){
    /*Create enemy as img*/
    const $enemy = document.createElement("img");
    var cur_x = x;
    var cur_y = y;
    $enemy.src = "/images/alien1.png";
    $enemy.className = "enemy";
    gameArea.appendChild($enemy); //Add the enemy to the gameArea in HTML
    const enemy = {x, y, $enemy, cur_x, cur_y}; /*Pushing the enemy to the enemies array as they are created*/
    STATE.enemies.push(enemy);

    /*Positioning the enemy created in the gameArea*/
    setPosition($enemy, x, y);
}

function updateEnemies()
{
    /*Applying the parametric Equation of ellipse to create the motion of the enemies*/
    const dx = 70*Math.cos(Date.now()/1000);
    const dy = 40*Math.sin(Date.now()/1000);
    const enemies = STATE.enemies;

    for (let i = 0; i < enemies.length; i++){
        const enemy = enemies[i];
        var a = enemy.x + dx; //a is the locus of the ellipse
        var b = enemy.y + dy; //b is the locus of the ellipse
        enemy.cur_x=a;
        enemy.cur_y=b;
        setPosition(enemy.$enemy, a, b); 
    }
}

function createEnemies(gameArea) {
    /*Creating the enemies one row at a time*/
    for(var i = 0; i < STATE.number_of_enemies/3; i++){
      createEnemy(gameArea, i*80, 100);
    } 
    for(var i = 0; i < STATE.number_of_enemies/3; i++){
      createEnemy(gameArea, i*80, 180);
    }
    for(var i = 0; i < STATE.number_of_enemies/3; i++){
        createEnemy(gameArea, i*80, 260);
    }
}

const gameArea = document.querySelector("#gameArea"); //Storing gameArea
createEnemies(gameArea);

/*----------------------------------------------------------*/


        /*----------The Laser Tech----------*/

/*Continuously Updating the Ship Laser and the Enemy Laser*/
let update_laser = setInterval(updateLaser,4);
let update_EnemyLaser = setInterval(updateEnemyLaser,10);

function createLaser(){

    /*The Space Bar triggers the createLaser function and this is where the magic happens*/
    const $laser = document.createElement("img");
    $laser.src = "images/laser.png";
    $laser.className = "laser";
    gameArea.appendChild($laser);

    var y=470; //y denotes the location on the y-axis where the lasers will be spawned
    var laser={x,y,$laser};
    STATE.lasers.push(laser);
    $laser.style.transform=`translate(${x}px,${y}px)`;
}

/*traverse all lasers in the array and decrement y
delete the laser when it reaches the top
delete the enemy and the laser when the laser and enemy collides
if number of enemies=0 player will win
*/
function updateLaser(){
    for (let i = 0; i < STATE.lasers.length; i++)
    {
        const laser = STATE.lasers[i];
        laser.y-=2;
        laser.$laser.style.transform=`translate(${laser.x}px,${laser.y}px)`;
        if(laser.y<=0)
            deleteLaser(STATE.lasers,laser,laser.$laser);
        const laser_rectangle = laser.$laser.getBoundingClientRect();
        for(let j = 0; j < STATE.enemies.length; j++){
            const enemy = STATE.enemies[j];
            const enemy_rectangle = enemy.$enemy.getBoundingClientRect();
            if(collideRect(enemy_rectangle, laser_rectangle)){
                alienexplosion.play();
                deleteLaser(STATE.lasers, laser, laser.$laser);
                const index = STATE.enemies.indexOf(enemy);
                STATE.enemies.splice(index,1);
                gameArea.removeChild(enemy.$enemy);
                STATE.number_of_enemies--;
                score();
            }
        }
        if(STATE.number_of_enemies==0)
            win();
    }
}

function score(){
    document.getElementById("score").innerHTML=27-STATE.number_of_enemies+"/27";
}

function deleteLaser(lasers, laser, $laser){
    const index = lasers.indexOf(laser);
    lasers.splice(index,1);
    gameArea.removeChild($laser);
}

function updateEnemyLaser(){
    for (let i = 0; i < STATE.enemyLasers.length; i++){
        var laser = STATE.enemyLasers[i];
        laser.y+=2;
        laser.$enemylaser.style.transform=`translate(${laser.x}px,${laser.y}px)`;
        if(laser.y>=490)
            deleteLaser(STATE.enemyLasers,laser,laser.$enemylaser);
        const enemylaserrect=laser.$enemylaser.getBoundingClientRect();
        const shiprect=document.getElementById("curShip").getBoundingClientRect();
        if(collideRect(enemylaserrect,shiprect)){
            deleteLaser(STATE.enemyLasers, laser, laser.$enemylaser);
            lives();
        }
    }
}

/*The AABB algorithm used to calculate the collisiton*/
function collideRect(rect1, rect2){
    return!(rect2.left > rect1.right || 
      rect2.right < rect1.left || 
      rect2.top > rect1.bottom || 
      rect2.bottom < rect1.top);
}



/*--------------The Game Condition Tech----------*/

function lives(){
    //The Fucntion calculates the amount of lives left
    if(STATE.lives>0){
        document.getElementById(`star${STATE.lives}`).style.display="none";
        STATE.lives--;
    }
    else{
        //Triggered when the lives become 0 
        self_explosion.play(); //Trigger the destroy ship sound
        document.getElementById("countdown").style.fontSize="40px";
        document.getElementById("countdown").style.display="inline";
        document.getElementById("countdown").style.left="40%";
        document.getElementById("countdown").innerHTML="You Lost! Restart"; //Set the screen to You Lost
        flag=0;
        clearInterval(update_laser);
        document.querySelectorAll('.laser').forEach(e => e.remove());
        if(flaghard==0) clearInterval(upY);
    }
}

/*Its Navratri so Winner Winner Paneer Dinner*/
function win(){
    document.getElementById("countdown").style.display="inline";
    document.getElementById("countdown").style.fontSize="40px";
    document.getElementById("countdown").style.left="40%";
    document.getElementById("countdown").innerHTML="You Won! Restart"; //Set the screen to You Won
    flag=0;
    clearInterval(update_EnemyLaser);
    document.querySelectorAll('.enemyLaser').forEach(e => e.remove());
}
