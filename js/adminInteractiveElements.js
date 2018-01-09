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
    loadAdmin();
  } else {
    $("#sooshPW").addClass("invalid");
    $("#errorText").slideDown();
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
