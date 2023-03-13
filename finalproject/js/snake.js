// the velocity of the snake
var SnakeTime = 200;
// map
var map = document.getElementById('map');

var startTime = Date.now();
const countDownTime = 100000; // count down 100s
// make 2 flag too control the time 
flagBagin = false;
timeoutflag = false;

// update the count down time
function updateTime() {
    // get the element in html
    const timeElement = document.getElementById('timecount');
    // when game not begin, the time never change
    if (flagBagin === false) {
        timeElement.textContent = 100;
        return;
    }
    // when game begin, the time will count down
    // get the time now and the time when the game begin
    const elapsedTime = Date.now() - startTime;
    // calculate the time left
    const remainingTime = countDownTime - elapsedTime;

    // when time left is 0, the game will end
    if (remainingTime <= 0) {
        alert('timeout! You died!');
        flagBagin = false;
        timeoutflag = true;
        return;
    }
    // update the time left to screen
    timeElement.textContent = Math.round(remainingTime / 1000); // 转换为秒数并四舍五入
}

// update the time every 1s
setInterval(updateTime, 1000);
  


// using constructor to create a snake
function Snake() {
    // set the size of the snake and the direction
    
    this.width = 10;
    this.height = 10;
    this.direction = 'down';

    // record the status of the snake, when the snake eat the food, it will add a new point
    // the initial length of the snake is 3
    this.body = [
        { x: 2, y: 0 },   // head of the snake, the first point
        { x: 1, y: 0 },   // mid of the snake, the second point
        { x: 0, y: 0 }    // tail of the snake, the third point
    ];

    // display the snake
    this.display = function () {
        // create a snake
        for (var i = 0; i < this.body.length; i++) {
            if (this.body[i].x != null) {   
                // 当吃到食物时，x==null，不能新建，不然会在0，0处新建一个
                // when the snake eat the food, the x of the snake will be null, so we can't create a new snake
                var s = document.createElement('div');
                // 将节点保存到状态中，以便于后面删除
                // save the node to the status, so we can delete it later
                this.body[i].flag = s;
                // 设置宽高
                // set the width and height
                s.style.width = this.width + 'px';
                s.style.height = this.height + 'px';
                //设置颜色
                // set the color
                s.style.backgroundColor = 'yellow';
                // 设置位置
                // set the position
                s.style.position = 'absolute';
                s.style.left = this.body[i].x * this.width + 'px';
                s.style.top = this.body[i].y * this.height + 'px';
                // 添加进去
                // add the snake to the map
                map.appendChild(s);
            }
        }
        //设置蛇头的颜色
        // set the color of the head of the snake
        this.body[0].flag.style.backgroundColor = '#fff';
        this.body[0].flag.style.borderRadius = '50%';
    };

    // 让蛇跑起来,后一个元素到前一个元素的位置
    // 蛇头根据方向处理，所以i不能等于0
    // let the snake run, the position of the next element is the position of the previous element
    // the head of the snake will change according to the direction, so i can't be 0
    this.run = function () {
        // 后一个元素到前一个元素的位置
        // the position of the next element is the position of the previous element
        for (var i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }

        // 根据方向处理蛇头
        switch (this.direction) {
            case "left":
                this.body[0].x -= 1;
                break;
            case "right":
                this.body[0].x += 1;
                break;
            case "up":
                this.body[0].y -= 1;
                break;
            case "down":
                this.body[0].y += 1;
                break;
        }
        // when time out, the snake will die
        if (timeoutflag === true) {
            clearInterval(timer); 
            document.getElementById('beginBox').style.display = 'block';
            // delete the old snake
            for (var i = 0; i < this.body.length; i++) {
                if (this.body[i].flag != null) {   
                    map.removeChild(this.body[i].flag);
                }
            }
            this.body = [   // nack to the initial status
                { x: 2, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 0 }
            ];
            this.direction = 'down';
            this.display();   // display the snake
            flagBagin = false;
            return;
        }

        // 判断是否出界,根据蛇头判断
        // judge whether the snake is out of the map, according to the head of the snake
        if (this.body[0].x < 0 || this.body[0].x >  120  || this.body[0].y < 0 || this.body[0].y > 60) {
            clearInterval(timer);  
            // 清除定时器
            // clear the timer
            alert("You out of the map! You died!");
            document.getElementById('beginBox').style.display = 'block';
            for (var i = 0; i < this.body.length; i++) {
                if (this.body[i].flag != null) {   

                    map.removeChild(this.body[i].flag);
                }
            }
            this.body = [   // back to the initial status
                { x: 2, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 0 }
            ];
            this.direction = 'down';
            this.display();   // display the snake
            flagBagin = false;
            return false;   // return false, so the timer will not run
        }

        // 判断蛇头吃到食物，xy坐标重合，
        // judge whether the snake eat the food, the x and y of the snake head is the same as the food
        if (this.body[0].x == food.x && this.body[0].y == food.y) {
            // 蛇加一节，因为根据最后节点定，下面display时，会自动赋值的
            // add a new element to the snake, because the last element will be the new element
            this.body.push({ x: null, y: null, flag: null });
            
            // 获取蛇的长度
            // get the length of the snake
            var len = this.body.length;
            // 根据蛇的长度，设置定时器频率SnakeTime
            // set the timer according to the length of the snake
            SnakeTime = SnakeTime - (len - 3) * 5;
            // SnakeTime最低不能小于40
            // SnakeTime can't be less than 40
            if (SnakeTime < 40) {
                SnakeTime = 40;
            }
            refresh();
            // 清除食物,重新生成食物
            // clear the food, and generate a new food
            map.removeChild(food.flag);
            food.display();
        }

        // 判断蛇头吃到毒药，xy坐标重合，
        // judge whether the snake eat the wrong food, the x and y of the snake head is the same as the wrong food
        if (this.body[0].x == wrongfood.x && this.body[0].y == wrongfood.y) {
            // 蛇减一节，因为根据最后节点定，下面display时，会自动赋值的
            // delete a new element to the snake, because the last element will be the new element
            //console.log('毒药: ' +this.body[0].x, wrongfood.x, this.body[0].y, wrongfood.y);
            var add = this.body.pop();
            map.removeChild(add.flag);
            
            // 获取蛇的长度
            // get the length of the snake
            var len = this.body.length;
            // 根据蛇的长度，设置定时器频率SnakeTime
            // set the timer according to the length of the snake
            SnakeTime = SnakeTime + (len - 3) * 5;
            // SnakeTime最低不能小于40
            // SnakeTime can't be less than 40
            if (SnakeTime > 40) {
                SnakeTime = 40;
            }
            if (this.body.length < 3) {
                alert("You are too short to live!");
                flagBagin = false;
                document.getElementById('beginBox').style.display = 'block';
                for (var i = 0; i < this.body.length; i++) {
                    if (this.body[i].flag != null) {   
                        map.removeChild(this.body[i].flag);
                    }
                }
                this.body = [   // back to the initial status
                    { x: 2, y: 0 },
                    { x: 1, y: 0 },
                    { x: 0, y: 0 }
                ];
                this.direction = 'down';
                this.display();   // 显示初始状态
                return false;   // 结束
            }
            refresh();
            // 清除毒药,重新生成毒药
            // clear the wrong food, and generate a new wrong food
            map.removeChild(wrongfood.flag);
            wrongfood.display();

        }
        if (this.body[0].x == correctfood.x && this.body[0].y == correctfood.y) {
            // 蛇加2节，因为根据最后节点定，下面display时，会自动赋值的
            // add two new element to the snake, because the last element will be the new element
            this.body.push({ x: null, y: null, flag: null });
            this.body.push({ x: null, y: null, flag: null });
            
            // 获取蛇的长度
            // get the length of the snake
            var len = this.body.length;
            // 根据蛇的长度，设置定时器频率SnakeTime
            SnakeTime = SnakeTime - (len - 3) * 5;
            // SnakeTime最低不能小于40
            if (SnakeTime > 200) {
                SnakeTime = 200;
            }
            refresh();
            // 清除食物,重新生成食物
            map.removeChild(correctfood.flag);
            correctfood.display();
        }

        // 吃到自己死亡，从第五个开始与头判断，因为前四个永远撞不到
        // judge whether the snake eat itself, from the fifth element, because the first four elements can't eat itself
        for (var i = 4; i < this.body.length; i++) {
            if (this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y) {
                clearInterval(timer);   // clear the timer
                alert("You eat yourself! You are dead!");
                flagBagin = false;
                document.getElementById('beginBox').style.display = 'block';
                for (var i = 0; i < this.body.length; i++) {
                    if (this.body[i].flag != null) {  
                        map.removeChild(this.body[i].flag);
                    }
                }
                this.body = [   // back to the initial status
                    { x: 2, y: 0 },
                    { x: 1, y: 0 },
                    { x: 0, y: 0 }
                ];
                this.direction = 'down';
                this.display();   // 显示初始状态
                return false;   // 结束
            }
        }
        if (this.body.length > 15) {
            alert("congratulations! You win!");
            flagBagin = false;
        }

        // 先删掉初始的蛇，在显示新蛇
        // delete the initial snake, and display the new snake
        for (var i = 0; i < this.body.length; i++) {
            if (this.body[i].flag != null) {   // 当吃到食物时，flag是等于null，且不能删除
                map.removeChild(this.body[i].flag);
            }
        }

        // 重新显示蛇
        // display the new snake
        this.display();

    }
}

// 构造食物
function Food() {
    this.width = 10;
    this.height = 10;

    this.display = function () {
        // 创建一个div(一节蛇身)
        var f = document.createElement('div');
        this.flag = f;
        f.style.width = this.width + 'px';
        f.style.height = this.height + 'px';
        f.style.background = 'red';
        f.style.position = 'absolute';
        this.x = Math.floor(Math.random() * 80);
        this.y = Math.floor(Math.random() * 40);
        if (this.x == wrongfood.x && this.y == wrongfood.y) {
            this.x = this.x + 1;
            this.y = this.y + 1;
        } else if (this.x == correctfood.x && this.y == correctfood.y) {
            this.x = this.x + 1;
            this.y = this.y + 1;
        }
        f.style.left = this.x * this.width + 'px';
        f.style.top = this.y * this.height + 'px';
        map.appendChild(f);
    }
}

function wrongfood() {
    this.width = 10;
    this.height = 10;
    this.display = function () {
        var f = document.createElement('div');
        this.flag = f;
        f.style.width = this.width + 'px';
        f.style.height = this.height + 'px';
        f.style.background = 'green';
        f.style.position = 'absolute';
        this.x = Math.floor(Math.random() * 80);
        this.y = Math.floor(Math.random() * 40);
        if (this.x == food.x && this.y == food.y) {
            this.x = this.x + 1;
            this.y = this.y + 1;
        } else if (this.x == correctfood.x && this.y == correctfood.y) {
            this.x = this.x + 2;
            this.y = this.y + 2;
        }
        f.style.left = this.x * this.width + 'px';
        f.style.top = this.y * this.height + 'px';
        map.appendChild(f);
    }
}

function correctfood() {
    this.width = 10;
    this.height = 10;
    this.display = function () {
        var f = document.createElement('div');
        this.flag = f;
        f.style.width = this.width + 'px';
        f.style.height = this.height + 'px';
        f.style.background = 'blue';
        f.style.position = 'absolute';
        this.x = Math.floor(Math.random() * 80);
        this.y = Math.floor(Math.random() * 40);
        if (this.x == food.x && this.y == food.y) {
            this.x = this.x + 1;
            this.y = this.y + 1;
        } else if (this.x == wrongfood.x && this.y == wrongfood.y) {
            this.x = this.x + 1;
            this.y = this.y + 1;
        }
        f.style.left = this.x * this.width + 'px';
        f.style.top = this.y * this.height + 'px';
        map.appendChild(f);
    }
}  


// 给body加按键事件，上下左右
document.body.onkeydown = function (e) {
    // 有事件对象就用事件对象，没有就自己创建一个，兼容低版本浏览器
    var ev = e || window.event;

    switch (ev.keyCode) {
        case 38:
            if (snake.direction != 'down') {   // 不允许返回，向上的时候不能向下
                snake.direction = "up";
            }
            break;
        case 40:
            if (snake.direction != "up") {
                snake.direction = "down";
            }
            break;
        case 37:
            if (snake.direction != "right") {
                snake.direction = "left";
            }
            break;
        case 39:
            if (snake.direction != "left") {
                snake.direction = "right";
            }
            break;
        // 兼容WASD键    
        case 87:
            if (snake.direction != "down") {
                snake.direction = "up";
            }
            break;
        case 83:
            if (snake.direction != "up") {
                snake.direction = "down";
            }
            break;
        case 65:
            if (snake.direction != "right") {
                snake.direction = "left";
            }
            break;
        case 68:
            if (snake.direction != "left") {
                snake.direction = "right";
            }
            break;
    }
    
};

var snake = new Snake();
var food = new Food();
// 初始化显示
snake.display();   
food.display();
var wrongfood = new wrongfood();
wrongfood.display();
var correctfood = new correctfood();
correctfood.display();

// 获取开始按钮
var btn = document.getElementById('begin');
// 点击开始游戏事件
btn.onclick = function () {
    // 开始按钮毛玻璃幕布

    var parent = this.parentNode;
    // 隐藏开始按钮
    parent.style.display = 'none';
    // 获取定时器时间
    let time = SnakeTime;
    timer = setInterval(function () {
        snake.run();
    }, time);
    flagBagin = true;
    startTime = Date.now();
    timeoutflag = false;
}




// 定义刷新定时器方法
function refresh() {
    // 停止定时器
    clearInterval(timer);
    // 刷新定时器
    timer = setInterval(function () {
        snake.run();
    }, SnakeTime);
}