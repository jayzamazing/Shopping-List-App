
$(document).ready(function () {
  if (!storageStatus('localStorage'))
    $('.storageErrorStatus')[0].style.visibility = 'visible';
  initialState();
  var shopLists = getLists();
  var listItems = getListsItems(shopLists[0]);
  var checked = getListsItems(shopLists[0].concat('.Checked'));
  parseList(shopLists, addListName);
  parseList(listItems, addItem);
  parseChecked(checked);
  $('.listNames li').each(function() {
    $(this).removeClass('highlight');
  });
  $('.listNames ul').find('input').first().prop('checked', true);
  $('.listNames ul').find('li').first().toggleClass('highlight', this.checked);
  $(document).on('mousedown', '.delete', (function(){
    deleteList.call(this);
  }));
  $('#listNameButton').click(function() {
    var name = $('#listName').val();
    addListName(name);
    var shopLists = getLists();
    shopLists.push(name);
    setLists('Shopping Lists', shopLists);
    var emptyList = [''];
    setLists(name.concat('.Checked'), emptyList);
    $('.listItems ul').empty();
  });
  $('#itemNameButton').click(function() {
    var name = $('#itemName').val();
    addItem(name);
    var listItems = getListsItems($('.listNames ul').find("input:radio:checked").val());
    if (listItems === null || listItems[0] === '')
      listItems = [name];
    else
      listItems.push(name);
    setListItem($('.listNames ul').find("input:radio:checked").val(), listItems);
  });
  $('.listNames ul').click(function() {
    $('.listItems ul').empty();
    var listItems = getListsItems($('.listNames ul').find("input:radio:checked").val());
    if (listItems !== null && listItems[0] !== '') {
      parseList(listItems, addItem);
      var listItems2 = getListsItems($('.listNames ul').find("input:radio:checked").val().concat('.Checked'));
      parseChecked(listItems2);
    }
  });
  $('ul').on('click', 'li', function(){
    if ($(this).find('input').is(':radio')) {
      $('li').each(function() {
        $(this).toggleClass('highlight', false);
      });
    }
    console.log($(this).find("input:radio").val());
    if ($(this).find("input:radio").val()){
      if (!$(this).find('input').prop('checked')){
        $(this).find('input').prop('checked', true);
      }
      $(this).toggleClass('highlight', this.checked);
    } else {
      var checked = getListsItems($('.listNames ul').find("input:radio:checked").val().concat('.Checked'));
      if ($(this).find('input').prop('checked')){
        $(this).find('input').prop('checked', false);
        checked[$(this).index()] = '';
      } else {
        $(this).find('input').prop('checked', true);
        checked[$(this).index()] = 'checked';
      }
      $(this).toggleClass('highlight', this.checked);
      setListItem($('.listNames ul').find("input:radio:checked").val().concat('.Checked'), checked);
    }
  });
});
function deleteList() {
  if ($(this).find('input').is(':radio')) {
    $(this).parent().each(function() {
      $(this).toggleClass('highlight', false);
    });
  }
  if ($(this).prev().find('input').is(':radio'))
    deleteListHelper1.call(this);
  else
    deleteListHelper2.call(this);
  if ($(this).prev().find('input').prop('checked') && $(this).prev().find('input').is(':radio') &&
  $(this).parent().prev().find('input').length === 1){
    $(this).parent().prev().find('input').prop('checked', true);
    $(this).parent().prev().toggleClass('highlight', this.checked);
  } else if ($(this).prev().find('input').prop('checked') && $(this).prev().find('input').is(':radio') &&
  $(this).parent().next().find('input').length) {
    $(this).parent().next().find('input').prop('checked', true);
    $(this).parent().next().toggleClass('highlight', this.checked);
  }
  $(this).parent().remove();
  $('.listItems ul').empty();
  var listItems = getListsItems($('.listNames ul').find("input:radio:checked").val());
  var checked = getListsItems($('.listNames ul').find("input:radio:checked").val().concat('.Checked'));
  parseList(listItems, addItem);
  parseChecked(checked);
}
function deleteListHelper1() {
  var shopLists = getLists();
  $('.listItems ul').empty();
  shopLists.splice(shopLists.indexOf($(this).prev().find('input').val()), 1);
  localStorage.removeItem($(this).prev().find('input').val());
  setLists('Shopping Lists', shopLists);
  if (localStorage.getItem('Shopping Lists').length === 2) {
    localStorage.removeItem('Shopping Lists');
    initialState();
    shopLists = getLists();
    var listItems = getListsItems(shopLists[0]);
    parseList(shopLists, addListName);
    parseList(listItems, addItem);
  }
}
function deleteListHelper2() {
  var listItems = getListsItems($('.listNames ul').find("input:radio:checked").val());
  var checked = getListsItems($('.listNames ul').find("input:radio:checked").val().concat('.Checked'));
  console.log(listItems.indexOf($(this).parent().find('input').val()));
  checked.splice(listItems.indexOf($(this).parent().find('input').val()), 1);
  localStorage.removeItem($('.listNames ul').find("input:radio:checked").val().concat('.Checked'));
  listItems.splice(listItems.indexOf($(this).prev().find('input').val()), 1);
  setListItem($('.listNames ul').find("input:radio:checked").val(), listItems);
  setLists($('.listNames ul').find("input:radio:checked").val().concat('.Checked'), checked);
}
function storageStatus(type) {
	try {
		var test = window[type], t1 = 'test';
		test.setItem(t1, t1);
		test.removeItem(t1);
		return true;
	}
	catch(e) {
		return false;
	}
}
function addItem(name) {
  $('.listItems ul').append('<li><label for="" class="checkListName">' +
  '<input type="checkbox" value="' + name + '" class="hidden"> ' + name +
  '</label><i class="fa fa-times delete" aria-hidden="true"></i></li>');
  $('#itemName').val('');
}
function addListName(name) {
  $('li').each(function() {
    $(this).removeClass('highlight');
  });
  $('.listNames ul').append('<li><label for=""><input type="radio" name="listName" ' +
  'value="' + name + '"checked="true" class="hidden"> ' + name + '</label><i class="fa ' +
  'fa-times delete" aria-hidden="true"></i></li>').find('li:last').addClass('highlight', this.checked);
  $('#listName').val('');
}
function initialState() {
  if (localStorage.getItem('Shopping Lists') === null) {
    var value = ['List 1'];
    localStorage.setItem('Shopping Lists', JSON.stringify(value));
    if (localStorage.getItem("List 1") === null) {
      value = ['Milk', 'Pepper', 'Salt', 'Eggs', 'Dish Detergent'];
      var value2 = ['', '', '', '', ''];
      localStorage.setItem('List 1', JSON.stringify(value));
      localStorage.setItem('List 1.Checked', JSON.stringify(value2));
    }
  }
}
function getLists() {
  return JSON.parse(localStorage.getItem('Shopping Lists'));
}
function setLists(list, shopLists) {

  localStorage.setItem(list, JSON.stringify(shopLists));
}
function getListsItems(list) {
  return JSON.parse(localStorage.getItem(list));
}
function setListItem(list, listItems) {
  localStorage.setItem(list, JSON.stringify(listItems));
}
function parseList(list, methodCallBack) {
  for (var x in list){
    methodCallBack(list[x]);
  }
}
function parseChecked(list) {
  if (list !== null) {
    for (i = 0; i < list.length; i++) {
      if (list[i] === 'checked'){
        var listObj = $('.listItems li')[i];
        var listObj2 = $('.listItems li input')[i];
        listObj.className += ' highlight';
        listObj2.checked = true;
      }
    }
  }
}
