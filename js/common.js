function cardColumn(oData) {
  const cardColumn = document.createElement('div');
  const card = document.createElement('div');
  const image = document.createElement('img');
  const cardBody = document.createElement('div');
  const titleCon = document.createElement('div');
  const title = document.createElement('h5');
  const cardText = document.createElement('div');
  const feature = document.createElement('div');
  const cardFooter = document.createElement('div');
  const selectOption = document.createElement('option');

  cardColumn.setAttribute('class', 'col mb-4');
  card.setAttribute('class', 'card h-100');
  image.setAttribute('class', 'card-img-top');
  image.setAttribute('src', 'https://scontent.fblr2-1.fna.fbcdn.net/v/t1.0-9/p960x960/60549567_2469035279794640_838730430562697216_o.jpg?_nc_cat=101&_nc_sid=7aed08&_nc_ohc=75DEHTBpTdUAX9DxXWf&_nc_ht=scontent.fblr2-1.fna&_nc_tp=6&oh=9f1f4f4b7f6827fc84dd49254e78fcd3&oe=5ECA559F');
  cardBody.setAttribute('class', 'card-body');
  titleCon.setAttribute('class', 'd-flex justify-content-between align-items-top');
  title.setAttribute('class', 'card-title mb-0 pr-2');
  cardText.setAttribute('class', 'platform');
  feature.setAttribute('class', 'text-dark');
  cardFooter.setAttribute('class', 'card-footer');


  title.innerHTML = oData.title + ' (' + oData.release_year + ')';
  feature.innerHTML = '<i class="fas fa-medal h3 mb-0" data-toggle="tooltip" data-placement="bottom" title="Editor\'s Choice"></i>';
  cardText.innerHTML = oData.platform;
  cardFooter.innerHTML = '<div class="d-flex justify-content-between"><div class="">Genre: <a href="#">' +
    oData.genre + '</a></div><div class="text-info">' +
    oData.score + '</div></div>';

  titleCon.append(title);
  if (oData.editors_choice == 'Y') {
    titleCon.append(feature);
  }
  cardBody.append(titleCon);
  cardBody.append(cardText);
  card.append(image);
  card.append(cardBody);
  card.append(cardFooter)
  cardColumn.append(card);
  return cardColumn;
}

var content = document.getElementById('content');
var allData = [];
var totalCount;


function addCards(oData) {
  var data = oData ? oData : allData;
  content.innerHTML = '';
  for (var i = 0; i < data.length; i++) {
    content.append(cardColumn(data[i]));
  }
}

function search() {
  var input = $('#search').val();
  content.innerHTML = '';
  count = 0;
  if (input) {
    for (var i = 0; i < allData.length; i++) {
      if (typeof allData[i].title === 'string' && allData[i].title.indexOf(input) > -1) {
        content.append(cardColumn(allData[i]));
        count++;
      }
    }
    updateCount(count);
  } else {
    addCards();
    updateCount(totalCount);
  }
}


function searchComplete() {
  var input = $('#search').val();
  content.innerHTML = '';
  var count = 0;
  if (input) {
    for (var i = 0; i < allData.length; i++) {
      if (typeof allData[i].title === 'string' && allData[i].title.indexOf(input) > -1) {
        content.append(cardColumn(allData[i]));
        count++;
      }
    }
    updateCount(count);
  } else {
    addCards();
    updateCount(totalCount);
  }
}


function setOptionsForPlatform() {
  var flags = [],
    output = [],
    l = allData.length,
    i;
  for (i = 0; i < l; i++) {
    if (flags[allData[i].platform]) continue;
    flags[allData[i].platform] = true;
    output.push(allData[i].platform);
    var selectOption = document.createElement('option');
    selectOption.setAttribute('value', allData[i].platform);
    selectOption.innerHTML = allData[i].platform;
    $("#platformSelect").append(selectOption);
  }
}


function setAutoComplete() {
  var flags = [],
    output = [],
    l = allData.length,
    i;
  for (i = 0; i < l; i++) {
    if (flags[allData[i].title]) continue;
    flags[allData[i].title] = true;
    output.push(allData[i].title);
  }
  updateCount(output.length);
  $("#search").autocomplete({
    source: output,
    close: function(event, ui) {
      searchComplete();
    }
  });
}

function updateCount(count) {
  $("#count").text('(' + count + ')');
}

$('#search').on('input', function() {
  search();
});

$("#sortup").click(function() {
  var oData = allData;
  oData.sort(function(a, b) {
    return a.score - b.score;
  });
  addCards(oData);
  updateCount(totalCount);
});

$("#sortdown").click(function() {
  var oData = allData;
  oData.sort(function(a, b) {
    return b.score - a.score;
  });
  addCards(oData);
  updateCount(totalCount);
});

$("#sortupyear").click(function() {
  var oData = allData;
  oData.sort(function(a, b) {
    return a.release_year - b.release_year;
  });
  addCards(oData);
  updateCount(totalCount);
});

$("#sortdownyear").click(function() {
  var oData = allData;
  oData.sort(function(a, b) {
    return b.release_year - a.release_year;
  });
  addCards(oData);
  updateCount(totalCount);
});

$('#platformSelect').change(function() {
  var input = $(this).val();
  content.innerHTML = '';
  var count = 0;
  if (input != 'empty') {
    for (var i = 0; i < allData.length; i++) {
      if (typeof allData[i].platform === 'string' && allData[i].platform.indexOf(input) > -1) {
        content.append(cardColumn(allData[i]));
        count++;
      }
    }
    updateCount(count);
  } else {
    addCards();
    updateCount(totalCount);
  }
});

jQuery(function() {
  jQuery.ajax({
    method: "GET",
    url: "http://starlord.hackerearth.com/gamesext",
    dataType: "json",
    success: function(aData) {
      console.log("S:data loaded");
      content.innerHTML = '';
      allData = aData;
      addCards();
      setAutoComplete();
      setOptionsForPlatform();
      totalCount = aData.length;
      updateCount(totalCount);
    },
    error: function(error) {
      console.log("E:" + error);
    }
  });

});
