var public_spreadsheet_url = "https://docs.google.com/spreadsheets/d/1xUaU5i38rzwjQCs5RRwAQUIa6kpNcTFtlSSp_Tr80nE/edit?usp=sharing";
var a,b;
var SPICY_COLOR = "#FF0000";
var BITTER_COLOR = "#0000FF";
var SWEET_COLOR = "#FF00FF";
var SAVORY_COLOR = "#00FF00";

// public Taffies
var expLevels = TAFFY();
var statExpLevels = TAFFY();
var allItems = TAFFY();
var recipes = TAFFY();
var achievements = TAFFY();
var bandanaCharms = TAFFY();

// user Taffies
var stats = TAFFY();
var lifeSkillStats = TAFFY();
var inventory = TAFFY();
var promptsOrQuests = TAFFY();
var sooshAchievements = TAFFY();
var sooshBandana = TAFFY();

function fadeOutLoader() {
  $("#loaderBlock").fadeOut();
}

$(document).ready( function() {
  a = Tabletop.init( { key: public_spreadsheet_url,
                   callback: publicInfo,
                   wanted: [ "memberOverview", "expLevels", "statExpLevels", "allItems", "recipes", "achievements", "bandanaCharms" ],
                   debug: false } );
});

function publicInfo(data, tabletop) {
  var currentSoosh;
  var currentSooshUsername = window.location.search;
  currentSooshUsername = currentSooshUsername.replace("?username=","");
  $.each( tabletop.sheets("expLevels").all(), function(i, entry) {
    expLevels.insert({"id":parseInt(entry.id),
                      "exp":parseInt(entry.exp),
                      "runningTotalExp":parseInt(entry.runningTotalExp)
    });
  });
  $.each( tabletop.sheets("memberOverview").all(), function(i, soosh) {
    if (soosh.username == currentSooshUsername) {
      currentSoosh = { "username":soosh.username,
                       "status":soosh.status,
                       "sooshName":soosh.sooshName,
                       "village":soosh.village,
                       "databaseURL":soosh.databaseURL,
                       "appURL":soosh.appURL,
                       "spreadsheetURL":soosh.spreadsheetURL,
                       "totalExp":soosh.totalExp,
                       "swirlSeeds":soosh.swirlSeeds,
                       "achieveCount":soosh.achieveCount,
                       "hotStreak":soosh.hotStreak
                     };
      //var progressBarColors = {novice:"red",rookie:"yellow",apprentice:"green",whiz:"blue",genius:"IDK",master:"IDK",hero:"IDK"};
      document.title = "SooshARPG | " + currentSoosh.sooshName;
      $("#currentSooshName").text(currentSoosh.sooshName);
      $("#currentSooshUsername").html("<a target='_blank' href='https://" + currentSoosh.username.toLowerCase() + ".deviantart.com/'>" + currentSoosh.username + "</a>");
      $("#currentSooshVillage").text(soosh.village);
      if (soosh.village == "Spicy") {
        $("#currentSooshVillage").css("color",SPICY_COLOR);
        $("body").css("background-color",SPICY_COLOR);
      } else if (soosh.village == "Bitter") {
        $("#currentSooshVillage").css("color",BITTER_COLOR);
        $("body").css("background-color",BITTER_COLOR);
      } else if (soosh.village == "Sweet") {
        $("#currentSooshVillage").css("color",SWEET_COLOR);
        $("body").css("background-color",SWEET_COLOR);
      } else if (soosh.village == "Savory") {
        $("#currentSooshVillage").css("color",SAVORY_COLOR);
        $("body").css("background-color",SAVORY_COLOR);
      }
      $("#sooshButtons").html("<a target=\"_blank\" href=\"" + soosh.appURL + "\"><button type=\"button\" class=\"rpgui-button\"><p>App</p></button></a><a target=\"_blank\" href=\"" + soosh.databaseURL + "\"><button type=\"button\" class=\"rpgui-button\"><p>DB Entry</p></button></a>");
      var currentLevel = 99;
      expLevels().each(function (expLevel) {
        if (((soosh.totalExp - expLevel.runningTotalExp) < expLevel.exp) && (currentLevel == 99)) {
          currentLevel = expLevel.id;
        }
      });
      var progressBarStr = "<label><div class=\"progressBarFlex\"><div>Level " + currentLevel + ":</div><div>" + (soosh.totalExp - expLevels({id:currentLevel}).first().runningTotalExp) + "/" + expLevels({id:currentLevel+1}).first().exp + "</div></div></label>";
      var percent = Math.round((soosh.totalExp - expLevels({id:currentLevel}).first().runningTotalExp) / (expLevels({id:currentLevel+1}).first().exp) * 100);
      progressBarStr += "<div class=\"rpgui-progress red\" data-rpguitype=\"progress\"><div class=\"rpgui-progress-track\"><div class=\"rpgui-progress-fill red\" style=\"left: 0px; width: " + percent + "%;\"></div></div><div class=\"rpgui-progress-left-edge\"></div><div class=\"rpgui-progress-right-edge\"></div></div>";
      $("#expProgressBar").html(progressBarStr);

      if (soosh.spreadsheetURL == "x") {
        $("#lifeSkillsExperienceCard").next().css("display","none");
        $("#inventoryCard").next().css("display","none");
        $("#achievementsCard").next().css("display","none");
        $("#sooshPersonalityInfoSection").css("display","none");
        $("#sooshPronouns").css("display","block");
        $("#sooshFood").css("display","block");
        $("#sooshMagic").css("display","block");
        $("#noSpreadsheetInfo").css("display","block");
        fadeOutLoader();
      } else {
        $.each( tabletop.sheets("statExpLevels").all(), function(i, entry) {
          statExpLevels.insert({"id":parseInt(entry.id),
                                "level":entry.level,
                                "exp":parseInt(entry.exp),
                                "runningTotalExp":parseInt(entry.runningTotalExp),
                                "progress":entry.progress
          });
        });
        $.each( tabletop.sheets("allItems").all(), function(i, entry) {
          allItems.insert({"name":entry.name,
                           "smallImgUrl":entry.smallImgUrl,
                           "bigImgUrl":entry.bigImgUrl,
                           "lifeSkill":entry.lifeSkill,
                           "description":entry.description,
                           "type":entry.type,
                           "rarity":entry.rarity,
                           "location":entry.location
          });
        });
        $.each( tabletop.sheets("recipes").all(), function(i, entry) {
          recipes.insert({"recipeID":parseInt(entry.recipeID),
                          "recipeName":entry.recipeName,
                          "lifeSkillLevel":parseInt(entry.lifeSkillLevel),
                          "quantity":parseInt(entry.quantity),
                          "name":entry.name
          });
        });
        $.each( tabletop.sheets("achievements").all(), function(i, entry) {
          achievements.insert({"type":entry.type,
                               "name":entry.name,
                               "num":parseInt(entry.num),
                               "date":entry.date,
                               "flavorText":entry.flavorText,
                               "description":entry.description,
                               "difficulty":parseInt(entry.difficulty),
                               "awards":entry.awards
           });
          });
          $.each( tabletop.sheets("bandanaCharms").all(), function(i, entry) {
            bandanaCharms.insert({"name":entry.name,
                                 "imgUrl":entry.imgUrl,
                                 "description":entry.description
          });
        });
        b = Tabletop.init( { key: soosh.spreadsheetURL,
                         callback: sooshInfo,
                         wanted: [ "Stats", "Inventory", "PromptsAndQuests", "Achievements", "Bandana" ],
                         debug: false } );
      }
      return;
    }
  });
}

function sooshInfo(data, tabletop) {
  $.each( tabletop.sheets("Stats").all(), function(i, entry) {
    stats.insert({"key":entry.key,
                  "value":entry.value
    });
  });
  $.each( tabletop.sheets("Inventory").all(), function(i, entry) {
    inventory.insert({"quantity":parseInt(entry.quantity),
                      "name":entry.name
    });
  });
  $.each( tabletop.sheets("PromptsAndQuests").all(), function(i, entry) {
    promptsOrQuests.insert({"eventType":entry.eventType,
                            "name":entry.name,
                            "imgUrl":entry.imgUrl,
                            "promptUrl":entry.promptUrl
    });
  });
  $.each( tabletop.sheets("Achievements").all(), function(i, entry) {
    sooshAchievements.insert({"achievementNo":parseInt(entry.achievementNo),
                              "dateAchieved":entry.dateAchieved
    });
  });
  $.each( tabletop.sheets("Bandana").all(), function(i, entry) {
    sooshBandana.insert({"charmName":entry.charmName,
                         "dateEarned":entry.dateEarned
    });
  });
  $("#profilePic").attr("src",stats({key:"Profile Pic"}).first().value);
  $("#sooshPronouns").html("<u>Pronoun</u>: " + stats({key:"Pronouns"}).first().value);
  $("#sooshFood").html("<u>Food/Drink</u>: " + stats({key:"Food/Drink"}).first().value);
  $("#sooshMagic").html("<u>" + stats({key:"Magic Type"}).first().value + " Magic</u>: " + stats({key:"Magic Description"}).first().value);
  $("#personalityBlurb").html("<p>" + stats({key:"Personality"}).first().value + "</p>");
  $("#notableRelationshipsBlurb").html("<p>" + stats({key:"Notable Relationships"}).first().value + "</p>");
  if (stats({key:"favicon"}).first().value != "") {
    $("#favicon").attr("href",stats({key:"favicon"}).first().value);
  }
  var backgroundValue = stats({key:"background"}).first().value
  if (backgroundValue != "") {
    if (backgroundValue.includes("#")) {
      $("body").css("background-color",backgroundValue);
    } else {
      $("body").css("background-image","url(" + backgroundValue + ")");
    }
  }
  printLifeSkillsExperience();
  printPromptsAndQuests();
  printInventory();
  printCrafting();
  printBadges();
  printAchievements();
  fadeOutLoader();
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
  return [finalid-1,expDiff];
}

function printLifeSkillsExperience() {
  lifeSkillStats.insert({"exp":parseInt(stats({key:"Alchemy EXP"}).last().value),"name":"Alchemy"});
  lifeSkillStats.insert({"exp":parseInt(stats({key:"Angling EXP"}).last().value),"name":"Angling"});
  lifeSkillStats.insert({"exp":parseInt(stats({key:"Hunting EXP"}).last().value),"name":"Hunting"});
  lifeSkillStats.insert({"exp":parseInt(stats({key:"Gathering EXP"}).last().value),"name":"Gathering"});
  lifeSkillStats.insert({"exp":parseInt(stats({key:"Mining EXP"}).last().value),"name":"Mining"});
  lifeSkillStats.insert({"exp":parseInt(stats({key:"Wood-Cutting EXP"}).last().value),"name":"Wood-cutting"});
  var finalString = "";
  lifeSkillStats().each(function (lifeSkill) {
    var levelresult = getCurrentLevel(lifeSkill.exp);
    var levelCap = (statExpLevels({id:(levelresult[0]+1)}).first()).exp;
    var percentage = Math.round(100*(levelresult[1]/levelCap));
    finalString += "<label><div class=\"progressBarFlex\"><div>" + (statExpLevels({id:levelresult[0]}).first()).level + " " + lifeSkill.name + ":</div><div>" + levelresult[1] + "/" + levelCap + "</div></div></label>";
    finalString += "<div id=\"currentSoosh" + lifeSkill.name + "\"><div class=\"rpgui-progress " + (statExpLevels({id:levelresult[0]}).first()).progress + "\" data-rpguitype=\"progress\"><div class=\"rpgui-progress-track\"><div class=\"rpgui-progress-fill " + (statExpLevels({id:levelresult[0]}).first()).progress + "\" style=\"left: 0px; width: " + percentage + "%;\"></div></div><div class=\"rpgui-progress-left-edge\"></div><div class=\"rpgui-progress-right-edge\"></div></div></div>";
  });
  $("#lifeSkillsExperience").html(finalString);
}

function printPromptsAndQuests() {
  var finalString = "";
  promptsOrQuests().each(function (promptOrQuest) {
    finalString += "<a href=\"" + promptOrQuest.promptUrl + "\" class=\"Rtable-cell rpgui-container framed-grey promptContainer ";
    if (promptOrQuest.eventType == "prompt") { finalString += "promptContainer-prompt"; }
    else if (promptOrQuest.eventType == "alchemy") { finalString += "promptContainer-quest promptContainer-alchemy"; }
    else if (promptOrQuest.eventType == "angling") { finalString += "promptContainer-quest promptContainer-angling"; }
    else if (promptOrQuest.eventType == "hunting") { finalString += "promptContainer-quest promptContainer-hunting"; }
    else if (promptOrQuest.eventType == "gathering") { finalString += "promptContainer-quest promptContainer-gathering"; }
    else if (promptOrQuest.eventType == "mining") { finalString += "promptContainer-quest promptContainer-mining"; }
    else if (promptOrQuest.eventType == "wood-cutting") { finalString += "promptContainer-quest promptContainer-woodCutting"; }
    finalString += "\"><span class=\"promptContainerTitle\">" + promptOrQuest.name + "</span><img src=\"" + promptOrQuest.imgUrl + "\"></a>";
  });
  $("#promptsAndQuestsSection").html(finalString);
}

function printInventory() {
  var finalString = "";
  inventory().order("name desc"); // sort in alphabetical order
  inventory().each(function (inventItem) {
    if (inventItem.quantity > 0) {
      finalString += "<div class=\"inventoryItem\">";
      finalString += "<div class=\"quantity\">" + inventItem.quantity + "</div>";
      if (allItems({name:inventItem.name}).last().smallImgUrl == "") {
        finalString += "<img src=\"https://orig00.deviantart.net/8601/f/2017/265/a/2/smallertransparentplaceholder_by_pepper_wood-dbo97we.png\">";
        finalString += "<div class=\"inventoryTooltipImage\">https://orig00.deviantart.net/05b2/f/2017/265/5/0/transparentplaceholder_by_pepper_wood-dbo95tw.png</div>";
      } else {
        finalString += "<img src=\"" + allItems({name:inventItem.name}).last().smallImgUrl + "\">";
        if (allItems({name:inventItem.name}).last().bigImgUrl != "x") {
          finalString += "<div class=\"inventoryTooltipImage\">" + allItems({name:inventItem.name}).last().bigImgUrl + "</div>";
        } else {
          finalString += "<div class=\"inventoryTooltipImage\">" + allItems({name:inventItem.name}).last().smallImgUrl + "</div>";
        }
      }

      finalString += "<div class=\"inventoryTooltipText\"><table>";
      finalString += "<tr><td><p><u>Name</u></p></td><td><p>" + allItems({name:inventItem.name}).last().name + "</p></td></tr>";
      finalString += "<tr><td><p><u>Type</u></p></td><td><p>" + allItems({name:inventItem.name}).last().type + "</p></td></tr>";
      finalString += "<tr><td><p><u>Rarity</u></p></td><td><p>" + allItems({name:inventItem.name}).last().rarity + "</p></td></tr>";
      finalString += "<tr><td><p><u>Location</u></p></td><td><p>" + allItems({name:inventItem.name}).last().location + "</p></td></tr>";
      finalString += "</table><p>" + allItems({name:inventItem.name}).last().description + "</p></div></div>";
    }
  });
  $("#inventoryContent").html(finalString);
  $(".inventoryItem").click(function() {
    if ($(this).hasClass("selectedItem")) {
      $(this).removeClass("selectedItem");
      $("#inventoryPreviewImage").fadeOut(300, function() {
        $("#inventoryPreviewImage").attr("src","img/transparentImage.png").fadeIn(300);
      });
      $("#inventoryPreviewText").slideUp(300);
    } else {
      $(".inventoryItem").removeClass("selectedItem");
      $(this).addClass("selectedItem");
      var newImage = $(this).children(".inventoryTooltipImage").text();
      var newText = $(this).children(".inventoryTooltipText").html();
      if ($("#inventoryPreviewImage").attr("src") == "img/transparentImage.png") {
        $("#inventoryPreviewImage").fadeOut(0, function() {
          $("#inventoryPreviewImage").attr("src",newImage).fadeIn(300);
        });
        $("#inventoryPreviewText").html(newText);
        $("#inventoryPreviewText").slideDown(300);
      } else {
        $("#inventoryPreviewImage").fadeOut(300, function() {
          $("#inventoryPreviewImage").attr("src",newImage).fadeIn(300);
        });
        $("#inventoryPreviewText").fadeOut(300, function() {
          $(this).html(newText).fadeIn(300);
        });
      }
    }
  });
}

function printCrafting() {
  lastID = recipes().max("recipeID");
  recipeString = "";
  for (i = 0; i <= lastID; i++) {
    recipeString += recipeCheck(i);
  }
  $("#craftingContent").html(recipeString);
  $(".craftingItem").click(function() {
    if ($(this).hasClass("selectedItem")) {
      $(this).removeClass("selectedItem");
      $("#inventoryPreviewImage").fadeOut(300, function() {
        $("#inventoryPreviewImage").attr("src","img/transparentImage.png").fadeIn(300);
      });
      $("#inventoryPreviewText").slideUp(300);
    } else {
      $(".craftingItem").removeClass("selectedItem");
      $(this).addClass("selectedItem");
      var newImage = $(this).children(".craftingTooltipImage").text();
      var newText = $(this).children(".craftingTooltipText").html();
      if ($("#inventoryPreviewImage").attr("src") == "img/transparentImage.png") {
        $("#inventoryPreviewImage").fadeOut(0, function() {
          $("#inventoryPreviewImage").attr("src",newImage).fadeIn(300);
        });
        $("#inventoryPreviewText").html(newText);
        $("#inventoryPreviewText").slideDown(300);
      } else {
        $("#inventoryPreviewImage").fadeOut(300, function() {
          $("#inventoryPreviewImage").attr("src",newImage).fadeIn(300);
        });
        $("#inventoryPreviewText").fadeOut(300, function() {
          $(this).html(newText).fadeIn(300);
        });
      }
    }
  });
}

function recipeCheck(id) {
  var recipeString = "";
  var recipeFlag = true; // turns false otherwise
  var currentRecipe = recipes({recipeID:id});
  var levelName = statExpLevels({id:recipes({recipeID:id}).first().lifeSkillLevel}).first().level;
  if (stats({name:"Alchemy"}).first().levelID >= recipes({recipeID:id}).first().lifeSkillLevel) {
    recipeString += "<p style=\"color:green\">Level Required: " + levelName + "</p>";
  } else {
    recipeString += "<p style=\"color:red\">Level Required: " + levelName + "</p>";
    recipeFlag = false;
  }
  currentRecipe.each(function (ingredient) {
    var inventoryItem = inventory({name:ingredient.name}).first();
    if (inventoryItem.quantity >= ingredient.quantity) {
      recipeString += "<p style=\"color:green\">" + inventoryItem.quantity + "/" + ingredient.quantity + " " + ingredient.name + "</p>";
    } else {
      if (inventoryItem.quantity > 0) {
        recipeString += "<p style=\"color:red\">" + inventoryItem.quantity + "/" + ingredient.quantity + " " + ingredient.name + "</p>";
      } else {
        recipeString += "<p style=\"color:red\">0/" + ingredient.quantity + " " + ingredient.name + "</p>";
      }
      recipeFlag = false;
    }
  });
  var recipeName = recipes({recipeID:id}).first().recipeName;
  recipeString = "<div class=\"craftingTooltipText\"><div class=\"craftingPreview\"><p><u>" + recipeName + "</u></p>" + recipeString + "</div></div></div>";
  var tempStr = "";
  if (recipeFlag==true) {
    tempStr = "<div class=\"craftingItem success\"><div class=\"quantity\">4</div>";
  } else {
    tempStr = "<div class=\"craftingItem failure\">";
  }
  tempStr += "<img src=\"" + allItems({name:recipeName}).first().smallImgUrl + "\">";
  if (allItems({name:recipeName}).first().bigImgUrl != "x") {
    tempStr += "<div class=\"craftingTooltipImage\">" + allItems({name:recipeName}).first().bigImgUrl + "</div>";
  } else {
    tempStr += "<div class=\"craftingTooltipImage\">" + allItems({name:recipeName}).first().smallImgUrl + "</div>";
  }
  recipeString = tempStr + recipeString;
  console.log(recipeString);
  return recipeString;
}

function printBadges() {
  finalString = "";
  sooshBandana().each(function (bandanaCharm) {
    finalString += "<div class=\"bandanaItem\"><img src=\"" + bandanaCharms({name:bandanaCharm.charmName}).first().imgUrl + "\">";
    finalString += "<div class=\"bandanaTooltipImage\">" + bandanaCharms({name:bandanaCharm.charmName}).first().imgUrl + "</div>";
    finalString += "<div class=\"bandanaTooltipText\"><div class=\"bandanaPreview\">";
    finalString += "<p><u>" + bandanaCharms({name:bandanaCharm.charmName}).first().name + "</u></p>";
    finalString += "<p>" + bandanaCharms({name:bandanaCharm.charmName}).first().description + "</p></div></div></div>";
  });
  $("#bandanaContent").html(finalString);
  $(".bandanaItem").click(function() {
    if ($(this).hasClass("selectedItem")) {
      $(this).removeClass("selectedItem");
      $("#inventoryPreviewImage").fadeOut(300, function() {
        $("#inventoryPreviewImage").attr("src","img/transparentImage.png").fadeIn(300);
      });
      $("#inventoryPreviewText").slideUp(300);
    } else {
      $(".bandanaItem").removeClass("selectedItem");
      $(this).addClass("selectedItem");
      var newImage = $(this).children(".bandanaTooltipImage").text();
      var newText = $(this).children(".bandanaTooltipText").html();
      if ($("#inventoryPreviewImage").attr("src") == "img/transparentImage.png") {
        $("#inventoryPreviewImage").fadeOut(0, function() {
          $("#inventoryPreviewImage").attr("src",newImage).fadeIn(300);
        });
        $("#inventoryPreviewText").html(newText);
        $("#inventoryPreviewText").slideDown(300);
      } else {
        $("#inventoryPreviewImage").fadeOut(300, function() {
          $("#inventoryPreviewImage").attr("src",newImage).fadeIn(300);
        });
        $("#inventoryPreviewText").fadeOut(300, function() {
          $(this).html(newText).fadeIn(300);
        });
      }
    }
  });
}

function printAchievements() {
  var finalString = "";
  var counters = [0,0,0,0,0,0,0,0,0,0]; //0total, 1done, 2tutorialTotal, 3tutorialDone, 4exclusiveTotal, 5exclusiveDone, 6questTotal, 7questDone, 8lifeSkillTotal, 9lifeSkillDone
  achievements().order("num desc");
  achievements().each(function (achievement) {
    counters[0]++;
    if (achievement.type == "tutorial") { counters[2]++; }
    else if (achievement.type == "exclusive") { counters[4]++; }
    else if (achievement.type == "quest") { counters[6]++; }
    else if (achievement.type == "lifeSkill") { counters[8]++; }

    var dateAchievedVal = sooshAchievements({"achievementNo":achievement.num}).first().dateAchieved;
    if (dateAchievedVal != null) {
      counters[1]++;
      if (achievement.type == "tutorial") {
        counters[3]++;
        finalString += "<div class=\"achievementBanner tutorial-achievement\"><div class=\"rpgui-container framed-golden achievementContainer tutorialBG\">";
      } else if (achievement.type == "exclusive") {
        counters[5]++;
        finalString += "<div class=\"achievementBanner exclusive-achievement\"><div class=\"rpgui-container framed-golden achievementContainer exclusiveBG\">";
      } else if (achievement.type == "quest") {
        counters[7]++;
        finalString += "<div class=\"achievementBanner quest-achievement\"><div class=\"rpgui-container framed-golden achievementContainer questBG\">";
      } else if (achievement.type == "lifeSkill") {
        counters[9]++;
        finalString += "<div class=\"achievementBanner lifeskills-achievement\"><div class=\"rpgui-container framed-golden achievementContainer lifeSkillsBG\">";
      }
      finalString += "<div class=\"achievementFlex\"><div class=\"achievementFlex\"><div>";
      if (achievement.type == "tutorial") { finalString += "<div class=\"rpgui-icon shield\"></div>"; }
      else if (achievement.type == "exclusive") { finalString += "<div class=\"rpgui-icon exclamation\"></div>"; }
      else if (achievement.type == "quest") { finalString += "<div class=\"rpgui-icon sword\"></div>"; }
      else if (achievement.type == "lifeSkill") { finalString += "<div class=\"rpgui-icon potion-blue\"></div>"; }
    } else {
      if (achievement.type == "tutorial") { finalString += "<div class=\"achievementBanner locked-achievement tutorial-achievement\">"; }
      else if (achievement.type == "exclusive") { finalString += "<div class=\"achievementBanner locked-achievement exclusive-achievement\">"; }
      else if (achievement.type == "quest") { finalString += "<div class=\"achievementBanner locked-achievement quest-achievement\">"; }
      else if (achievement.type == "lifeSkill") { finalString += "<div class=\"achievementBanner locked-achievement lifeskills-achievement\">"; }
      finalString += "<div class=\"rpgui-container framed-grey\">";
      finalString += "<div class=\"achievementFlex\"><div class=\"achievementFlex\"><div>";
      if (achievement.type == "tutorial") { finalString += "<div class=\"rpgui-icon shield-slot\"></div>"; }
      else if (achievement.type == "exclusive") { finalString += "<div class=\"rpgui-icon magic-slot\"></div>"; }
      else if (achievement.type == "quest") { finalString += "<div class=\"rpgui-icon weapon-slot\"></div>"; }
      else if (achievement.type == "lifeSkill") { finalString += "<div class=\"rpgui-icon potion-slot\"></div>"; }
    }
    finalString += "</div><div class=\"achievementText\">";
    if (achievement.num < 10) { finalString += "<p class=\"achievementTitle\">#00" + achievement.num; }
    else if (achievement.num < 100) { finalString += "<p class=\"achievementTitle\">#0" + achievement.num; }
    else { finalString += "<p class=\"achievementTitle\">#" + achievement.num; }
    finalString += " - " + achievement.name + "</p>";
    finalString += "<p class=\"achievementQuote\">" + achievement.flavorText + "</p>";
    finalString += "<p class=\"achievementDescription\">" + achievement.description + "</p></div></div>";
    finalString += "<div style=\"text-align:right\"><p class=\"achievementDate\">";
    if (dateAchievedVal != null) { finalString += "Unlocked " + dateAchievedVal; }
    finalString += "</p><p>";
    for (i = 1; i <= 5; i++) {
      if (i <= achievement.difficulty) {
        finalString += "<div class=\"star-icon filled\"></div>";
      } else {
        finalString += "<div class=\"star-icon\"></div>";
      }
    }
    finalString += "</p></div></div></div></div>";
  });
  $("#achievementsSection").html(finalString);
  printAchievementCounters(counters);
}

function printAchievementCounters(counters) {
  //0total, 1done, 2tutorialTotal, 3tutorialDone, 4exclusiveTotal, 5exclusiveDone, 6questTotal, 7questDone, 8lifeSkillTotal, 9lifeSkillDone
  finalString = "<div class=\"achievement-progress all-achievement-progress\">";
  finalString += "<label>" + counters[1] + " of " + counters[0] + " (" + Math.round((counters[1]/counters[0])*100) + "%) Achievements Earned</label>";
  finalString += "<div class=\"rpgui-progress\" data-rpguitype=\"progress\"><div class=\"rpgui-progress-track\"><div class=\"rpgui-progress-fill\" style=\"left: 0px; width: " + Math.round((counters[1]/counters[0])*100) + "%;\"></div></div><div class=\"rpgui-progress-left-edge\"></div><div class=\"rpgui-progress-right-edge\"></div></div>";
  finalString += "</div>";
  finalString += "<div class=\"achievement-progress tutorial-achievement-progress\">";
  finalString += "<label>" + counters[3] + " of " + counters[2] + " (" + Math.round((counters[3]/counters[2])*100) + "%) Achievements Earned</label>";
  finalString += "<div class=\"rpgui-progress red\" data-rpguitype=\"progress\"><div class=\"rpgui-progress-track\"><div class=\"rpgui-progress-fill red\" style=\"left: 0px; width: " + Math.round((counters[3]/counters[2])*100) + "%;\"></div></div><div class=\"rpgui-progress-left-edge\"></div><div class=\"rpgui-progress-right-edge\"></div></div>";
  finalString += "</div>";
  finalString += "<div class=\"achievement-progress exclusive-achievement-progress\">";
  finalString += "<label>" + counters[5] + " of " + counters[4] + " (" + Math.round((counters[5]/counters[4])*100) + "%) Achievements Earned</label>";
  finalString += "<div class=\"rpgui-progress yellow\" data-rpguitype=\"progress\"><div class=\"rpgui-progress-track\"><div class=\"rpgui-progress-fill yellow\" style=\"left: 0px; width: " + Math.round((counters[5]/counters[4])*100) + "%;\"></div></div><div class=\"rpgui-progress-left-edge\"></div><div class=\"rpgui-progress-right-edge\"></div></div>";
  finalString += "</div>";
  finalString += "<div class=\"achievement-progress quest-achievement-progress\">";
  finalString += "<label>" + counters[7] + " of " + counters[6] + " (" + Math.round((counters[7]/counters[6])*100) + "%) Achievements Earned</label>";
  finalString += "<div class=\"rpgui-progress green\" data-rpguitype=\"progress\"><div class=\"rpgui-progress-track\"><div class=\"rpgui-progress-fill green\" style=\"left: 0px; width: " + Math.round((counters[7]/counters[6])*100) + "%;\"></div></div><div class=\"rpgui-progress-left-edge\"></div><div class=\"rpgui-progress-right-edge\"></div></div>";
  finalString += "</div>";
  finalString += "<div class=\"achievement-progress lifeskills-achievement-progress\">";
  finalString += "<label>" + counters[9] + " of " + counters[8] + " (" + Math.round((counters[9]/counters[8])*100) + "%) Achievements Earned</label>";
  finalString += "<div class=\"rpgui-progress blue\" data-rpguitype=\"progress\"><div class=\"rpgui-progress-track\"><div class=\"rpgui-progress-fill blue\" style=\"left: 0px; width: " + Math.round((counters[9]/counters[8])*100) + "%;\"></div></div><div class=\"rpgui-progress-left-edge\"></div><div class=\"rpgui-progress-right-edge\"></div></div>";
  finalString += "</div>";
  finalString += "<div class=\"achievement-progress locked-achievement-progress\">";
  finalString += "<label>" + (counters[0]-counters[1]) + " achievements locked</label>";
  finalString += "</div>";
  $("#achievementsProgressBars").html(finalString);
}
