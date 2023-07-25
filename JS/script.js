let logString = "";
const crowPos = new Map();
const posCrow = new Map();

const possibleMoves = new Map();
possibleMoves["pos1"]=["pos6","pos10"];
possibleMoves["pos2"]=["pos6","pos7"];
possibleMoves["pos3"]=["pos7","pos8"];
possibleMoves["pos4"]=["pos8","pos9"];
possibleMoves["pos5"]=["pos9","pos10"];

possibleMoves["pos6"]=["pos1","pos2","pos7","pos10"];
possibleMoves["pos7"]=["pos2","pos3","pos6","pos8"];
possibleMoves["pos8"]=["pos7","pos3","pos4","pos9"];
possibleMoves["pos9"]=["pos4","pos5","pos10","pos8"];
possibleMoves["pos10"]=["pos1","pos6","pos5","pos9"];

const killingMoves = new Map();
killingMoves["pos1"] = [["pos6","pos7"],["pos10","pos9"]];
killingMoves["pos2"] = [["pos6","pos10"],["pos7","pos8"]];
killingMoves["pos3"] = [["pos7","pos6"],["pos8","pos9"]];
killingMoves["pos4"] = [["pos8","pos7"],["pos9","pos10"]];
killingMoves["pos5"] = [["pos10","pos6"],["pos9","pos8"]];
killingMoves["pos6"] = [["pos7","pos3"],["pos10","pos5"]];
killingMoves["pos7"] = [["pos6","pos1"],["pos8","pos4"]];
killingMoves["pos8"] = [["pos7","pos2"],["pos9","pos5"]];
killingMoves["pos9"] = [["pos10","pos1"],["pos8","pos3"]];
killingMoves["pos10"] = [["pos6","pos2"],["pos9","pos4"]];





let turnOfCrow=1;
let numberOfCrowsIn=0;
let canCrowsMove=false;
let captured=0;
let gameOver=false;

function allowDrop(ev) {
    ev.preventDefault();
}
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.setData("possibleMoves",crowPos.get(ev.target.id));
    ev.dataTransfer.setData("className", ev.target.className);
    logString += ev.target.id + " is dragged.\n";
  }
  
  function drop(ev) {
    ev.preventDefault();
    if(!gameOver){
        var data = ev.dataTransfer.getData("text");
    let currentToken = ev.dataTransfer.getData("className");
    let pm = possibleMoves[ev.dataTransfer.getData("possibleMoves")];
    //console.log(pm);

    if(currentToken=="crows"){
        if(turnOfCrow){
            if(!(ev.target.className=="vulture" || ev.target.className=="crows")){
                console.log(possibleMoves[ev.dataTransfer.getData("possibleMoves")]);
                if(pm!=null && canCrowsMove){
                    if(pm.includes(ev.target.id)){
                        if(posCrow.get(crowPos.get(data))!=null){
                            posCrow.delete(crowPos.get(data));
                        }
                        if(posCrow.get(ev.target.id)!=null){
                            posCrow.delete(ev.target.id);
                        }
                        logString += "Crow "+data+" is at postion "+ ev.target.id+"\n";
                        crowPos.set(data,ev.target.id);
                        posCrow.set(ev.target.id,data);
                        ev.target.appendChild(document.getElementById(data));
                        turnOfCrow=0;
                    }else{
                        logString+= "Invalid Move Played by : "+ data+"\n";
                        alert("Invalid Move, please Move again!");
                    }
                    
                }else{
                    if(!crowPos.has(data)){
                        if(posCrow.get(crowPos.get(data))!=null){
                            posCrow.delete(crowPos.get(data));
                        }
                        if(posCrow.get(ev.target.id)!=null){
                            posCrow.delete(ev.target.id);
                        }
                        logString += "Crow "+data+" is at postion "+ ev.target.id+"\n";
                        crowPos.set(data,ev.target.id);
                        posCrow.set(ev.target.id,data);
                        ev.target.appendChild(document.getElementById(data));
                        turnOfCrow=0;
                        numberOfCrowsIn++;
                    }else{
                        logString += "Cannot move Crow as remaining "+(7-numberOfCrowsIn)+" crows needs to be present on board\n";
                        alert("Bring all Crows on Board!!");
                    }
                    if(numberOfCrowsIn==7){
                        logString+= "All Crows are on Board, Now Crows can move.\n";
                        canCrowsMove=true;
                    }
                    
                }
            }  
        }else{
            logString+= "Invalid move by Crow as It is Vulture's Turn to play!\n";
            alert("It is Vulture's turn to play!");
        }
    }else if(currentToken=="vulture"){
        if(!turnOfCrow){
            if(!(ev.target.className=="vulture" || ev.target.className=="crows")){

                let jumps = [];
                let adj = [];
                if(killingMoves[crowPos.get(data)] != null){
                    
                    let arr1 = killingMoves[crowPos.get(data)][0];
                    let arr2 = killingMoves[crowPos.get(data)][1];
                    if(posCrow.get(arr1[0])!=null && posCrow.get(arr1[1])==null){
                        jumps.push(arr1[1]);
                    }
                    if(posCrow.get(arr2[0])!=null && posCrow.get(arr2[1])==null){
                        jumps.push(arr2[1]);
                    }
                    possibleMoves[crowPos.get(data)].forEach(element => {
                        if(!posCrow.has(element)){
                            adj.push(element);
                        }
                    });
                    if(jumps.length!=0){
                        logString += "Vulture must Kill a crow.\n";
                        if(jumps.includes(ev.target.id)){
                        
                            if(arr1[1]==ev.target.id){
                                document.getElementById(posCrow.get(arr1[0])).remove();
                                captured++;
                                logString += "Crow "+posCrow.get(arr1[0])+" is Eliminated!\n";
                                crowPos.delete(posCrow.get(arr1[0]));
                                posCrow.delete(arr1[0]);
                                
                            }else if(arr2[1]==ev.target.id){
                                document.getElementById(posCrow.get(arr2[0])).remove();
                                captured++;
                                logString += "Crow "+posCrow.get(arr2[0])+" is Eliminated!\n";
                                crowPos.delete(posCrow.get(arr2[0]));
                                posCrow.delete(arr2[0]);
                            }
                            if(posCrow.get(crowPos.get(data))!=null){
                                posCrow.delete(crowPos.get(data));
                            }
                            if(posCrow.get(ev.target.id)!=null){
                                posCrow.delete(ev.target.id);
                            }
                            logString += "Crow "+data+" is at postion "+ ev.target.id+"\n";
                            crowPos.set(data,ev.target.id);
                            posCrow.set(ev.target.id,data);
                            console.log(crowPos);
                            console.log(posCrow);
                            ev.target.appendChild(document.getElementById(data));
                            turnOfCrow=1;
    
                        }else{
                            logString += "Invalid Move - Vulture must Try killing a Crow.\n";
                            alert("Invalid Move- Try killing a crow!");
                        }
                    }else if(adj.includes(ev.target.id)){
                        if(posCrow.get(crowPos.get(data))!=null){
                            posCrow.delete(crowPos.get(data));
                        }
                        if(posCrow.get(ev.target.id)!=null){
                            posCrow.delete(ev.target.id);
                        }
                        logString += "Crow "+data+" is at postion "+ ev.target.id+"\n";
                        crowPos.set(data,ev.target.id);
                        posCrow.set(ev.target.id,data);
                        ev.target.appendChild(document.getElementById(data));
                        turnOfCrow=1;
                    }
                    
                    if(captured>=4){
                        logString += "VULTURE Wins the Game!.";
                        gameOver=true;
                        alert("Vulture WINS!!!!!");
                        alert("Refresh the Page to Play again!!");
                    }

                }else{
                    if(posCrow.get(crowPos.get(data))!=null){
                        posCrow.delete(crowPos.get(data));
                    }
                    if(posCrow.get(ev.target.id)!=null){
                        posCrow.delete(ev.target.id);
                    }
                    logString += "Crow "+data+" is at postion "+ ev.target.id+"\n";
                    crowPos.set(data,ev.target.id);                    
                    posCrow.set(ev.target.id,data);
                    ev.target.appendChild(document.getElementById(data));
                    turnOfCrow=1;
                }

            }
        }else{
            logString+= "Invalid- Move - It is Crow's turn to Play.\n";
            alert("It is Crow's turn to play!");
        }
    }

    let jumps=[];
    let adj=[];
    if(killingMoves[crowPos.get("vulture")]!=null){
        let arr1 = killingMoves[crowPos.get("vulture")][0];
        let arr2 = killingMoves[crowPos.get("vulture")][1];
        if(posCrow.get(arr1[0])!=null && posCrow.get(arr1[1])==null){
            jumps.push(arr1[1]);
        }
        if(posCrow.get(arr2[0])!=null && posCrow.get(arr2[1])==null){
            jumps.push(arr2[1]);
        }
        possibleMoves[crowPos.get("vulture")].forEach(element => {
            if(!posCrow.has(element)){
                adj.push(element);
            }
            
        });

        if(jumps.length==0 && adj.length==0){
            logString+= "CROWS Won the Game!.\n";
            gameOver=true;
            alert("Crows WON the Game!!");
            alert("Refresh the Page to Play again!!");
        }
    }

    }else{
        logString+= "Game OVER cannot move\n";
        alert("Game over cannot move");
    }
    
}

 function getLogs(){
     document.getElementById("log").href = 'data:text/plain;charset=utf-11,' + encodeURIComponent(logString);
 }


