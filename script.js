document.addEventListener('DOMContentLoaded', function() {


    // ПЕРЕМЕННЫЕ akljd

    let rightPosition = 0;
    let imgBlockPosition = 0;
    let direction = 'right';
    let hit = false;
    let jump = false;
    let fall = false;
    let timer = null;
    let x = 0;
    let halfWidth = window.screen.width / 2;
    let tileArray = [];

    let jumpBlock = window.document.querySelector('#jump-block');
    let hitBlock = window.document.querySelector('#hit-block');
    let heroImg = window.document.querySelector('#hero-img');
    let imgBlock = window.document.querySelector('#img-block');
    let canvas = window.document.querySelector('#canvas');
    let fsBtn = window.document.querySelector('#fsBtn');
    let info = window.document.querySelector('#info');

    // расположение героя
    let heroX = Math.floor((Number.parseInt(imgBlock.style.left)+32)/32);
    let heroY = Math.floor(Number.parseInt(imgBlock.style.bottom)/32);

    jumpBlock.style.top = `${window.screen.height/2 - 144/2}px`;
    hitBlock.style.top = `${window.screen.height/2 - 144/2}px`;

    // кнопка фуллскрин
    fsBtn.onclick = () => {
        if ( window.document.fullscreen ) {
            fsBtn.src = 'img/fullscreen.png';
            window.document.exitFullscreen();
        } else {
            fsBtn.src = 'img/cancel.png';
            canvas.requestFullscreen();
        }
    }

    // присваиваем значение тру для прыжка и удара
    jumpBlock.onclick = () => { jump = true };
    hitBlock.onclick = () => { hit = true };


    // ФУНКЦИИ

    // координаты нахождения героя
    const updateHeroXY = () => {
        heroX = Math.ceil((Number.parseInt(imgBlock.style.left)+32)/32);
        heroY = Math.ceil(Number.parseInt(imgBlock.style.bottom)/32);

        info.innerText = `heroX = ${heroX}, heroY = ${heroY}`;
    }

    // проверка на падение с платформы
    const checkFalling = () => {
        updateHeroXY();
        let isFalling = true;
        for( let i = 0; i < tileArray.length; i++ ) {
            if ( (tileArray[i][0] === heroX) && (tileArray[i][1]+1) === heroY ) {
                isFalling = false;
            }
        }

        if ( isFalling ) {
            info.innerText = info.innerText + ", Falling";
            fall = true;
        } else {
            info.innerText = info.innerText + ", Not falling";
            fall = false;
        }
    }

    // падение
    const fallHandler = () => {
        heroImg.style.top = "-96px";
        imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)-40}px`;
        checkFalling();
    }

    // движение вправо
    const rightHandler = () => {
        heroImg.style.transform = "scale(-1,1)";
        rightPosition = rightPosition + 1;
        imgBlockPosition = imgBlockPosition + 1;
        if (rightPosition > 5 ) {
            rightPosition = 0;
        }
        heroImg.style.left = `-${rightPosition*96}px`;
        heroImg.style.top = `-192px`;
        imgBlock.style.left = `${imgBlockPosition*20}px`;

        checkFalling();
    }

    // движение влево
    const leftHandler = () => {
        heroImg.style.transform = "scale(1,1)";
        rightPosition = rightPosition + 1;
        imgBlockPosition = imgBlockPosition - 1;
        if (rightPosition > 5 ) {
            rightPosition = 0;
        }
        heroImg.style.left = `-${rightPosition*96}px`;
        heroImg.style.top = `-192px`;
        imgBlock.style.left = `${imgBlockPosition*20}px`;

        checkFalling();
    }

    // стоим на месте
    const standHandler = () => {
        switch (direction) {
            case "right": {
                heroImg.style.transform = "scale(-1,1)";
                if (rightPosition > 4 ) {
                    rightPosition = 1;
                }
                break;
            }
            case "left": {
                heroImg.style.transform = "scale(1,1)";
                if (rightPosition > 3 ) {
                    rightPosition = 0;
                }
                break;
            }
            default: break;
        }

        rightPosition = rightPosition + 1;
        heroImg.style.left = `-${rightPosition*96}px`;
        heroImg.style.top = `0px`;

        checkFalling();
    }

    // удар
    const hitHandler = () => {
        switch (direction) {
            case "right": {
                heroImg.style.transform = "scale(-1,1)";
                if (rightPosition > 4 ) {
                    rightPosition = 1;
                    hit = false;
                }
                break;
            }
            case "left": {
                heroImg.style.transform = "scale(1,1)";
                if (rightPosition > 3 ) {
                    rightPosition = 0;
                    hit = false;
                }
                break;
            }
            default: break;
        }

        rightPosition = rightPosition + 1;
        heroImg.style.left = `-${rightPosition*96}px`;
        heroImg.style.top = `-288px`;
    }

    // прыжок
    const jumpHandler = () => {
        switch (direction) {
            case "right": {
                heroImg.style.transform = "scale(-1,1)";
                if (rightPosition > 4 ) {
                    rightPosition = 1;
                    jump = false;
                    imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)+160}px`;
                    imgBlockPosition = imgBlockPosition + 10;
                    imgBlock.style.left = `${imgBlockPosition*20}px`;
                }
                break;
            }
            case "left": {
                heroImg.style.transform = "scale(1,1)";
                if (rightPosition > 3 ) {
                    rightPosition = 0;
                    jump = false;
                    imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)+160}px`;
                    imgBlockPosition = imgBlockPosition - 10;
                    imgBlock.style.left = `${imgBlockPosition*20}px`;
                }
                break;
            }
            default: break;
        }

        rightPosition = rightPosition + 1;
        heroImg.style.left = `-${rightPosition*96}px`;
        heroImg.style.top = `-96px`;
    }

    // ОБРАБОТЧИКИ СОБЫТИЙ
    // нажатие кнопки
    let oneTouchStart = (event) => {
        clearInterval(timer);
        x = event.screenX;
        timer = setInterval(()=>{
            if (x > halfWidth) {
                rightHandler();
                direction = 'right';
            } else {
                leftHandler();
                direction = 'left';
            }
        },130);
    }

    // отпускание кнопки
    let oneTouchEnd = (event) => {
        clearInterval(timer);
        lifeCycle();
    }

    window.onmousedown = oneTouchStart;
    window.onmouseup = oneTouchEnd;

    // анимация для стойки на месте + проверка на нажатие кнопок прыжка или удара
    const lifeCycle = () => {
        timer = setInterval(()=>{
            if ( hit ) {
                hitHandler();
            } else if ( jump ) {
                jumpHandler();
            } else if ( fall ) {
                fallHandler();
            } else {
                standHandler();
            }
        },150);
    }

    // создание блока 1
    const createTile = (x, y = 1) => {
        let tile = window.document.createElement("img");
        tile.src = "assets/1 Tiles/Tile_02.png";
        tile.style.position = "absolute";
        tile.style.left = `${x*32}px`;
        tile.style.bottom = `${y*32}px`;
        canvas.appendChild(tile);

        tileArray.push([x, y]);
    }

    // создаем платформу
    const createTilesPlatform = (startX, startY, length) => {
        for ( let i = 0 ; i < length; i++ ) {
            createTile(startX + i, startY);
        }
    }

    // добавление блоков, выстраиваем пол
    const addTiles = (i) => {
        createTile(i);
        let tileBlack = window.document.createElement("img");
        tileBlack.src = "assets/1 Tiles/Tile_04.png";
        tileBlack.style.position = "absolute";
        tileBlack.style.left = `${i*32}px`;
        tileBlack.style.bottom = "0px"
        canvas.appendChild(tileBlack);
    }

    const start = () => {
        // вызываем анимацию при стойке
        lifeCycle();
        // выстраиваем блоки через цикл
        for ( let i = 0 ; i < 100; i++ ) {
            // создаем обрывы
            if ( (i > 12) && (i < 17) ) {
                continue;
            }
            addTiles(i);
        }
        createTilesPlatform(10, 10, 10);
        createTilesPlatform(20, 20, 30);

    }

    start();
});
