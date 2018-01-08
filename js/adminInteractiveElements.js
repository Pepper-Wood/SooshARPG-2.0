// ------------------------------------------------------------------
String.prototype.hashCode = function(){
  var hash = 0;
  if (this.length == 0) return hash;
  for (var i = 0; i < this.length; i++) {
      var character = this.charCodeAt(i);
      hash = ((hash<<5)-hash)+character;
      hash = hash & hash;
  }
  return hash;
}

// ------------------------------------------------------------------
function handlePassword() {
  var val = -1071924008;
  if ($("#sooshPW").val().hashCode() == val) {
    $(".loginWrapper").animate({'marginTop' : "-=100%"},1000);
    loadAdmin();
  } else {
    $("#sooshPW").addClass("invalid");
    $("#errorText").slideDown();
  }
}

// ------------------------------------------------------------------
// function to allow user to input the guest artist name
function checkForMYO(val){
 if (val=='guest') {
   $("#sooshTypeOther").css({'display':'block'});
   $("#sooshTypeOtherLabel").css({'display':'block'});
 } else {
   $("#sooshTypeOther").css({'display':'none'});
   $("#sooshTypeOtherLabel").css({'display':'none'});
 }
}

/*
// ------------------------------------------------------------------
// dice roller helper function
function rollDie(dieSize) {
  return Math.floor((Math.random() * dieSize) + 1);
}
*/

// ------------------------------------------------------------------
// generate random index for selecting item obtained
function rIndex(itemNum) {
  return Math.floor((Math.random() * itemNum));
}

// ------------------------------------------------------------------
// helper function for determining the amount of exp earned
function getExp(quantity, rarity) {
  var exp = 10;
  if (rarity == "uncommon") { exp += 5; }
  else if (rarity == "rare") { exp += 10; }
  return exp;
}

// ------------------------------------------------------------------
// helper function for returning whatever item is returned from DBresults
function getItem(DBresults) {
  if (DBresults.length == 0) {
    return "ERRORITEM";
  } else {
    return DBresults[rIndex(DBresults.length)];
  }
}

// ------------------------------------------------------------------
// generate formalized output. Helper function to help declutter rollDaily
function printFormalOutput(sooshName, dailyType, loc, quantity, item, rarity, buff) {
  if (dailyType == "crafting") {
    return "Formal output for crafting not implemented. Refer to results in Debugging output instead.";
  } // KEEP IN HERE UNTIL CRAFTING IS FIGURED OUT
  var dailyStr;
  if (dailyType == "hunting") { dailyStr = "Hunting"; }
  else if (dailyType == "fishing") { dailyStr = "Angling"; }
  else if (dailyType == "mining") { dailyStr = "Mining"; }
  else if (dailyType == "woodcutting") { dailyStr = "Wood-Cutting"; }
  else if (dailyType == "gathering") { dailyStr = "Gathering"; }

  if (loc == "thickets") { loc = "The Thickets"; }
  else if (loc == "midwoods") { loc = "The Midwoods"; }
  else if (loc == "thorns") { loc = "The Thorns"; }
  else if (loc == "solitude") { loc = "Mount Solitude"; }
  else if (loc == "reflections") { loc = "The Lake of Reflections"; }

  formalStr = "<small>" + sooshName + " went " + dailyStr + " in " + loc + ".\n";
  if ((quantity == 0) || (item == "ERRORITEM") || (item == "")) {
    formalStr += "Unfortunately they didn’t find anything, maybe next time!"
  } else {
    formalStr += "They managed to find <b>" + quantity.toString() + " " + item + "</b>!\n";
    formalStr += "They are awarded <b>" + getExp(quantity,rarity).toString() + " exp</b>."
  }
  if (buff == "magicpaw") { formalStr += "\nThey also received the <b>Magic Paws Status Infliction</b>. They will gain +1 to their crafting roll tomorrow."; }
  else if (buff == "lazybork") { formalStr += "\nUnfortunately they received the <b>Lazy Bork Status Infliction</b>. They will be unable to perform a daily tomorrow."; }
  else if (buff == "luckyduck") { formalStr += "\nThey also received the <b>Lucky Duck Status Infliction</b>! They will gain +1 to their daily roll tomorrow."; }
  else if (buff == "bees") { formalStr += "\nUnfortunately they received the <b>BEES! Status Infliction</b>. They will get -2 to hunting rolls over the next 2 days."; }
  else if (buff == "lunarMoth") { formalStr += "\nYour soosh has been blessed by its beauty and received the <b>Lunar Moth Status Infliction</b>! They will get +1 to hunting rolls over the next 2 days."}
  // Unfortunately they received the Lazy Bork Status Infliction.
  formalStr += "</small>";
  return formalStr;
}

// ------------------------------------------------------------------
// function for calculating daily rolls
function rollDaily() {
  var sooshName = $("#sooshName").val();
  if (allSooshNames.indexOf(sooshName) <= -1) {
    $("#sooshNameError").slideDown();
    return;
  }
  sooshName = sooshName.split(" :: ")[1]; // strip the USERNAME :: from infront of the name
  var dailyType = $("#dailyType").val();
  var loc = $("#locationType").val();
  var quantity = 0;
  var item = "";
  var rarity = "";
  var buff = "";
  var inventoryBuff = parseInt($("#inventoryBuff").val());

  //var bonus = parseInt($("#skillLevel").val());
  var bonus = 0;
  //sooshName on the left is the column in the TaffyDB, sooshName on the right is the value taken from #sooshName
  var sooshSpreadsheetURL = sooshARPGDirectory({sooshName:sooshName}).select("spreadsheetURL");
  if ( sooshSpreadsheetURL != "x") {
    Tabletop.init( { key: sooshSpreadsheetURL, callback: getSooshStats() } );
  }
  //    fetch the user's stats
  //    0 = Novice/Rookie; 1 = Apprentice; 2 = Whiz; 3 = Genius; 4 = Master; 5 = Hero

  // add to bonus; so far, only lucky duck and bad duck have been added
  if (inventoryBuff == 2) { bonus += -1; }
  else { bonus += 1; }
  var DBresults;
  var finalString = ""; // KEEP IN HERE FOR DEBUGGING FOR CRAFTING
  // ------------------------------------------------------------------
  // crafting
  if (dailyType == "crafting") {
    result = rollDie(20) + bonus;
    finalString = result;
    finalString += ": ";
    if (result == 1) {
      finalString += "failure and negative debuff";
      buff = "lazybork";
    } else if ((result >= 2) && (result <= 8)) {
      finalString += "straight failure";
    } else if ((result >= 9) && (result <= 12)) {
      finalString += "failure but creates new item";
    } else if ((result >= 13) && (result <= 19)) {
      finalString += "success";
    } else if (result >= 20) {
      finalString += "success";
      buff = "magicpaw";
    }
  // ------------------------------------------------------------------
  // hunting and fishing
  } else if ((dailyType == "hunting") || (dailyType == "fishing")) {
    result = rollDie(20) + bonus;
    if (result == 1) {
      //buff = "[[A DIZZINESS DEBUFF]]";
      buff = "lazybork";
    } else if ((result >= 2) && (result <= 6)) {
      // standard failure if between 2 and 6
    } else if ((result >= 7) && (result <= 12)) {
      var DBresults;
      if (dailyType == "fishing") { DBresults = anglingDB({location:loc,rarity:"common"}).select("name"); }
      else { DBresults = huntingDB({location:loc,difficulty:"easy"}).select("name"); }
      rarity = "common";
      quantity = 1;
      item = getItem(DBresults);
      if (item == "BEES") { buff = "bees"; } // special case for BEES status effect
      else if (item == "Lunar Moth") { buff = "lunarMoth"; } // special case for Lunar Moth status effect
    } else if ((result >= 13) && (result <= 16)) {
      if (dailyType == "fishing") { DBresults = anglingDB({location:loc,rarity:"uncommon"}).select("name"); }
      else { DBresults = huntingDB({location:loc,difficulty:"medium"}).select("name"); }
      rarity = "uncommon";
      quantity = 1;
      item = getItem(DBresults);
      if (item == "BEES") { buff = "bees"; } // special case for BEES status effect
      else if (item == "Lunar Moth") { buff = "lunarMoth"; } // special case for Lunar Moth status effect
    } else if ((result >= 17) && (result <= 19)) {
      if (dailyType == "fishing") { DBresults = anglingDB({location:loc,rarity:"rare"}).select("name"); }
      else { DBresults = huntingDB({location:loc,difficulty:"hard"}).select("name"); }
      rarity = "rare";
      quantity = 1;
      item = getItem(DBresults);
      if (item == "BEES") { buff = "bees"; } // special case for BEES status effect
      else if (item == "Lunar Moth") { buff = "lunarMoth"; } // special case for Lunar Moth status effect
    } else if (result >= 20) {
      buff = "luckyduck";
      if (dailyType == "fishing") {
        DBresults = anglingDB({location:loc,rarity:"rare"}).select("name");
      } else {
        DBresults = huntingDB({location:loc,difficulty:"hard"}).select("name");
      }
      rarity = "rare";
      quantity = 1;
      item = getItem(DBresults);
      if (item == "BEES") { buff = "bees"; } // special case for BEES status effect
      else if (item == "Lunar Moth") { buff = "lunarMoth"; } // special case for Lunar Moth status effect
    }
  // ------------------------------------------------------------------
  // mining and woodcutting
  } else if ((dailyType == "mining") || (dailyType == "woodcutting")) {
    result_one = rollDie(20) + bonus;
    result_two = rollDie(20);
    if (result_one == 1) {
      buff = "lazybork";
    } else if ((result_one >= 2) && (result_one <= 6)) {
      // standard failure if between 2 and 6
    } else if ((result_one >= 7) && (result_one <= 12)) {
      if (dailyType == "mining") { DBresults = miningDB({location:loc,rarity:"common"}).select("name"); }
      else { DBresults = woodcuttingDB({location:loc,difficulty:"easy"}).select("logName"); }
      rarity = "common";
      item = getItem(DBresults);
    } else if ((result_one >= 13) && (result_one <= 16)) {
      if (dailyType == "mining") { DBresults = miningDB({location:loc,rarity:"uncommon"}).select("name"); }
      else { DBresults = woodcuttingDB({location:loc,difficulty:"medium"}).select("logName"); }
      rarity = "uncommon";
      item = getItem(DBresults);
    } else if ((result_one >= 17) && (result_one <= 19)) {
      if (dailyType == "mining") { DBresults = miningDB({location:loc,rarity:"rare"}).select("name"); }
      else { DBresults = woodcuttingDB({location:loc,difficulty:"hard"}).select("logName"); }
      rarity = "rare";
      item = getItem(DBresults);
    } else if (result_one >= 20) {
      buff = "luckyduck";
      if (dailyType == "mining") {
        DBresults = miningDB({location:loc,rarity:"rare"}).select("name");
      } else {
        DBresults = woodcuttingDB({location:loc,difficulty:"hard"}).select("logName");
      }
      rarity = "rare";
      item = getItem(DBresults);
    }
    if ((result_two >= 1) && (result_two <= 6)) {
      quantity = 1;
    } else if ((result_two >= 6) && (result_two <= 10)) {
      quantity = 2;
    } else if ((result_two >= 11) && (result_two <= 15)) {
      quantity = 3;
    } else if ((result_two >= 16) && (result_two <= 19)) {
      quantity = 4;
    } else if (result_two == 20) {
      quantity = 5;
    }
  // ------------------------------------------------------------------
  // gathering
  } else if (dailyType == "gathering") {
    var DBresults;
    result_one = rollDie(20) + bonus;
    result_two = rollDie(6);
    result_three = rollDie(20);
    if (result_one == 1) {
      buff = "lazybork";
    } else if ((result_one >= 2) && (result_one <= 6)) {
      // standard failure if between 2 and 6
    } else if ((result_one >= 7) && (result_one <= 12)) {
      rarity = "common";
    } else if ((result_one >= 13) && (result_one <= 16)) {
      rarity = "uncommon";
    } else if ((result_one >= 17) && (result_one <= 19)) {
      rarity = "rare";
    } else if (result_one >= 20) {
      buff = "luckyduck";
      rarity = "rare";
    }
    if (result_one >= 7) {
      if (result_two == 1) {
        DBresults = gatheringDB({location:loc,rarity:rarity,type:"flower"}).select("name");
        DBresults = DBresults.concat(gatheringDB({location:loc,rarity:rarity,type:"plant"}).select("name"));
      } else if (result_two == 2) {
        DBresults = gatheringDB({location:loc,rarity:rarity,type:"small animal items/drops"}).select("name");
      } else if (result_two == 3) {
        DBresults = gatheringDB({location:loc,rarity:rarity,type:"fruit"}).select("name");
        DBresults = DBresults.concat(gatheringDB({location:loc,rarity:rarity,type:"vegetable"}).select("name"));
        DBresults = DBresults.concat(gatheringDB({location:loc,rarity:rarity,type:"berry"}).select("name"));
      } else if (result_two == 4) {
        DBresults = gatheringDB({location:loc,rarity:rarity,type:"crafting"}).select("name");
      } else if (result_two == 5) {
        DBresults = gatheringDB({location:loc,rarity:rarity,type:"miscellaneous"}).select("name");
      } else if (result_two == 6) {
        DBresults = gatheringDB({location:loc,rarity:rarity,type:"treasures"}).select("name");
      }
      if ((result_three >= 1) && (result_three <= 6)) {
        quantity = 1;
      } else if ((result_three >= 6) && (result_three <= 10)) {
        quantity = 2;
      } else if ((result_three >= 11) && (result_three <= 15)) {
        quantity = 3;
      } else if ((result_three >= 16) && (result_three <= 19)) {
        quantity = 4;
      } else if (result_three == 20) {
        quantity = 5;
      }
      item = getItem(DBresults);
    }
  }
  $("#debugOutput").html(finalString);
  $("#dailyOutput").html(printFormalOutput(sooshName, dailyType, loc, quantity, item, rarity, buff));
}

$(".nav-tabs a").click(function(){
  $(this).tab('show');
});

$("#copyToClipboard").click(function(){
    $("#copiedToClipboard").fadeIn(100);
    $("#copiedToClipboard").fadeOut(4000);
    $("#dailyOutput").select();
    document.execCommand('copy');
});

var scroll = new SmoothScroll('.some-selector',{header: '[data-scroll-header]'});
var smoothScrollWithoutHash = function (selector, settings) {
  var clickHandler = function (event) {
    var toggle = event.target.closest( selector );
    if ( !toggle || toggle.tagName.toLowerCase() !== 'a' ) return;
    var anchor = document.querySelector( toggle.hash );
    if ( !anchor ) return;
    event.preventDefault();
    scroll.animateScroll( anchor, toggle, settings || {} );
  };
  window.addEventListener('click', clickHandler, false );
};
smoothScrollWithoutHash( 'a[href*="#"]' );

// ------------------------------------------------------------------
// helper function to quickly add values to running totals
function modifyCount(radioResult, flavorFlag, villageVals) {
  console.log("modifyCount");
  console.log(villageVals);
  if (radioResult == flavorFlag[0]) { villageVals[0] += 3; }
  else if (radioResult == flavorFlag[1]) { villageVals[1] += 3; }
  else if (radioResult == flavorFlag[2]) { villageVals[2] += 3; }
  else if (radioResult == flavorFlag[3]) { villageVals[3] += 3; }
  return villageVals;
}

// ------------------------------------------------------------------
// modified version of modifyCount for question 10
function modifyCount_quest10(radioResult, flavorFlag, villageVals) {
  if (radioResult == flavorFlag[0]) {
    villageVals[0] += 2;
    villageVals[2] += 1;
  } else if (radioResult == flavorFlag[1]) {
    villageVals[1] += 2;
    villageVals[3] += 1;
  } else if (radioResult == flavorFlag[2]) {
    villageVals[2] += 2;
    villageVals[0] += 1;
  } else if (radioResult == flavorFlag[3]) {
    villageVals[3] += 2;
    villageVals[1] += 1;
  }
  return villageVals;
}

// ------------------------------------------------------------------
// Main body of code for running the sortingHat button calculations
$("#sortingHat").click(function() {
  villageArray = [["-","-","-","-"],
                  ["C","B","D","A"],
                  ["A","C","D","B"],
                  ["D","C","A","B"],
                  ["C","D","B","A"],
                  ["B","C","D","A"],
                  ["A","B","C","D"],
                  ["C","B","D","A"],
                  ["A","D","C","B"],
                  ["C","D","B","A"],
                  ["C","D","B","A"]];
  var villageVals = [0,0,0,0]; //Sweet, Savory, Spicy, Bitter
  for (i=1; i<11; i++) {
    console.log("for loop");
    console.log(villageVals);
    if (i == 10) {
      villageVals = modifyCount_quest10($("input[name='question" + i + "']:checked").val(),villageArray[i],villageVals);
    } else {
      villageVals = modifyCount($("input[name='question" + i + "']:checked").val(),villageArray[i],villageVals);
    }
  }

  google.charts.load("current", {packages:['corechart']});
  google.charts.setOnLoadCallback(function() {
    var data = google.visualization.arrayToDataTable([
      ["Village", "Count", { role: "style" } ],
      ["Sweet", villageVals[0], "#f48fb1"],
      ["Savory", villageVals[1], "#80cbc4"],
      ["Spicy", villageVals[2], "#ff7043"],
      ["Bitter", villageVals[3], "#5e35b1"]
    ]);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                     { calc: "stringify",
                       sourceColumn: 1,
                       type: "string",
                       role: "annotation" },
                     2]);
    var options = {
      title: "Village Results",
      'height': 400,
      bar: {groupWidth: "95%"},
      legend: { position: "none" },
    };
    var chart = new google.visualization.ColumnChart(document.getElementById("chartContainer"));
    chart.draw(view, options);
  });
});
