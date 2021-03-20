"use strict";
let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth*0.98;
canvas.height = window.innerHeight*0.98;
let c = canvas.getContext('2d');
const miniMapX=canvas.width-200;
const miniMapY=200;
let profileVisible = false;
let inventoryVisible = false;
let xpBar = new Image();
xpBar.src = "xpbar.png"
let sword = new Image();
sword.src = "sword.png"
let gold = new Image();
gold.src = "gold.png"
let profilePic = new Image(); profilePic.src = "profile.png";
let inventoryPic = new Image(); inventoryPic.src = "inventory.png";
let portalPic = new Image(); portalPic.src = "portal.png";
let plus = new Image(); plus.src = "plus.png";
let charX=0;
let charY=0;
let moveUp=false;
let moveDown=false;
let moveRight=false;
let moveLeft=false;
let moveAttack=false;
let frameCounter=0;
let speed = 8;
let mouse = {
    x: undefined,
    y: undefined
}

function Map(x,y) {
    this.drawMap = function() {
        c.fillStyle="green";
        c.fillRect(0,0,canvas.width,canvas.height);
    }
}

function hoverText() {
    //canvas.width*0.1,canvas.height*(0.11+i/25))
    if (profileVisible && Character.getUnspentStatPoints() > 0) {
        if (mouse.x > canvas.width*0.1 && mouse.y > canvas.height*0.15 && mouse.x < canvas.width*0.1+40 && mouse.y < canvas.height*0.15+40) {
            c.fillStyle = "white";
            c.fillText("Increased damage and attack speed",mouse.x+20,mouse.y-10,canvas.width*0.2);
        } else if (mouse.x > canvas.width*0.1 && mouse.y > canvas.height*0.19 && mouse.x < canvas.width*0.1+40 && mouse.y < canvas.height*0.19+40) {
            c.fillStyle = "white";
            c.fillText("Increased health and health regen",mouse.x+20,mouse.y-10,canvas.width*0.2);
        } else if (mouse.x > canvas.width*0.1 && mouse.y > canvas.height*0.23 && mouse.x < canvas.width*0.1+40 && mouse.y < canvas.height*0.23+40) {
            c.fillStyle = "white";
            c.fillText("Increased chance to find items",mouse.x+20,mouse.y-10,canvas.width*0.2);
            c.fillText("and increased gold drop",mouse.x+20,mouse.y+20,canvas.width*0.2);
        } else if (mouse.x > canvas.width*0.1 && mouse.y > canvas.height*0.27 && mouse.x < canvas.width*0.1+40 && mouse.y < canvas.height*0.27+40) {
            c.fillStyle = "white";
            c.fillText("Increased movement speed",mouse.x+20,mouse.y-10,canvas.width*0.2);
        }
    }
}
window.addEventListener('mousemove', 
    function(event) {
    mouse.x= event.x;
    mouse.y= event.y;
})

window.addEventListener('click',
    function(event) {
        if (mouse.x > 15 && mouse.y > canvas.height-125 && mouse.x < 111 && mouse.y < canvas.height - 21) {
            profileVisible = !profileVisible;
            console.log(profileVisible);
        }
        if (profileVisible && Character.getUnspentStatPoints() > 0) {
            if (mouse.x > canvas.width*0.1 && mouse.y > canvas.height*0.15 && mouse.x < canvas.width*0.1+40 && mouse.y < canvas.height*0.15+40) {
                Character.addStat("strength");
            } else if (mouse.x > canvas.width*0.1 && mouse.y > canvas.height*0.19 && mouse.x < canvas.width*0.1+40 && mouse.y < canvas.height*0.19+40) {
                Character.addStat("vitality");
            } else if (mouse.x > canvas.width*0.1 && mouse.y > canvas.height*0.23 && mouse.x < canvas.width*0.1+40 && mouse.y < canvas.height*0.23+40) {
                Character.addStat("luck");
            } else if (mouse.x > canvas.width*0.1 && mouse.y > canvas.height*0.27 && mouse.x < canvas.width*0.1+40 && mouse.y < canvas.height*0.27+40) {
                Character.addStat("agility");
            }
        }
})

document.addEventListener('keydown',
    function(event) {
        (`${event.code}` == "KeyW") ? moveUp = true : "";
        (`${event.code}` == "KeyD") ? moveRight = true : "";
        (`${event.code}` == "KeyS") ? moveDown = true : "";
        (`${event.code}` == "KeyA") ? moveLeft = true : "";
        (`${event.code}` == "Space") ? moveAttack = true : "";
        (`${event.code}` == "KeyE") ? Character.pickupGold() : "";
    }
)

document.addEventListener('keyup',
    function(event) {
        (`${event.code}` == "KeyW") ? moveUp = false : "";
        (`${event.code}` == "KeyD") ? moveRight = false : "";
        (`${event.code}` == "KeyS") ? moveDown = false : "";
        (`${event.code}` == "KeyA") ? moveLeft = false : "";
        (`${event.code}` == "Space") ? moveAttack = false : ""; 
    }
)

function move(x,y) {
    if (moveUp == true) {
        if (moveRight == true) {
            x-=speed/Math.sqrt(2);
            y+=speed/Math.sqrt(2);
            charX-=speed/Math.sqrt(2);
            charY+=speed/Math.sqrt(2);
            return[x,y];
        } else if (moveLeft == true) {
            x+=speed/Math.sqrt(2);
            y+=speed/Math.sqrt(2);
            charX+=speed/Math.sqrt(2);
            charY+=speed/Math.sqrt(2);
            return[x,y];
        } else {
            y+=speed;
            charY+=speed;
            return[x,y];
        }
    } else if (moveDown == true) {
        if (moveRight == true) {
            x-=speed/Math.sqrt(2);
            y-=speed/Math.sqrt(2);
            charX-=speed/Math.sqrt(2);
            charY-=speed/Math.sqrt(2);
            return[x,y];
        } else if (moveLeft == true) {
            x+=speed/Math.sqrt(2);
            y-=speed/Math.sqrt(2);
            charX+=speed/Math.sqrt(2);
            charY-=speed/Math.sqrt(2);
            return[x,y];
        } else {
            y-=speed;
            charY-=speed;
            return[x,y];
        } 
    } else if (moveRight == true) {
        x-=speed;
        charX-=speed;
        return[x,y];
    } else if (moveLeft == true) {
        x+=speed;
        charX+=speed;
        return[x,y];
    } else return[x,y];
}

function Enemy(x,y,currentHp,maxHp,level,xp,damage,gold) {
    this.x=x+(Math.random()-0.5)*250;
    this.y=y+(Math.random()-0.5)*250;
    this.currentHp=currentHp;
    this.maxHp=maxHp;
    this.level=level;
    this.xp=xp;
    let moves;
    let deadEnemy = false;
    let enemyDisappeared = false;
    let disappearCounter = 0;
    let maxAggroDistance = (Math.random()-0.5)*150;
    let monsterSpeed = 3 + (Math.random()-0.5)*3;
    let respawnCounter = 0;
    let maxCooldown = 200;
    let attackCooldown = maxCooldown;


    this.drawEnemy = function() {
        c.beginPath();
        c.rect(this.x,this.y,100,100);
        c.strokeStyle="black";
        c.stroke();
        c.fillStyle="red";
        c.fill();
        c.beginPath();
        c.font = "30px Arial";
        c.fillStyle="black";
        c.fillText(name,this.x-10,this.y-100);
        c.fillText("Hp:" + this.currentHp + "/" + this.maxHp,this.x-10,this.y-70);
        c.fillText("Level " + this.level,this.x,this.y-100);
        c.rect(this.x-50,this.y-50,200,30);
        c.stroke();
        c.fillStyle="orange";
        c.fill();
        c.beginPath();
        c.rect(this.x+150-(200*(1-this.currentHp/this.maxHp)),this.y-50,200*(1-this.currentHp/this.maxHp),30);
        c.fillStyle="black";
        c.fill();
    }

    this.aggroEnemy = function() {
        if ((this.currentHp < this.maxHp) && (this.currentHp > 0)) {
            if (this.x > canvas.width*0.5+100+maxAggroDistance) {
                this.x-=monsterSpeed;
            } else if (this.x < canvas.width*0.5-200+maxAggroDistance) {
                this.x+=monsterSpeed;
            }
            if (this.y > canvas.height*0.5+100+maxAggroDistance) {
                this.y-=monsterSpeed;
            } else if (this.y < canvas.height*0.5-200+maxAggroDistance) {
                this.y+=monsterSpeed;
            }
            if (((Math.pow(this.getXFromChar()/300,2)+Math.pow(this.getYFromChar()/300,2)) < 1) && attackCooldown == 0) {
                Character.decreaseCharHP(damage);
                floatingTextArray.push(new floatingText(canvas.width*0.5,canvas.height*0.5,damage,255,0,0,-1));
                attackCooldown = maxCooldown;
            }
        }
    }

    this.getXFromChar = function() {
        return((canvas.width*0.5)-(this.x+50));
    }
    this.getYFromChar = function() {
        return(canvas.height*0.5-(this.y+50));
    }
    this.getIfEnemyDisappeared = function() {
        return(enemyDisappeared);
    }
    this.decreaseEnemyHP = function(dmg) {
        if ((this.currentHp - dmg) > 0) {
            this.currentHp-=dmg;
            floatingTextArray.push(new floatingText(this.x,this.y,dmg,255,255,255,-1));
        } else if (((this.currentHp - dmg) <= 0) && this.currentHp != 0) {
            floatingTextArray.push(new floatingText(this.x,this.y,this.currentHp,255,255,255,-1));
            this.currentHp=0;
            deadEnemy = true;
            disappearCounter = 120;
        } else if (deadEnemy == true) {
            enemyDisappeared = true;
        }
    }

    this.getBaseEnemy = function () {
        let base = new Enemy(x,y,currentHp,maxHp,level,xp,damage,gold);
        return base;
    }

    this.getRespawnCounter = function() {
        return respawnCounter;
    }

    this.updateEnemy = function() {
            moves = move(this.x,this.y);
            this.x=moves[0];
            this.y=moves[1];
        if (attackCooldown != 0) {
            attackCooldown--;
        }
        if (deadEnemy == false) {
            this.aggroEnemy();
            this.drawEnemy();
        } else if (deadEnemy == true && disappearCounter > 0) {
            this.drawEnemy();
            disappearCounter--;
        } else if (deadEnemy == true && disappearCounter == 0) {
            enemyDisappeared = true;
            respawnCounter++;
            if (respawnCounter == 1) {
                this.dropEnemy();
                Character.addCharXp(this.xp);
            }
        }
    }
    this.dropEnemy = function() {
        goldArray.push(new dropGold(this.x,this.y,gold));
    }
}

function MainChar(x,y,currentHp,maxHp,level,xp,damage) {
    this.x=x;
    this.y=y;
    this.currentHp = currentHp;
    this.maxHp = maxHp;
    this.level = level;
    this.xp = xp;
    this.damage = damage;
    let maxCooldown = 100;
    let attackCooldown = 0;
    let xpNeeded = 10;
    let hpRegen = 0.5;
    let maxHpRegenTimer = 140;
    let hpRegenTimer = maxHpRegenTimer;
    let unspentStatPoints = 1;
    let strength = 0;
    let vitality = 0;
    let luck = 0;
    let agility = 0;
    let gold = 0;

    this.decreaseCharHP = function(dmg) {
        if ((this.currentHp-dmg) > 0) {
            this.currentHp-=dmg;
        } else if ((this.currentHp-dmg) <= 0) {
            this.currentHp = 0;
        }
    }

    this.hpRegenChar = function(value) {
        if ((hpRegenTimer == 0) && (value + this.currentHp) < maxHp) {
            this.currentHp+=value;
            hpRegenTimer = maxHpRegenTimer;
        } if ((hpRegenTimer == 0) && (value + this.currentHp) >= maxHp) {
            this.currentHp = this.maxHp;
            hpRegenTimer = maxHpRegenTimer;
        }
    }

    this.getXpPercentile = function() {
        return(this.xp/xpNeeded);
    }

    this.getCooldown = function() {
        return(attackCooldown/maxCooldown);
    }

    this.getLevel = function() {
        return(this.level);
    }

    this.getXp = function() {
        return this.xp;
    }

    this.getXpNeeded = function() {
        return xpNeeded;
    }

    this.getUnspentStatPoints = function() {
        return unspentStatPoints;
    }

    this.getStat = function(stat, value) {
        (stat == "strength") ? value = strength :
        (stat == "vitality") ? value = vitality :
        (stat == "luck") ? value = luck :
        value = agility;
        return value;
    }

    this.addStat = function(stat) {
        unspentStatPoints--;
        (stat == "strength") ? strength++ :
        (stat == "vitality") ? vitality++ :
        (stat == "luck") ? luck++ :
        agility++;
    }

    this.addCharXp = function(value) {
        if (this.xp + value <= xpNeeded) {
            this.xp+=value;
        } else {
            value-=xpNeeded-this.xp;
            this.level++;
            this.xp = value;
            xpNeeded+=10;
            unspentStatPoints++;
        }
    }

    this.pickupGold = function() {
        for (let i = 0; i<goldArray.length; i++) {
            if ((Math.pow(goldArray[i].getXFromChar()/600,2)+Math.pow(goldArray[i].getYFromChar()/600,2)) < 1) {
                gold+=goldArray[i].getValue();
                floatingTextArray.push(new floatingText(goldArray[i].getX(),goldArray[i].getY(),goldArray[i].getValue(),255,255,0,1));
                goldArray.splice(i,1);
            }
        }
    }

    this.charAttack = function() {
        if (moveAttack == true && attackCooldown == 0) {
            attackCooldown = maxCooldown;
            c.beginPath();
            c.arc(canvas.width*0.5,canvas.height*0.5,250,0,6.28,false);
            c.fill();
            for (let i = 0; i<enemyArray.length; i++) {
                if ((Math.pow(enemyArray[i].getXFromChar()/300,2)+Math.pow(enemyArray[i].getYFromChar()/300,2)) < 1) {
                    enemyArray[i].decreaseEnemyHP(this.damage);
                }
            }
        }
    }

    this.drawChar = function() {
        c.beginPath();
        c.rect(this.x,this.y,100,100);
        c.strokeStyle="black";
        c.stroke();
        c.fillStyle="blue";
        c.fill();
        c.beginPath();
        c.font = "30px Arial";
        c.fillStyle="black";
        c.fillText("Hp:" + Math.round(this.currentHp) + "/" + this.maxHp,this.x-10,this.y-70);
        c.fillText("Level " + this.level,this.x,this.y-100);
        c.rect(this.x-50,this.y-50,200,30);
        c.stroke();
        c.fillStyle="lime";
        c.fill();
        c.beginPath();
        c.rect(this.x+150-(200*(1-this.currentHp/this.maxHp)),this.y-50,200*(1-this.currentHp/this.maxHp),30);
        c.fillStyle="red";
        c.fill();
    }
    this.updateChar = function() {
        if (hpRegenTimer != 0) {
            hpRegenTimer--;
        } else if (hpRegenTimer == 0) {
            Character.hpRegenChar(hpRegen);
        }
        if (attackCooldown != 0) {
            attackCooldown--;
        }
        this.drawChar();
        this.charAttack();
    }
}

function MiniMap() {
    c.beginPath();
    c.arc(canvas.width-200,200,200,0,6.28,false);
    c.lineWidth = 5;
    c.strokeStyle="black";
    c.stroke();
    c.fillStyle="#66FF66";
    c.fill();
    for (let i = 0; i<enemyArray.length; i++) {
        if ((Math.pow(enemyArray[i].getXFromChar()/3000,2)+Math.pow(enemyArray[i].getYFromChar()/3000,2)) < 1) {
            if (enemyArray[i].getIfEnemyDisappeared() == false) {
                c.beginPath();
                c.arc(miniMapX-enemyArray[i].getXFromChar()/15,miniMapY-enemyArray[i].getYFromChar()/15,10,0,6.28,false);
                c.stroke();
                c.fillStyle="red";
                c.fill();
            }
        }
    }
    c.beginPath();
    c.arc(miniMapX,miniMapY,10,0,6.28,false);
    c.stroke();
    c.fillStyle="blue";
    c.fill();
    c.font="40px Arial";
    c.fillText("X: " + Math.round(-charX/150) + " ; Y: " + Math.round(charY/150),canvas.width-310,450);
}

function HUD() {
        c.beginPath();
        c.fillStyle = "yellow";
        c.fillRect(canvas.width*0.5-550,canvas.height-30,1105*Character.getXpPercentile(),25);
        c.drawImage(xpBar,canvas.width*0.5-550,canvas.height-30);
        c.drawImage(sword,canvas.width*0.5-34,canvas.height-150);
        c.rect(canvas.width*0.5-34,canvas.height-150,64,64);
        c.fillStyle="rgba(0,0,0,0.5)";
        c.fillRect(canvas.width*0.5-34,canvas.height-150,64,64*(Character.getCooldown()));
        c.stroke();
        c.font="30px Arial";
        c.fillStyle="Black";
        c.fillText("Space",canvas.width*0.5-45,canvas.height-50);


}

function floatingText(x,y,value,color1,color2,color3,negOrPos) {
    if (negOrPos === -1) {
        this.x=x+(Math.random()-0.5)*50;
        this.y=y+(Math.random()-0.5)*50;
    } else {
        this.x=x;
        this.y=y;
    }
    
    this.value=value;
    this.color1=color1;
    this.color2=color2;
    this.color3=color3;
    let animationFrame = 0;
    let maxAnimationFrame = 150;
    let moves;

    this.getAnimationFrame = function() {
        return animationFrame;
    }

    this.getMaxAnimationFrame = function() {
        return maxAnimationFrame;
    }

    this.updateFloatingText = function() {
        moves = move(this.x,this.y);
            this.x=moves[0];
            this.y=moves[1];
        if (animationFrame < maxAnimationFrame) {
            this.drawFloatingText();
            animationFrame++;
        }
    }

    this.drawFloatingText = function() {
        c.beginPath();
        c.font = "40px Arial";
        c.fillStyle=`rgba(${color1},${color2},${color3},${1-(animationFrame/maxAnimationFrame)})`;
        if (negOrPos == -1) {
            c.fillText("-" + value,this.x,this.y-200*(animationFrame/maxAnimationFrame));
        } else {
            c.fillText("+" + value,this.x,this.y-200*(animationFrame/maxAnimationFrame));
        }
        

    }
}

function dropGold(x,y,amount) {
    this.x = x + (Math.random()-0.5)*100;
    this.y = y + (Math.random()-0.5)*100;

    this.drawGold = function() {
        c.beginPath();
        c.font = "30px Georgia";
        c.fillStyle = "white";
        c.fillText("Gold" ,this.x,this.y);
        c.drawImage(gold,this.x-40,this.y-28);
    }

    this.updateGold = function() {
        let moves = move(this.x,this.y);
        this.x=moves[0];
        this.y=moves[1];
        this.drawGold();
    }

    this.getValue = function() {
        return amount;
    }

    this.getX = function() {
        return x;
    }

    this.getY = function() {
        return y;
    }

    this.getXFromChar = function() {
        return((canvas.width*0.5)-(this.x+50));
    }
    this.getYFromChar = function() {
        return(canvas.height*0.5-(this.y+50));
    }
}

function UI() {
    c.beginPath();
    c.font = "27px Arial";
    c.drawImage(profilePic,15,canvas.height-125);
    c.fillText("Profile",25,canvas.height-5);
    c.drawImage(inventoryPic,126,canvas.height-125);
    c.fillText("Inventory",116,canvas.height-5);
    c.drawImage(portalPic,237,canvas.height-125);
    c.fillText("Worlds",240,canvas.height-5);

    let profileMenu = function() {
        c.beginPath();
        c.fillStyle ="rgba(0,0,0,0.5)";
        c.fillRect(0,0,canvas.width*0.25,canvas.height);
        c.fillStyle ="rgba(255,255,255)";
        c.font = "40px Arial";
        c.fillText("Level: " + Character.getLevel(),canvas.width*0.09,canvas.height*0.05,200);
        c.fillText("XP: " + Character.getXp() + "/" + Character.getXpNeeded(),canvas.width*0.085,canvas.height*0.1,300);
        c.font = "20px Arial";
        c.fillText("Unspent stat points: " + Character.getUnspentStatPoints(), canvas.width*0.008,canvas.height*0.14);
        c.fillText("Strength: " + Character.getStat("strength"), canvas.width*0.008, canvas.height*0.18);
        c.fillText("Vitality: " + Character.getStat("vitality"), canvas.width*0.008, canvas.height*0.22);
        c.fillText("Luck: " + Character.getStat("luck"), canvas.width*0.008, canvas.height*0.26);
        c.fillText("Agility: " + Character.getStat("agility"), canvas.width*0.008, canvas.height*0.3);
        if (Character.getUnspentStatPoints() > 0) {
            for (let i = 1; i<5; i++) {
                c.drawImage(plus,canvas.width*0.1,canvas.height*(0.11+i/25));
            }
        }
    }

    if (profileVisible) {
        profileMenu();
    }

}

function loop() {
    requestAnimationFrame(loop);
    c.clearRect(0,0,window.innerWidth,window.innerHeight);
    Map1.drawMap();
    for (let i = 0; i<goldArray.length; i++) {
        goldArray[i].updateGold();
    }
    for (let i = 0; i<enemyArray.length;i++) {
        enemyArray[i].updateEnemy();
        if (enemyArray[i].getRespawnCounter() == 200) {
            let respawnEnemy = enemyArray[i].getBaseEnemy();
            enemyArray.splice(i,1);
            enemyArray.push(respawnEnemy);
        }
    }
    Character.updateChar();
    for (let i = 0; i<floatingTextArray.length; i++) {
        if (floatingTextArray[i].getAnimationFrame() < floatingTextArray[i].getMaxAnimationFrame()) {
            floatingTextArray[i].updateFloatingText();
        } else {
            floatingTextArray.splice(i,1);
        }
    }
    MiniMap();
    HUD();
    UI();
    hoverText();
}

let enemyArray = [];
let floatingTextArray = [];
let goldArray = [];
enemyArray.push(new Enemy(0,0,1,1,1,3,1,1));
enemyArray.push(new Enemy(200,200,10,10,1,5,1,1));
enemyArray.push(new Enemy(1000,1000,100000,100000,10,0,1,1));
let Character = new MainChar(canvas.width*0.5-50,canvas.height*0.5-50,10,10,1,0,1);
let Map1 = new Map(0,0);
loop();
