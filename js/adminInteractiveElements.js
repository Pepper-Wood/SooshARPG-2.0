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

$(".nav-tabs a").click(function(){
    $(this).tab('show');
});

$("#copyToClipboard").click(function(){
    $("#copiedToClipboard").fadeIn(100);
    $("#copiedToClipboard").fadeOut(4000);
    $("#dailyOutput").select();
    document.execCommand('copy');
});
$("#copyImgToClipboard").click(function(){
    $("#copiedImgToClipboard").fadeIn(100);
    $("#copiedImgToClipboard").fadeOut(4000);
    $("#thumbnailOutput").select();
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
