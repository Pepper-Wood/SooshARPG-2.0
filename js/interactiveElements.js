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

$("#inventoryToggle").click(function(){
  if (!$(this).hasClass("down")) {
    $(".inventoryItem").removeClass("selectedItem");
    $("#inventoryPreviewImage").fadeOut(300, function() {
      $("#inventoryPreviewImage").attr("src","img/transparentImage.png").fadeIn(300);
    });
    $("#inventoryPreviewText").slideUp(300);
    $("#craftingToggle").removeClass("down");
    $("#bandanaToggle").removeClass("down");
    $(this).addClass("down");
    $("#craftingContent").slideUp();
    $("#craftingContent .quantity").fadeOut();
    $("#bandanaContent").slideUp();
    $("#bandanaContent .quantity").fadeOut();
    $("#inventoryContent").slideDown();
    $("#inventoryContent .quantity").fadeIn();
  }
});

$("#craftingToggle").click(function(){
  if (!$(this).hasClass("down")) {
    $(".inventoryItem").removeClass("selectedItem");
    $("#inventoryPreviewImage").fadeOut(300, function() {
      $("#inventoryPreviewImage").attr("src","img/transparentImage.png").fadeIn(300);
    });
    $("#inventoryPreviewText").slideUp(300);
    $("#inventoryToggle").removeClass("down");
    $("#bandanaToggle").removeClass("down");
    $(this).addClass("down");
    $("#inventoryContent").slideUp();
    $("#inventoryContent .quantity").fadeOut();
    $("#bandanaContent").slideUp();
    $("#bandanaContent .quantity").fadeOut();
    $("#craftingContent").slideDown();
    $("#craftingContent .quantity").fadeIn();
  }
});
$("#bandanaToggle").click(function(){
  if (!$(this).hasClass("down")) {
    $(".inventoryItem").removeClass("selectedItem");
    $("#inventoryPreviewImage").fadeOut(300, function() {
      $("#inventoryPreviewImage").attr("src","img/transparentImage.png").fadeIn(300);
    });
    $("#inventoryPreviewText").slideUp(300);
    $("#inventoryToggle").removeClass("down");
    $("#craftingToggle").removeClass("down");
    $(this).addClass("down");
    $("#inventoryContent").slideUp();
    $("#inventoryContent .quantity").fadeOut();
    $("#craftingContent").slideUp();
    $("#craftingContent .quantity").fadeOut();
    $("#bandanaContent").slideDown();
    $("#bandanaContent .quantity").fadeIn();
  }
});
$("#promptDropdown").click(function() {
  $(this).next().css("left",$("#promptDropdown").position().left);
  $(this).next().css("display","block");
});
$("#achievementDropdown").click(function() {
  $(this).next().css("left",$("#achievementDropdown").offset().left);
  $(this).next().css("display","block");
});
$("ul.rpgui-dropdown-imp>li").click(function() {
  if (("<label>▼</label> " + $(this).text()) != ($(this).parent().prev().html())) {
    if ($(this).parent().prev().attr("id") == "promptDropdown") {
      togglePrompts($(this).text());
    } else {
      toggleAchievements($(this).text());
    }
    $(this).parent().prev().html("<label>▼</label> " + $(this).text());
    $(this).parent().children().removeClass("selectedDropdown");
    $(this).addClass("selectedDropdown");
  }
  $(this).parent().css("display","none");
});
$(document).mouseup(function(e) {
  var container = $("ul.rpgui-dropdown-imp");
  if ((!container.is(e.target) && container.has(e.target).length === 0)) {
    container.hide();
  }
});
function togglePrompts(promptType) {
  $(".promptContainer").slideUp(100);
  var slideTime = 800;
  if (promptType == "All") {
    $(".promptContainer").slideDown(slideTime);
  } else if (promptType == "Prompts Only") {
    $(".promptContainer-prompt").slideDown(slideTime);
  } else if (promptType == "Quests Only") {
    $(".promptContainer-quest").slideDown(slideTime);
  } else if (promptType == "Alchemy Quests") {
    $(".promptContainer-alchemy").slideDown(slideTime);
  } else if (promptType == "Angling Quests") {
    $(".promptContainer-angling").slideDown(slideTime);
  } else if (promptType == "Hunting Quests") {
    $(".promptContainer-hunting").slideDown(slideTime);
  } else if (promptType == "Gathering Quests") {
    $(".promptContainer-gathering").slideDown(slideTime);
  } else if (promptType == "Mining Quests") {
    $(".promptContainer-mining").slideDown(slideTime);
  } else if (promptType == "Wood-Cutting Quests") {
    $(".promptContainer-woodCutting").slideDown(slideTime);
  }
}
function toggleAchievements(achieveType) {
  achieveType = achieveType.toLowerCase().replace(/\s/g, '');
  if (achieveType == "all") {
    $(".achievementBanner").slideDown();
    if ($(".all-achievement-progress").css("display") == "none") {
      $(".achievement-progress").slideUp();
      $(".all-achievement-progress").slideDown();
    }
  } else if (achieveType == "unlocked") {
    $(".locked-achievement").slideUp();
    $(".achievementBanner").not(".locked-achievement").slideDown();
    if ($(".all-achievement-progress").css("display") == "none") {
      $(".achievement-progress").slideUp();
      $(".all-achievement-progress").slideDown();
    }
  } else {
    achieveType = "." + achieveType + "-achievement";
    $(".achievementBanner").not(achieveType).slideUp();
    $(achieveType).slideDown();
    achieveType += "-progress";
    $(".achievement-progress").slideUp();
    $(achieveType).slideDown();
  }
}
/*
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
*/

/*
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
*/

/*
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
*/
function openGenerator() {
  alert("yay!");
}
