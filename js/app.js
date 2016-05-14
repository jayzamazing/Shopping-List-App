
$(document).ready(function () {
  if (!storageStatus('localStorage'))
    $('.storageErrorStatus')[0].style.visibility = 'visible';
  initialState();
  var shopLists = getLists();
  var listItems = getListsItems(shopLists[0]);
  parseList(shopLists, addListName);
  parseList(listItems, addItem);
  $('.listNames ul').find('input').first().prop('checked', true);
  $(document).on('mousedown', '.delete', (function(){
    deleteList.call(this);
  }));
  $('.listNames ul').click(function() {
    $('.listItems ul').empty();
    var listItems = getListsItems($('.listNames ul').find("input:radio:checked").val());
    parseList(listItems, addItem);
  });
  $('#listNameButton').click(function() {
    var name = $('#listName').val();
    addListName(name);
    var shopLists = getLists();
    shopLists.push(name);
    setLists(shopLists);
    $('.listItems ul').empty();
  });
  $('#itemNameButton').click(function() {
    var name = $('#itemName').val();
    addItem(name);
    var listItems = getListsItems($('.listNames ul').find("input:radio:checked").val());
    if (listItems === null)
      listItems = [];
    listItems.push(name);
    setListItem($('.listNames ul').find("input:radio:checked").val(), listItems);
  });
});
function deleteList() {
  if ($(this).prev().find('input').is(':radio'))
    deleteListHelper1.call(this);
  else
    deleteListHelper2.call(this);
  if ($(this).prev().find('input').prop('checked') && $(this).prev().find('input').is(':radio') &&
  $(this).parent().prev().find('input').length === 1){
    $(this).parent().prev().find('input').prop('checked', true);
  } else if ($(this).prev().find('input').prop('checked') && $(this).prev().find('input').is(':radio') &&
  $(this).parent().next().find('input').length) {
    $(this).parent().next().find('input').prop('checked', true);
  }
  $(this).parent().remove();
  $('.listItems ul').empty();
  var listItems = getListsItems($('.listNames ul').find("input:radio:checked").val());
  parseList(listItems, addItem);
}
function deleteListHelper1() {
  var shopLists = getLists();
  $('.listItems ul').empty();
  shopLists.splice(shopLists.indexOf($(this).prev().find('input').val()), 1);
  localStorage.removeItem($(this).prev().find('input').val());
  setLists(shopLists);
  if (localStorage.getItem('Shopping Lists').length === 2) {
    localStorage.removeItem('Shopping Lists');
  }
}
function deleteListHelper2() {
  var listItems = getListsItems($('.listNames ul').find("input:radio:checked").val());
  listItems.splice(listItems.indexOf($(this).prev().find('input').val()), 1);
  setListItem($('.listNames ul').find("input:radio:checked").val(), listItems);
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
  '<input type="checkbox" class="checkList" value="' + name + '"> ' + name +
  '</label><i class="fa fa-times delete" aria-hidden="true"></i></li>');
  $('#itemName').val('');
}
function addListName(name) {
  $('.listNames ul').append('<li><label for=""><input type="radio" name="listName" ' +
  'value="' + name + '"checked="true"> ' + name + '</label><i class="fa ' +
  'fa-times delete" aria-hidden="true"></i></li>');
  $('#listName').val('');
}
function initialState() {
  if (localStorage.getItem('Shopping Lists') === null) {
    var value = ['List 1'];
    localStorage.setItem('Shopping Lists', JSON.stringify(value));
    if (localStorage.getItem("List 1") === null) {
      value = ['Milk', 'Pepper', 'Salt', 'Eggs', 'Dish Detergent'];
      localStorage.setItem('List 1', JSON.stringify(value));
    }
  }
}
function getLists() {
  return JSON.parse(localStorage.getItem('Shopping Lists'));
}
function setLists(shopLists) {
  if (localStorage.getItem('Shopping Lists') === null) {
    initialState();
  }
  localStorage.setItem('Shopping Lists', JSON.stringify(shopLists));
}
function getListsItems(list) {
  return JSON.parse(localStorage.getItem(list));
}
function setListItem(list, listItems) {
  localStorage.setItem(list, JSON.stringify(listItems));
}
function parseList(list, methodCallBack){
  for (var x in list){
    methodCallBack(list[x]);
  }
}
