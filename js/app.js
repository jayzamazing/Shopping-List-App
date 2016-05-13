
$(document).ready(function () {
  if (!storageStatus('localStorage'))
    $('.storageErrorStatus')[0].style.visibility = 'visible';
  initialState();
  var shopLists = getLists();
  var listItems = getListsItems(shopLists[0]);
  parseList(listItems, addItem);

  $(document).on('mousedown', '.delete', (function(){
    deleteList.call(this);
  }));
  $('#listNameButton').click(function() {
    addListName($('#listName').val());
    var shopLists = getLists();
    shopLists.push(name);
    setLists(shopLists);
  });
  $('#itemNameButton').click(function() {
    addItem($('#itemName').val());
    var listItems = getListsItems($('.listNames ul').find("input:radio:checked").val());
    alert(listItems);
    listItems.push(name);
    setListItem($('.listNames ul').find("input:radio:checked").val(), listItems);
  });
});
function deleteList() {
  if ($(this).prevAll('input').is(':radio'))
    deleteListHelper1.call(this);
  else
    deleteListHelper2.call(this);
  if ($(this).prevAll('input').prop('checked') && $(this).prevAll('input').is(':radio') &
  $(this).parent().prev().find('input').length){
    $(this).parent().prev().find('input').prop('checked', true);
  } else if ($(this).prevAll('input').prop('checked') && $(this).prevAll('input').is(':radio') &
  $(this).parent().next().find('input').length) {
    $(this).parent().next().find('input').prop('checked', true);
  }
  $(this).parent().remove();
}
function deleteListHelper1() {//TODO
  var shopLists = getLists();
  $('.listItems ul').empty();
  shopLists.splice(shopLists.indexOf($(this).prevAll('label').text()), 1);
  localStorage.removeItem($(this).prevAll('label').text());
  setLists(shopLists);
}
function deleteListHelper2() {//TODO
  var listItems = getListsItems($('.listNames ul').find("input:radio:checked").val());
  alert($('.listNames ul').find("input:radio:checked").val());
  listItems.splice(listItems.indexOf($(this).parent().text()), 1);
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
  $('.listItems ul').append('<li><input type="checkbox" class="checkList">' +
  '<label for="" class="checkListName"> ' + name +'</label><i class="fa fa-times  ' +
  'delete" aria-hidden="true"></i></li>');
  $('#itemName').val('');
}
function addListName(name) {
  $('.listNames ul').append('<li><input type="radio" name="listName" ' +
  'checked="true" value="list1"><label for=""> ' + name + '</label><i class="fa ' +
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
