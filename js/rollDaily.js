var dailyType, locationType, sooshName, sPronouns, companionName, cPronouns, itemName, successModifier, skillBoost, dieRoll, dailyRollStr;
var stats = TAFFY();
var companionHandlingCases = [
    ["playing frisbee",
     "Oh no! Looks like [SOOSH] got too excited and accidentally hit [COMPANION] in the head with the frisbee.",
     "It seems like [COMPANION] is getting the hang of it, even if [CPRONOUN'RE] not able to throw the frisbee back at [SOOSH] accurately.",
     "It seems like [COMPANION] is really good at this! In fact, the two of them wore themselves out from playing frisbee the whole afternoon.",
     "Wow! [COMPANION] is a natural at this! [COMPANION'RE] is excited to play catch again another time. Maybe the two of you should consider becoming ultimate frisbee players."],
     ["playing at an obstacle course",
      "Oh no! [COMPANION] got tripped up and face-planted into the ground after trying to jump the first obstacle.",
      "Looks like the two of them were okay today. Even though [COMPANION] wasn't able to jump over a couple of the obstacles, [CPRONOUN'RE] excited to try this again and hopefully do better next time.",
      "Looks like the two of them were pretty good today. They completed the course quickly, although each of them tripped over a couple of the obstacles. If they practice just a little bit more, they could get the fastest time for the course!",
      "Wow! The two of them were naturals at this! In fact, together they might have the highest score for the course!"],
     ["learning tricks",
      "Oh no! They decided to try playing patty-cake at first, but [SOOSH] accidentally hit [COMPANION] square in the face.",
      "Looks like [COMPANION] is getting the hang of it. [CPRONOUN_CAP] can sit and lie down on command, but [CPRONOUN'RE] still confused about what other commands mean.",
      "[COMPANION] really impressed [SOOSH] today! On top of learning how to sit, roll over, and bark, [CPRONOUN] even learned how to do a cool new magic trick.",
      "Wow! [COMPANION] learned a ton of tricks today! [CPRONOUN] even can communicate totally in sign-language while rubbing [CPRONOUNEIR] stomach and patting [CPRONOUNEIR] head."],
     ["playing dress-up",
      "Oh no! [SOOSH] commented that [COMPANION]'s makeup looked like it was applied with a Slippery Sammy.",
      "Looks like [COMPANION] is getting the hang of it. [CPRONOUNEIR_CAP] makeup is a bit messy, but the two of them had a lot of fun trying on different clothes.",
      "They had a lot of fun, and both their makeup and outfits turned out lovely! The two of them are ready for a night on the town.",
      "Wow! The two of them look like born super models. Maybe they'll appear on the cover of Kyootie Soosh Quarterly together!"]
];

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

function rollDie(dieSize) {
  return Math.floor((Math.random() * dieSize) + 1);
}

function modifiedRollDie(dieSize) {
  return Math.floor((Math.random() * dieSize) + 1) + successModifier + addSkillBoost(skillBoost);
}

function rollDaily() {
    $("#dailyOutput").text("Loading...");
    $("#thumbnailOutput").text("");
    sooshName = $("#sooshName").val();
    if (allSooshNames.indexOf(sooshName) <= -1) {
        $("#sooshNameError").slideDown();
        return;
    }

    dailyType = $("#dailyType option:selected").text();
    locationType = $("#locationType option:selected").text();
    sooshName = sooshName.split(" :: ")[1]; // strip the USERNAME :: from infront of the name
    sPronouns = sooshARPGDirectory({sooshName:sooshName}).select("sPronouns")[0];
    companionName = sooshARPGDirectory({sooshName:sooshName}).select("companionName")[0];
    cPronouns = sooshARPGDirectory({sooshName:sooshName}).select("cPronouns")[0];
    itemName = $("#inputItemName").val();
    successModifier = parseInt($("#inventoryBuff>.activeBtn").text());
    skillBoost = 0;

    var currSooshSpreadsheet = sooshARPGDirectory({sooshName:sooshName}).select("spreadsheetURL")[0];
    if ((currSooshSpreadsheet != "x") && (dailyType != "Crafting")) {
        Tabletop.init( {
            key: currSooshSpreadsheet,
            callback: fetchSooshInfo
        } );
    } else {
        finalRollDaily();
    }
}

function fetchSooshInfo(data, tabletop) {
    var currSooshStats = tabletop.sheets("Stats");
    for (i=0; i<currSooshStats.elements.length; i++) {
        if (currSooshStats.elements[i].key == (dailyType + " EXP")) {
            skillBoost = getCurrentLevel(currSooshStats.elements[i].value);
            finalRollDaily();
            return;
        }
    }
    finalRollDaily();
    return;
}

function getCurrentLevel(lifeskillexp) {
    var finalid = 99;
    var expDiff = 0;
    statExpLevels().each(function (expLvl) {
        if (((lifeskillexp - expLvl.runningTotalExp) < expLvl.exp) && (finalid == 99)) {
            finalid = expLvl.id;
            expDiff = lifeskillexp - expLvl.runningTotalExp;
        }
    });
    return finalid-1;
}

function addSkillBoost(sBoost) {
    var newSkillBoost = sBoost - 1;
    if (newSkillBoost > 0) {
        return newSkillBoost;
    } else {
        return 0;
    }
}

function finalRollDaily() {
    dieRoll = modifiedRollDie(20);
    if (dailyType == "Crafting") {
        if (dieRoll==1)
            dailyRollStr = "CRAFTING: results in a failure and a negative debuff";
        else if ((dieRoll>=2) && (dieRoll<=8))
            dailyRollStr = "CRAFTING: straight failure";
        else if ((dieRoll>=9) && (dieRoll<=12))
            dailyRollStr = "CRAFTING: failure but creates a new item";
        else if ((dieRoll>=13) && (dieRoll<=19))
            dailyRollStr = "CRAFTING: success";
        else if (dieRoll>=20)
            dailyRollStr = "CRAFTING: success + a buff for the next time they create an item";
        $("#dailyOutput").text(dailyRollStr);
    } else if ((dailyType == "Hunting") || (dailyType == "Angling")) {
        if (dieRoll==1) {
            if (dailyType == "Hunting") {
                dailyRollStr = sooshName + " went " + dailyType + " in " + locationType + ".\n";
                dailyRollStr += getProperPronoun(sPronouns, "they").capitalizeFirstLetter() + " managed to find BEES!!!!\n";
                dailyRollStr += "Unfortunately " + getProperPronoun(sPronouns, "they") + " received the <b>BEES! Status Infliction</b>. " + getProperPronoun(sPronouns, "they").capitalizeFirstLetter() + " will get -2 to hunting rolls over the next 2 days.\n";
                $("#dailyOutput").text(dailyRollStr);
                $("#thumbnailOutput").text("https://sta.sh/01jjwozjr50d");
            } else {
                printDailyRollResult(false,true,"","","");
            }
        } else if ((dieRoll>=2) && (dieRoll<=6))
            printDailyRollResult(false,false,"","","");
        else if ((dieRoll>=7) && (dieRoll<=12))
            printDailyRollResult(true,false,1,"Common",[dailyType]);
        else if ((dieRoll>=13) && (dieRoll<=16))
            printDailyRollResult(true,false,1,"Uncommon",[dailyType]);
        else if ((dieRoll>=17) && (dieRoll<=19))
            printDailyRollResult(true,false,1,"Rare",[dailyType]);
        else if (dieRoll>=20) {
            if (dailyType == "Hunting") {
                dailyRollStr = sooshName + " went " + dailyType + " in " + locationType + ".";
                dailyRollStr += getProperPronoun(sPronouns, "they").capitalizeFirstLetter() + " managed to find 1 Lunar Moth!!!\n";
                dailyRollStr += getProperPronoun(sPronouns, "they have").capitalizeFirstLetter() + " been blessed by its beauty and received the <b>Lunar Moth Status Infliction</b>! " + getProperPronoun(sPronouns, "they").capitalizeFirstLetter() + " will get +1 to hunting rolls over the next 2 days.\n";
                $("#thumbnailOutput").text("https://sta.sh/022sqz8ki9tj");
                $("#dailyOutput").text(dailyRollStr);
            } else {
                printDailyRollResult(true,true,1,"Rare",[dailyType]);
            }
        }
    } else if ((dailyType == "Mining") || (dailyType == "Wood-Cutting")) {
        if (dieRoll==1)
            printDailyRollResult(false,true,"","","");
        else if ((dieRoll>=2) && (dieRoll<=6))
            printDailyRollResult(false,false,"","","");
        else if ((dieRoll>=7) && (dieRoll<=12))
            printDailyRollResult(true,false,getRockWoodGatheringQuantity(),"Common",[dailyType]);
        else if ((dieRoll>=13) && (dieRoll<=16))
            printDailyRollResult(true,false,getRockWoodGatheringQuantity(),"Uncommon",[dailyType]);
        else if ((dieRoll>=17) && (dieRoll<=19))
            printDailyRollResult(true,false,getRockWoodGatheringQuantity(),"Rare",[dailyType]);
        else if (dieRoll>=20)
            printDailyRollResult(true,true,getRockWoodGatheringQuantity(),"Rare",[dailyType]);
    } else if (dailyType == "Gathering") {
        if (dieRoll==1)
            printDailyRollResult(false,true,"","","");
        else if ((dieRoll>=2) && (dieRoll<=6))
            printDailyRollResult(false,false,"","","");
        else if ((dieRoll>=7) && (dieRoll<=12))
            printDailyRollResult(true, false, getRockWoodGatheringQuantity(), "Common", getGatheringCategory());
        else if ((dieRoll>=13) && (dieRoll<=16))
            printDailyRollResult(true, false, getRockWoodGatheringQuantity(), "Uncommon", getGatheringCategory());
        else if ((dieRoll>=17) && (dieRoll<=19))
            printDailyRollResult(true, false, getRockWoodGatheringQuantity(), "Rare", getGatheringCategory());
        else if (dieRoll>=20)
            printDailyRollResult(true, true, getRockWoodGatheringQuantity(), "Rare", getGatheringCategory());
    } else if (dailyType == "Cooking") {
        dailyRollStr = sooshName + " tried " + getProperPronoun(sPronouns, "their") + " hand at cooking " + itemName + ".\n";
        if (dieRoll==1)
            dailyRollStr += getProperPronoun(sPronouns, "they").capitalizeFirstLetter() + " tried tasting it and had to immediately spit it out. Oh no! Looks like " + getProperPronoun(sPronouns, "their") + " " + itemName + " got burnt in the cooking process.\nUnfortunately " + getProperPronoun(sPronouns, "they") + " received the NEGATIVE STATUS.";
        else if ((dieRoll>=2) && (dieRoll<=6)) {
            console.log(getProperPronoun(sPronouns, "they"));
            dailyRollStr += "Looks like " + getProperPronoun(sPronouns, "they") + " left it on the stove for too long and burnt it. Better luck next time!";
        } else if ((dieRoll>=7) && (dieRoll<=11))
            dailyRollStr += "It turned out super delicious! In fact, it was so good, " + sooshName + " couldn't help themselves and ate the whole " + itemName + "!\n" + getProperPronoun(sPronouns, "they are").capitalizeFirstLetter() + " awarded XX exp.";
        else if ((dieRoll>=12) && (dieRoll<=19))
            dailyRollStr += "It turned out super delicious! Good thing " + sooshName + " made a big batch or " + getProperPronoun(sPronouns, "they") + " might have eaten it all.\n" + getProperPronoun(sPronouns, "they").capitalizeFirstLetter() + " managed to cook " + itemName + ".\n" + getProperPronoun(sPronouns, "they are").capitalizeFirstLetter() + " awarded XX exp.";
        else if (dieRoll>=20)
            dailyRollStr += getProperPronoun(sPronouns, "they").capitalizeFirstLetter() + " cooked up a storm today! With so much delicious " + itemName + ", this is a cause for celebration!\n" + getProperPronoun(sPronouns, "they").capitalizeFirstLetter() + " managed to cook " + itemName + ".\n" + getProperPronoun(sPronouns, "they are").capitalizeFirstLetter() + " awarded XX exp.\n" + getProperPronoun(sPronouns, "they").capitalizeFirstLetter() + " also received the POSITIVE STATUS.";
        $("#dailyOutput").text(dailyRollStr);
    } else if (dailyType == "Companion Handling") {
        currCHCase = companionHandlingCases[Math.floor(Math.random()*companionHandlingCases.length)];
        dailyRollStr = sooshName + " tried " + getProperPronoun(sPronouns, "their") + " hand at companion handling with " + companionName + ". They decided to try " + currCHCase[0] + ".\n";
        if (dieRoll==1)
            dailyRollStr += getCurrCHCase(1) + " Hopefully " + companionName + " isn't too hurt and angry.\nUnfortunately, they received the NEGATIVE STATUS and lost -20 friendliness exp.";
        else if ((dieRoll>=2) && (dieRoll<=6))
            dailyRollStr += "Looks like " + companionName + " isn't listening to " + sooshName + " right now. Maybe " + getProperPronoun(cPronouns,"they're") + " annoyed?\nUnfortunately, they lost -10 friendliness exp.";
        else if ((dieRoll>=7) && (dieRoll<=11))
            dailyRollStr += getCurrCHCase(2) + "\n" + sooshName + " earned +10 handler exp. and together they earned +10 friendliness exp.";
        else if ((dieRoll>=12) && (dieRoll<=19))
            dailyRollStr += getCurrCHCase(3) + "\n" + sooshName + " earned +20 handler exp. and together they earned +20 friendliness exp.";
        else if (dieRoll>=20)
            dailyRollStr += getCurrCHCase(4) + "\n" + sooshName + " earned +30 handler exp. and together they earned +30 friendliness exp.";
        $("#dailyOutput").text(dailyRollStr);
    }
    $("#dailyOutput").text("<small>" + $("#dailyOutput").text());
}

function getCurrCHCase(chIndex) {
    var tempStr = currCHCase[chIndex].replace("[SOOSH]",sooshName).replace("[COMPANION]",companionName);
    tempStr = tempStr.replace("[SPRONOUN]",getProperPronoun(sPronouns,"they")).replace("[CPRONOUN]",getProperPronoun(cPronouns,"they"));
    tempStr = tempStr.replace("[CPRONOUN'RE]",getProperPronoun(cPronouns,"they're")).replace("[CPRONOUNEIR]",getProperPronoun(cPronouns,"their"))
    tempStr = tempStr.replace("[CPRONOUN_CAP]",getProperPronoun(cPronouns,"they").capitalizeFirstLetter()).replace("[CPRONOUNEIR_CAP]",getProperPronoun(cPronouns,"their").capitalizeFirstLetter());
    return tempStr;
}

function getProperPronoun(charPronoun, templatePronoun) {
    if (charPronoun == "they") { return templatePronoun; }
    if (templatePronoun == "they") {
        return charPronoun;
    } else if (templatePronoun == "they're") {
        if (charPronoun == "he") {
            return "he's";
        } else if (charPronoun == "she") {
            return "she's";
        }
    } else if (templatePronoun == "their") {
        if (charPronoun == "he") {
            return "his";
        } else if (charPronoun == "she") {
            return "her";
        }
    } else if (templatePronoun == "they have") {
        if (charPronoun == "he") {
            return "he has";
        } else if (charPronoun == "she") {
            return "she has";
        }
    }
}

function getRockWoodGatheringQuantity() {
    dieRoll = modifiedRollDie(20);
    switch (true) {
        case dieRoll>=1 && dieRoll<=5:
            return 1;
        case dieRoll>=6 && dieRoll<=10:
            return 2;
        case dieRoll>=11 && dieRoll<=15:
            return 3;
        case dieRoll>=16 && dieRoll<=19:
            return 4;
        case dieRoll>=20:
            return 5;
    }
}

function getGatheringCategory() {
    var options = [["Flower","Plant","Root"], ["Small Animal Items/Drops"],["Fruit","Vegetable","Berry"],["Crafting Item"],["Miscellaneous"],["Treasure"]];
    return options[rollDie(6)-1];
}

function getItems(currRarity, categories) {
    var allChoices = [];
    for (i=0; i<categories.length; i++) {
        allChoices = allChoices.concat(allItems({type:categories[i],rarity:currRarity,location:locationType}).select("name"));
    }
    // remove BEES
    var beeIndex = allChoices.indexOf("BEES");
    if (beeIndex > -1) {
        allChoices.splice(beeIndex, 1);
    }
    // remove Lunar Moth
    var mothIndex = allChoices.indexOf("Lunar Moth");
    if (mothIndex > -1) {
        allChoices.splice(mothIndex, 1);
    }
    console.log(allChoices);
    return allChoices;
}

/*
https://soosharpg.weebly.com/status-inflictions.html
All debuffs happen when a 1 is rolled; All buffs happen when a 20 is rolled.
Lucky Duck			buff for Angling, Mining, Wood-Cutting, Gathering
Unlucky Duck		???
Lazy Bork			debuff for Crafting, Angling, Mining, Wood-Cutting, Gathering
Happy Camper		???
Spooked Pupper		debuff for if soosh is too low level going into a specific area
BEES!!!				debuff for Hunting
Strong Senses		???
Magic Paws			buff for Crafting
Lunar Moth			buff for Hunting
*/

// printing function used for Crafting, Hunting, Angling, Mining, Wood-Cutting, Gathering, Cooking, Companion Handling
function printDailyRollResult(success, buffCase, quantity, rarity, categories) {
    var finalResult = sooshName + " went " + dailyType + " in " + locationType + ".\n";
    if (success) {
        var currItems = getItems(rarity, categories);
        if (currItems.length == 0) {
            finalResult += "Unfortunately " + getProperPronoun(sPronouns, "they") + " didn’t find anything, maybe next time!\n\n";
        } else {
            var currItemName = currItems[Math.floor(Math.random() * currItems.length)];
            finalResult += getProperPronoun(sPronouns, "they").capitalizeFirstLetter() + " managed to find " + quantity + " " + currItemName + "!\n";
            $("#thumbnailOutput").text(allItems({name:currItemName}).last().thumbUrl);
            finalResult += getProperPronoun(sPronouns, "they are").capitalizeFirstLetter() + " awarded ";
            switch (true) {
                case rarity=="Common":
                    finalResult += "10";
                    break;
                case rarity=="Uncommon":
                    finalResult += "15";
                    break;
                case rarity=="Rare":
                    finalResult += "25";
                    break;
            }
            finalResult += " " + dailyType.toLowerCase() + " exp.\n";
            if (buffCase) {
                // Hunting is handled in finalRollDaily()
                if (dailyType == "Crafting") {
                    finalResult += getProperPronoun(sPronouns, "they").capitalizeFirstLetter() + " also received the <b>Magic Paws Status Infliction</b>. " + getProperPronoun(sPronouns, "they").capitalizeFirstLetter() + " will gain +1 to their crafting roll tomorrow.\n";
                } else { // Angling, Mining, Wood-Cutting, Gathering
                    finalResult += getProperPronoun(sPronouns, "they").capitalizeFirstLetter() + " also received the <b>Lucky Duck Status Infliction</b>! " + getProperPronoun(sPronouns, "they").capitalizeFirstLetter() + " will gain +1 to their daily roll tomorrow.\n";
                }
            }
        }
    } else if (!success && buffCase) {
        finalResult += "Unfortunately " + getProperPronoun(sPronouns, "they") + " didn’t find anything, and " + getProperPronoun(sPronouns, "they") + " also received the ";
        // Hunting is handled in finalRollDaily()
         // Crafting, Angling, Mining, Wood-Cutting, Gathering
         finalResult += "<b>Lazy Bork Status Infliction</b>. " + getProperPronoun(sPronouns, "they").capitalizeFirstLetter() + " will be unable to perform a daily tomorrow.";
    } else if (!success) {
        finalResult += "Unfortunately " + getProperPronoun(sPronouns, "they") + " didn’t find anything, maybe next time!\n\n";
    }
    $("#dailyOutput").text(finalResult);
}
