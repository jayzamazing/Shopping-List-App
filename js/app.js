$(document).ready(function () {
  if (!storageStatus('localStorage'))
    $('.storageErrorStatus')[0].style.visibility = 'visible';
  initialState();
  var shopLists = getLists();
  var listItems = getListsItems(shopLists[0]);
  parseList(listItems, addItem);
  //localStorage.removeItem('List 1');

  $(document).on('mousedown', '.delete', (function(){
    if ($(this).prevAll('input').prop('checked') && $(this).prevAll('input').is(':radio') &
    $(this).parent().prev().find('input').length){
      $(this).parent().prev().find('input').prop('checked', true);
    } else if ($(this).prevAll('input').prop('checked') && $(this).prevAll('input').is(':radio') &
    $(this).parent().next().find('input').length) {
      $(this).parent().next().find('input').prop('checked', true);
    }
    $(this).parent().remove();
  }));
  $('#listNameButton').click(function() {
    addListItem($('#listName').val());
  });
  $('#itemNameButton').click(function() {
    addItem($('#itemName').val());
  });
});
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
function addListItem(name) {
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
function getListsItems(list) {
  return JSON.parse(localStorage.getItem(list));
}
function parseList(list, methodCallBack){
  for (var x in list){
    methodCallBack(list[x]);
  }
}
