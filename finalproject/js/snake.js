// reference: https://segmentfault.com/a/1190000041933671

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
        popMsg('timeout! You died!')
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
        console.log(' runtime' + SnakeTime);
        // 后一个元素到前一个元素的位置
        // the position of the next element is the position of the previous element
        if (flagBagin === false) {
            return;
        }
        for (var i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }

        // 根据方向处理蛇头
        // change the head of the snake according to the direction
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
        if (this.body[0].x < 0 || this.body[0].x > 120 || this.body[0].y < 0 || this.body[0].y > 60) {
            // 清除定时器
            // clear the timer
            clearInterval(timer);
            // 弹出提示框
            // pop up the message
            popMsg('You out of the map! You died')
            // 显示重新开始按钮
            // display the button of restart
            document.getElementById('beginBox').style.display = 'block';
            // 删除旧的蛇
            // delete the old snake
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
            startTime = new Date().getTime();  // reset the start time
        }

        // 判断蛇头吃到毒药，xy坐标重合，
        // judge whether the snake eat the wrong food, the x and y of the snake head is the same as the wrong food
        if (this.body[0].x == wrongfood.x && this.body[0].y == wrongfood.y) {
            // 蛇减一节，因为根据最后节点定，下面display时，会自动赋值的
            // delete a new element to the snake, because the last element will be the new element
            //console.log('毒药: ' +this.body[0].x, wrongfood.x, this.body[0].y, wrongfood.y);
            console.log('bad runtime' + SnakeTime);
            var add = this.body.pop();
            map.removeChild(add.flag);

            // 获取蛇的长度
            // get the length of the snake
            var len = this.body.length;
            // 根据蛇的长度，设置定时器频率SnakeTime
            // set the timer according to the length of the snake
            if (len < 3) {
                SnakeTime = 210;
            }
            SnakeTime = SnakeTime + (len - 3) * 5;
            // SnakeTime最长不能大于200
            // SnakeTime can't be more than 200
            if (SnakeTime > 200) {
                SnakeTime = 200;
            }
            // 当蛇长度小于3时，游戏结束
            // stop the game when the length of the snake is less than 3
            if (this.body.length < 3) {
                // 蛇太短，游戏结束
                // the snake is too short, the game is over
                popMsg('You are too short to live!')
                // 清除定时器
                // clear the timer
                clearInterval(timer);
                // 设置游戏状态为结束
                // set the game status to end
                flagBagin = false;
                // 显示开始按钮
                // display the start button
                document.getElementById('beginBox').style.display = 'block';
                // 清除蛇
                // clear the snake
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
                this.display();   // 显示初始状态  // display the initial status
                return false;   // 结束 // end
            }
            refresh();
            // 清除毒药,重新生成毒药
            // clear the wrong food, and generate a new wrong food
            map.removeChild(wrongfood.flag);
            wrongfood.display();
            startTime = new Date().getTime();  // reset the start time

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
            
            if (SnakeTime < 40) {
                SnakeTime = 40;
            }
            refresh();
            // 清除食物,重新生成食物
            map.removeChild(correctfood.flag);
            correctfood.display();
            startTime = new Date().getTime();  // reset the start time
        }

        // 吃到自己死亡，从第五个开始与头判断，因为前四个永远撞不到
        // judge whether the snake eat itself, from the fifth element, because the first four elements can't eat itself
        for (var i = 4; i < this.body.length; i++) {
            if (this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y) {
                clearInterval(timer);   // clear the timer
                // 弹出提示框
                // pop up the message box
                popMsg('You eat yourself! You are dead!')
                //设置游戏状态为结束
                // set the game status to end
                flagBagin = false;
                // 显示开始按钮
                // show the begin button
                document.getElementById('beginBox').style.display = 'block';
                // 删除蛇
                // delete the snake
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
                this.display();   // 显示初始状态 show the initial status
                return false;   // 结束 end
            }
        }
        if (this.body.length > 15) {
            popMsg('congratulations! You win!', true)
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
    // 食物的宽和高
    // width and height of the food
    this.width = 10;
    this.height = 10;

    // 食物的显示方法
    // display method of the food
    this.display = function () {
        // 创建一个 div 作为食物
        // create a div as the food
        var f = document.createElement('div');
        // 为当前食物添加标记
        // add a flag to the current food
        this.flag = f;
        // 设置食物的样式
        // set the style of the food
        f.style.width = this.width + 'px';
        f.style.height = this.height + 'px';
        f.style.background = 'red';
        f.style.position = 'absolute';
        // 随机生成食物的位置
        // generate the position of the food randomly
        this.x = Math.floor(Math.random() * 100) + 10;
        this.y = Math.floor(Math.random() * 50) + 5;
        // 如果食物位置和错误食物位置重合，则修改食物的横纵坐标
        // if the position of the food is the same as the wrong food, then change the position of the food
        if (this.x == wrongfood.x && this.y == wrongfood.y) {
            this.x = this.x + 1;
            this.y = this.y + 1;
        // 如果食物位置和药物食物位置重合，则修改食物的横纵坐标
        // if the position of the food is the same as the correct food, then change the position of the food
        } else if (this.x == correctfood.x && this.y == correctfood.y) {
            this.x = this.x + 1;
            this.y = this.y + 1;
        }
        // 设置食物的位置
        // set the position of the food
        f.style.left = this.x * this.width + 'px';
        f.style.top = this.y * this.height + 'px';
        // 将食物添加到地图中
        // add the food to the map
        map.appendChild(f);
    }
}


function wrongfood() {
    // 毒药宽度
    // wrong food width
    this.width = 10;
    // 毒药高度
    // wrong food height
    this.height = 10;
    // 显示毒药
    // display the wrong food
    this.display = function () {
        // 创建 div 元素
        // create a div element
        var f = document.createElement('div');
        // 将创建的 div 元素赋值给 flag 属性
        // assign the created div element to the flag property
        this.flag = f;
        // 设置 div 元素的宽度
        // set the width of the div element
        f.style.width = this.width + 'px';
        // 设置 div 元素的高度
        // set the height of the div element
        f.style.height = this.height + 'px';
        // 设置 div 元素的背景颜色为绿色
        // set the background color of the div element to green
        f.style.background = 'green';
        // 设置 div 元素的定位方式为绝对定位
        // set the positioning method of the div element to absolute positioning
        f.style.position = 'absolute';
        // 随机生成食物的横坐标和纵坐标
        // randomly generate the horizontal coordinate and vertical coordinate of the food
        this.x = Math.floor(Math.random() * 100) + 10;
        this.y = Math.floor(Math.random() * 50) + 5;
        // 如果毒药的横纵坐标与正确的食物的横纵坐标相同，则修改毒药的横纵坐标
        // if the horizontal and vertical coordinates of the wrong food are the same as the horizontal and vertical coordinates of the correct food, modify the horizontal and vertical coordinates of the wrong food
        if (this.x == food.x && this.y == food.y) {
            this.x = this.x + 1;
            this.y = this.y + 1;
        // 如果毒药的横纵坐标与药物的横纵坐标相同，则修改毒药的横纵坐标
        // if the horizontal and vertical coordinates of the wrong food are the same as the horizontal and vertical coordinates of the drug, modify the horizontal and vertical coordinates of the wrong food
        } else if (this.x == correctfood.x && this.y == correctfood.y) {
            this.x = this.x + 2;
            this.y = this.y + 2;
        }
        // 设置毒药元素的左边距和上边距
        // set the left margin and top margin of the wrong food element
        f.style.left = this.x * this.width + 'px';
        f.style.top = this.y * this.height + 'px';
        // 将毒药添加到地图上
        // add the wrong food to the map
        map.appendChild(f);
    }
}



function correctfood() {
    // 定义 correctfood 构造函数，初始化蛇吃到药物食物时的样式和位置信息
    // define the correctfood constructor, initialize the style and position information of the snake when it eats the drug food
    this.width = 10;
    // 药物食物的高度
    // the height of the drug food
    this.height = 10;
    // 显示药物食物
    // display the drug food
    this.display = function () {
        // 创建 div 元素作为药物食物
        // create a div element as a drug food
        var f = document.createElement('div');
        // 为 correctfood 对象绑定 DOM 元素
        // bind the DOM element to the correctfood object
        this.flag = f;
        // 设置药物食物的宽度
        // set the width of the drug food
        f.style.width = this.width + 'px';
        f.style.height = this.height + 'px';
        // set the background color of the drug food
        f.style.background = 'blue';
        f.style.position = 'absolute';
        // 生成随机的坐标
        // generate random coordinates
        this.x = Math.floor(Math.random() * 100) + 10;
        this.y = Math.floor(Math.random() * 50) + 5;
        // 判断药物食物和错误食物，普通食物的位置是否重合，如果重合，则调整药物食物的位置
        // judge whether the position of the drug food and the wrong food, the normal food overlaps, if it overlaps, adjust the position of the drug food
        if (this.x == food.x && this.y == food.y) {
        this.x = this.x + 1;
        this.y = this.y + 1;
        } else if (this.x == wrongfood.x && this.y == wrongfood.y) {
        this.x = this.x + 1;
        this.y = this.y + 1;
        }
        // 设置药物食物的位置
        // set the position of the drug food
        f.style.left = this.x * this.width + 'px';
        f.style.top = this.y * this.height + 'px';
        // 将药物食物添加到地图上
        // add the drug food to the map
        map.appendChild(f);
    }
  }
  


// 给body加按键事件，上下左右
// add keydown event to body, up, down, left, right
document.body.onkeydown = function (e) {
    // 有事件对象就用事件对象，没有就自己创建一个，兼容低版本浏览器
    // if there is an event object, use it, otherwise create one, compatible with low version browser
    var ev = e || window.event;

    switch (ev.keyCode) {
        case 38:
            // not allow to return, when the snake is going up, it can't go down
            if (snake.direction != 'down') {   // 不允许返回，向上的时候不能向下
                snake.direction = "up";
            }
            break;
        case 40:
            // not allow to return, when the snake is going down, it can't go up
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
        // compatible with WASD key
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

// 初始化显示
// init display
var snake = new Snake();
var food = new Food();
snake.display();
food.display();
// 新定义的两种不同效果的食物
// new define two different effect food
var wrongfood = new wrongfood();
wrongfood.display();
var correctfood = new correctfood();
correctfood.display();


// 获取开始按钮
// get begin button
var btn = document.getElementById('begin');
// 点击开始游戏事件
// click begin button
btn.onclick = function () {
    // 开始按钮毛玻璃幕布
    // begin button curtain
    var parent = this.parentNode;
    // 隐藏开始按钮
    // hide begin button
    parent.style.display = 'none';
    // 获取定时器时间
    // get timer time
    SnakeTime = 200;
    let time2 = SnakeTime;
    flagBagin = true;
    startTime = Date.now();
    timeoutflag = false;
    // 设置蛇动
    // set snake move
    timer = setInterval(function () {
        snake.run();
    }, time2);

    
}


// 定义刷新定时器方法
// define refresh timer method
function refresh() {
    // 停止定时器
    // stop timer
    clearInterval(timer);
    // 刷新定时器
    // reset timer
    timer = setInterval(function () {
        snake.run();
    }, SnakeTime);
}

// 弹窗提示
// pop up window
function popMsg(msg, flag) {
    let dom = document.createElement('div')
    dom.textContent = msg
    // 设置淡出效果
    // set fade out effect
    dom.className = 'message'
    document.body.appendChild(dom)
    setTimeout(() => {
        dom.classList.add('zoomOut')
        document.body.removeChild(dom)
    }, 2000)
    showAni(flag)
}

// 显示烟花/炸弹
// show fireworks/bomb
function showAni(flag = false) {
    let dom
    // 根据是否获胜显示不同动画
    // show different animation according to whether win
    if (flag) {
        dom = document.querySelector('.fire')
    } else {
        dom = document.querySelector('.bomb')
    }
    // 设置淡入效果
    // set fade in effect
    dom.style.display = 'block'
    setTimeout(() => {
        dom.style.display = 'none'
    }, 2000)
}