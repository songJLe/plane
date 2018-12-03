const contentBox = $('contentBox');
const startBox = $('startBox');
const startBtn = $('startBtn');
const mainBox = $('mainBox');
const scoreSpan = $('scoreSpan');
const score = $('score');
const endBox = $('endBox');
const continueBtn = $('continueBtn');

let tid;
let myPlane;
let scores = 0;
function BaseClass(x,y,width,height,src){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.img = null;
	this.init = function (){
		this.img = document.createElement('img');
		this.img.src = src;
		this.img.style.left = this.x + 'px';
		this.img.style.top = this.y + 'px';
		mainBox.appendChild(this.img);
	}
	this.init();
}

function MyPlane(x,y){
	BaseClass.call(this,x,y,66,80,'image/我的飞机.gif');
	this.move = function(){
		addEvent(mainBox,'mousemove',planeAction);
	}
	this.move();
	this.stop = function(){
		removeEvent(mainBox,'mousemove',planeAction);
	}
}

function planeAction (e){
	var evt = e || event;
	var mouseX = evt.clientX - contentBox.offsetLeft;
	var mouseY = evt.clientY - contentBox.offsetTop;
	myPlane.img.style.left = mouseX - 33 + 'px';
	myPlane.img.style.top = mouseY - 40 + 'px';
	myPlane.x = mouseX-33;
	myPlane.y = mouseY-40;

}

function Enemy(x,y,width,height,src,sudu,hp,score,boomImg,dieTimes){
	this.sudu = sudu;
	this.hp = hp;
	this.planeIsDie = false;
	this.score = score;
	this.boomImg = boomImg;
	this.dieTimes = dieTimes;
	this.dieTime = 0;
	BaseClass.call(this,x,y,width,height,src);
	this.move = function(){
		let planeY = this.img.offsetTop;
		planeY += this.sudu;
		this.img.style.top = planeY + 'px';
		this.y = planeY;
	}
}

function Bullet(x,y){
	BaseClass.call(this,x,y,6,14,'image/bullet1.png');
	this.move = function(){
		let bulletY = this.img.offsetTop;
		bulletY -= 10;
		this.img.style.top = bulletY + 'px';
		this.y = bulletY;
	}
}

let posY = 0;
let mark = 0;
let enemys = [];
let bullets = [];
function timerAction(){
	posY++;
	mainBox.style.backgroundPositionY = posY + 'px';
	mark++;
	if(mark % 15 == 0){
		var tinyEnemy = new Enemy(Math.random()*(320-34),-24,34,24,'image/enemy1_fly_1.png',Math.random()*2+2, 1, 1000, 'image/小飞机爆炸.gif', 100);
		enemys.push(tinyEnemy);
	}
	if(mark % 61 == 0){
		var midEnemy = new Enemy(Math.random()*(320-46),-60,46,60,'image/enemy3_fly_1.png',Math.random()*2+1, 4, 5000, 'image/中飞机爆炸.gif', 200);
		enemys.push(midEnemy);
	}
	if(mark % 210 == 0){
		var largeEnemy = new Enemy(Math.random()*(320-110),-164,110,164,'image/enemy2_fly_1.png',Math.random()+1,8,10000, 'image/大飞机爆炸.gif', 300);
		enemys.push(largeEnemy);
	}

	enemys.map((item,index)=>{
		if(item.y > 750 || item.dieTime == item.dieTimes){
			mainBox.removeChild(item.img);
			enemys.splice(index,1);
		}else{
			if(item.planeIsDie){
				item.dieTime += 20;
			}else{
				item.move();
			}
		}
	})
	if (mark % 5 == 0 ){
		var bullet1 = new Bullet(myPlane.x + 13, myPlane.y - 20);
		var bullet2 = new Bullet(myPlane.x + 53, myPlane.y - 20);
		bullets.push(bullet1);
		bullets.push(bullet2);
	}
	bullets.map((item,index)=>{
		if(item.y < -14){
			mainBox.removeChild(item.img);
			bullets.splice(index,1)
		}else{
			item.move();
		}
	})
	caculator();
}
function caculator() {
	// 我方飞机--每一个敌机之间的检测
	// 每一发子弹--每一个敌机
	enemys.map((enemyItem, enymeIndex)=>{

		// ----
		if (!enemyItem.planeIsDie) {
			var myPlaneLeft = myPlane.x;
			var myPlaneRight = myPlane.x + myPlane.width;
			var myPlaneTop = myPlane.y + 20;
			var myPlaneBottom = myPlane.y + myPlane.height;
			var enemyLeft = enemyItem.x;
			var enemyRight = enemyItem.x + enemyItem.width;
			var enemyTop = enemyItem.y;
			var enemyBottom = enemyItem.y + enemyItem.height;

			var shuiCondition = (myPlaneRight > enemyLeft) && (myPlaneLeft < enemyRight);
			var chuiCondition = (myPlaneTop < enemyBottom) && (myPlaneBottom > enemyTop);
			if (shuiCondition && chuiCondition) {
				// 我方飞机和敌方飞机发生了碰撞
				clearInterval(tid);
				// 我方停止移动
				myPlane.stop();
				// 我方飞机爆炸
				myPlane.img.src = 'image/本方飞机爆炸.gif';
				// 显示结束页面
				score.style.display = 'block';
				fen.innerHTML = scoreSpan.innerHTML;
			}
			zhuye.onclick = function(){
				location.reload();
			}

			myPlane.img.onclick = function(){
				endBox.style.display = 'block';
				clearInterval(tid);
				myPlane.stop();
			}
			continueBtn.onclick = function(){
				endBox.style.display = 'none';
				tid = setInterval(timerAction,20);
				myPlane.move();
			}
			againBtn.onclick = function(){
				scoreSpan.innerHTML=0;
				endBox.style.display = 'none';
				tid = setInterval(timerAction,20);
				myPlane.move();
			}
				bullets.map((bulletItem, bulletIndex)=>{
				var bulletLeft = bulletItem.x;
				var bulletRight = bulletItem.x + bulletItem.width;
				var bulletTop = bulletItem.y;
				var bulletBottom = bulletItem.y + bulletItem.height;
				var sc = (bulletRight > enemyLeft) && (bulletLeft < enemyRight);
				var cc = (bulletTop < enemyBottom) && (bulletBottom > enemyTop);
				if (sc && cc) {
					// 子弹打中敌机
					mainBox.removeChild(bulletItem.img);
					bullets.splice(bulletIndex, 1);
					enemyItem.hp --;

					if (enemyItem.hp == 0) {
						// 修改死亡状态
						enemyItem.planeIsDie = true;
						// 得分
						scores += enemyItem.score;
						scoreSpan.innerHTML = scores;
						// 爆炸
						enemyItem.img.src = enemyItem.boomImg;

					}

				}
			});

		}


		// ----
	});


}

function addEvent(dom,type,fn){
	if(addEventListener){
		dom.addEventListener(type,fn,false);
	}else{
		dom.attachEvent('on'+type,fn);
	}
}
function removeEvent(dom,type,fn){
	if(addEventListener){
		dom.removeEventListener(type,fn,false);
	}else{
		dom.detachEvent('on'+type,fn);
	}
}

startBtn.onclick = function(){
	startBox.style.display = 'none';
	tid = setInterval(timerAction,20);
	myPlane = new MyPlane(127,468);
}


function $(id){
	return document.getElementById(id);
}