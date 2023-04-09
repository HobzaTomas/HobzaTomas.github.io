let scene = 0; 
let actualMove = 0;
let moveCount = 0;
let field = [];
let fieldSize;
let colors = ["#84dccf", "#bf98a0", "#bccce0"];
let players = ['X', 'O'];
let player1, player2;
let bestMoves = [0, 0];
let winningCount;

function changeScene() {
    let menu = document.getElementById("menu");
    let dialog = document.getElementById("dialog");
    let dialogContent = document.getElementById("dialog-content");

    switch(scene) {
        // Vstupní animace
        case 0: {
            menu.style.animation = "slide-top 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both";
            setTimeout(() => {
                menu.style.display = "none"
            }, 1500);
        }
        
        // Generování pole
        case 1: {
            generateField();
            break;
        }
        
        // Odstranění kliknutí
        case 2: {
            let playField = document.getElementById("playField");

            for(let i = 0; i <= fieldSize - 1; i++) {                
                for(let j = 0; j <= fieldSize - 1; j++) {
                    (playField.children[0].children[i].children[j]).removeEventListener("click", placeMove);
                }  
            }
        }

        // Dialog na vyhodnocení
        case 3: {
            let winner = document.getElementById("winner");
            let playField = document.getElementById("playField");

            dialog.style.zIndex = "2";
            dialog.style.animation = "slide-down 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both";
            setTimeout(() => {
                dialogContent.style.zIndex = "2";
                winner.style.fontSize = "50px";

                if(bestMoves[0] < +winningCount && bestMoves[1] < +winningCount) {
                    winner.style.color = colors[2];
                    winner.textContent = `Remíza`;
                }else {
                    winner.style.color = colors[actualMove === 0 ? 1 : 0];
                    winner.textContent = `Vyhrál: ${ actualMove === 0 ? player2 : player1 }`;
                }
            }, 900);

            document.getElementById("againButton").addEventListener("click", () => {
                scene = 1;
                actualMove = 0;   
                bestMoves = [0, 0];  
                dialogContent.style.zIndex = "1";
                dialog.style.animation = "slide-top 800ms cubic-bezier(0.250, 0.460, 0.450, 0.940) both";
                removeAllChildren(playField.children[0]);
                generateField();

                setTimeout(() => {
                    dialog.style.zIndex = "1";                 
                }, 800);
            });
            
            document.getElementById("menuButton").addEventListener("click", () => {
                scene = 0;
                actualMove = 0;
                bestMoves = [0, 0];  
                form.fieldSize.value = ""; 
                dialogContent.style.zIndex = "1";
                dialog.style.animation = "slide-top 800ms cubic-bezier(0.250, 0.460, 0.450, 0.940) both";
                menu.style.animation = "none";
                menu.style.display = "block";   
                removeAllChildren(playField.children[0]);
                if(document.getElementById("wrapper").style.maxHeight == "200px") {
                    toggle();
                }

                setTimeout(() => {
                    dialog.style.zIndex = "1";                 
                }, 800);
            });

            break;
        }
    }

    scene++;
}

function generateField() {
    field = [];
    moveCount = 0;
    let playField = document.getElementById("playField");
    let row, cell;
    let pocet = 0;

    // Uložení hráčů
    player1 = form.hrac1.value || players[0];
    player2 = form.hrac2.value || players[1];
    fieldSize = form.fieldSize.value ? form.fieldSize.value < 3 ? 3 : form.fieldSize.value : 15;
    winningCount = fieldSize < 6 ? 3 : 5;
    document.getElementById("actualMove").textContent = `Na tahu je: ${actualMove == 0 ? player1 : player2}`;
    
    // Generování hracího pole
    for(let i = 0; i <= fieldSize - 1; i++) {
        row = playField.insertRow(i);
        field.push(new Array());
        
        for(let j = 0; j <= fieldSize - 1; j++) {
            cell = row.insertCell(j);
            cell.setAttribute("id", `${j} ${i}`);
            cell.addEventListener("click", placeMove);
            cell.innerHTML = "&nbsp;";
            field[i].push(`${pocet}`);
            pocet++;
        }  
    }
}

function placeMove() {
    const x = this.id.split(' ')[0];
    const y = this.id.split(' ')[1];
    
    if(this.textContent == String.fromCharCode(160)) {
        document.getElementById("actualMove").textContent = `Na tahu je: ${actualMove == 0 ? player2 : player1}`;
        field[y][x] = players[actualMove];
        this.innerHTML = players[actualMove];
        this.style.color = colors[actualMove];
        moveCount++;
        checkOptions(x, y);
        actualMove = actualMove === 0 ? 1 : 0;
    }
}

function checkOptions(x, y) {
    if(fieldSize < 6 ? moveCount >= 3 : moveCount >= 9) {        
        let startX1 = x - 1;
        let startX2 = x * 1 + 1;
        let pocet = 1;

        // Směrové proměnné (indikační)
        let up = true;
        let down = true;
        let right = true;
        let left = true;

        for(let i = 1; i <= 4; i++) {
            pocet = 1;
            startX1 = x - 1;
            startX2 = x * 1 + 1;

            for(let krokY = 1; krokY <= winningCount - 1; krokY++) {
                let jumpIteration = false;

                switch(i) {
                    case 1: {
                        // Křížení levá nahoru
                        if((y - krokY >= 0) && up && (field[y - krokY][startX1] == players[actualMove])) {
                            pocet++;
                        }else {
                            up = false;
                        }
                        
                        // Křížení levá dolu
                        if((y * 1 + krokY <= fieldSize - 1) && down && field[y * 1 + krokY][startX2] == players[actualMove]) {
                            pocet++;
                        }else {
                            down = false;
                        }

                        if(!up && !down) {
                            jumpIteration = true;
                            up = true;
                            down = true;
                            break;
                        }

                        startX2++;
                        startX1--;
                        break;
                    }

                    case 2: {
                        // Postup nahoru
                        if((y - krokY >= 0) && up && (field[y - krokY][x] == players[actualMove])) {
                            pocet++;
                        }else {
                            up = false;
                        }
                        
                        // Postup dolu
                        if((y * 1 + krokY <= fieldSize - 1) && down && (field[y * 1 + krokY][x] == players[actualMove])) {
                            pocet++;
                        }else {
                            down = false;
                        }
                        
                        if(!up && !down) {
                            jumpIteration = true;
                            up = true;
                            down = true;
                            break;
                        }

                        break;
                    }
                    
                    case 3: {
                        // Křížení pravá nahoru
                        if((y - krokY >= 0) && up && (field[y - krokY][startX2] == players[actualMove])) {
                            pocet++;
                        }else {
                            up = false;
                        }
                        
                        // Křížení levá dolu
                        if((y * 1 + krokY <= fieldSize - 1) && down && field[y * 1 + krokY][startX1] == players[actualMove]) {
                            pocet++;
                        }else {
                            down = false;
                        }
                        
                        if(!up && !down) {
                            jumpIteration = true;
                            up = true;
                            down = true;
                            break;
                        }
                    
                        startX2++;
                        startX1--;
                        break;
                    }

                    case 4: {
                        // Postup pravá
                        if(right && (field[y][startX2] == players[actualMove])) {
                            pocet++;
                        }else {
                            right = false;
                        }

                        // Postup levá
                        if(left && field[y][startX1] == players[actualMove]) {
                            pocet++;
                        }else {
                            left = false;
                        }

                        if(!right && !left) {
                            right = true;
                            left = true;
                            jumpIteration = true;
                            break;
                        }

                        startX2++;
                        startX1--;
                        break;
                    }
                }

                if(jumpIteration) {
                    break;
                }
            }
            
            if(pocet > bestMoves[actualMove]) {
                bestMoves[actualMove] = pocet;
            }  

            if(pocet >= winningCount) {
                pocet = 1;
                scene++;
                changeScene();
                break;
            }
        }
        
        if(moveCount == (fieldSize * fieldSize)) {
            pocet = 1;
            scene++;
            changeScene();
        }
    }
}

function toggle() {
    let wrapper = document.getElementById("wrapper");
    let arrowButton = document.getElementById("arrow");
    let transition = ["ease-in", "ease-out"];

    arrowButton.style.transform = wrapper.style.maxHeight == "200px" ? "rotate(0deg)" : "rotate(180deg)";
    wrapper.style.transition = wrapper.style.maxHeight == "200px" ? `max-height 350ms ${ transition[1] }` : `max-height 350ms ${ transition[0] }`;
    wrapper.style.maxHeight = wrapper.style.maxHeight == "200px" ? "0px" : "200px";
}

function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}