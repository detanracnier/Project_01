// https://api.fungenerators.com/name/generate?
/* categories [elf,dragon,pirate,dwarf,demon,angel,medieval,dothraki,valyrian,fairy,warrior,dnd-gnome]
also [shop,bakery,brewery]
parameters [limit, start] */

let button = $("#npcGenButton");
let raceInput = $("#raceInput");
let listOfListofNames = JSON.parse(localStorage.getItem("listOfListOfNames"));
if(listOfListofNames===null){
    listOfListofNames = [];
}

button.on("click",function(){
    //set user input
    let userInput = {
        "race":raceInput.val(),
        "gender":"male"
    };
    //check if list is empty
    if(listOfListofNames.length===0){
        getName(userInput.race,userInput.gender);
    } else {
        //check if list for race already exists
        if(listOfListofNames.filter(list => list.category === userInput.race).length===0){
            //create list if none exists
            getName(userInput.race,userInput.gender);
        } else {
            let index = listOfListofNames.findIndex((listOfNames) => listOfNames.category === userInput.race);
            if (listOfListofNames[index].nextNameIndex === listOfListofNames[index].list.length-1){
                listOfListofNames[index].nextNameIndex = 0;
            }
            //get next index of next name in the list
            let nextNameIndex = listOfListofNames[index].nextNameIndex;
            createNPC(listOfListofNames[index].list[nextNameIndex]);
            listOfListofNames[index].nextNameIndex++;
            localStorage.setItem("listOfListOfNames",JSON.stringify(listOfListofNames));
        }
    }
})

function getName(race,gender){
    let api_key = "2ff8BbYOdnIM3EMt6RgYkAeF"
    let queryURL = "https://api.fungenerators.com/name/generate?api_key=" + api_key + "&variant=" + gender + "&limit=100&category=" + race;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .fail(function(response){
        console.log("API call to name generator errored - error code "+response.responseJSON.error.code);
    })
    .done(function(response){
        console.log("API call made");
        listOfListofNames.push({"category":race,"nextNameIndex":0,"list":response.contents.names});
        let index = listOfListofNames.length-1;
        createNPC(listOfListofNames[index].list[listOfListofNames[index].nextNameIndex]);
        listOfListofNames[index].nextNameIndex++;
        localStorage.setItem("listOfListOfNames",JSON.stringify(listOfListofNames));
    })
}

function createNPC(fullName){
    let npcCharacter = {
        "firstName": fullName.split(" ")[0],
        "lastName": fullName.split(" ")[fullName.split(" ").length-1],
        "wealth": getWealth()
    }
    console.log(npcCharacter);
}

function getWealth(){
    let wealthLevels = ["destitute","poor","modest","well-off","wealthy","ultra-rich"];
    let rndWealth = Math.floor(Math.random()*100);
    if(rndWealth < 5){ //destitute
        return wealthLevels[0];
    } else if (rndWealth < 15){ //poor
        return wealthLevels[1];
    } else if (rndWealth <65){ //modest
        return wealthLevels[2];
    } else if (rndWealth < 80){ //well-off
        return wealthLevels[3];
    } else if (rndWealth < 95){ //wealthy
        return wealthLevels[4];
    } else {                    //ultra-rich
        return wealthLevels[5];
    }
}