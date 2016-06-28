var $ = require('jquery');
$(document).ready(function () {
  //show error if localstorage is not available
  if (!storageStatus('localStorage'))
    $('.storageErrorStatus')[0].style.visibility = 'visible';
  //set initial state if necessary
  initialState();
  //get list info from local storage
  var shopLists = getLists();
  var listItems = getListsItems(shopLists[0]);
  var checked = getListsItems(shopLists[0].concat('.Checked'));
  //show list name and list items
  parseList(shopLists, addListName);
  parseList(listItems, addItem);
  parseChecked(checked);
  //remove highlight of all items
  $('.listNames li').each(function() {
    $(this).removeClass('highlight');
  });
  //select the first list item and show it as selected
  $('.listNames ul').find('input').first().prop('checked', true);
  $('.listNames ul').find('li').first().toggleClass('highlight', this.checked);
  /*
  * Function to delete a list item when clicking on X
  */
  $(document).on('mousedown', '.delete', (function(){
    deleteList.call(this);
  }));
  /*
  * Function to deal with adding a list name
  * @param event - used to prevent page reloading
  */
  $('#listNameForm').submit(function(event) {
    //get the list name from the input
    var name = $('#listName').val();
    //show error if input field is empty
    if (name === '') {
      $('#listName').addClass('error');
      //otherwise
    } else {
      //remove error if it was shown previously
      $('#listName').removeClass('error');
      //add list to display
      addListName(name);
      //get list from local storage and add item to list
      var shopLists = getLists();
      shopLists.push(name);
      //update local storage
      setLists('Shopping Lists', shopLists);
      //add empty list to list items on local storage
      var emptyList = [''];
      setLists(name.concat('.Checked'), emptyList);
      //empty list items section
      $('.listItems ul').empty();
    }
    //prevent page default
    event.preventDefault();
  });
  /*
  * Function that deals with adding item to list items
  * @param event - used to prevent page reloading
  */
  $('#itemNameForm').submit(function(event) {
    //get the value from the input field
    var name = $('#itemName').val();
    //show error if input field is empty
    if (name === '') {
      $('#itemName').addClass('error');
    //otherwise
    } else {
      //remove error if it was shown previously
      $('#itemName').removeClass('error');
      //add item to display
      addItem(name);
      //get all listitems
      var listItems = getListsItems($('.listNames ul').find("input:radio:checked").val());
      //if listitems is invalid then listitems becomes name
      if (listItems === null || listItems[0] === '') {
        listItems = [name];
      //otherwise
    } else {
        //add item
        listItems.push(name);
      }
      //update list items on local storage
      setListItem($('.listNames ul').find("input:radio:checked").val(), listItems);
    }
    //prevent page reload
    event.preventDefault();
  });
  /*
  * Function that deals with showing list items based on list name
  */
  $('.listNames ul').click(function() {
    //empty list items
    $('.listItems ul').empty();
    //get all list items under a line name
    var listItems = getListsItems($('.listNames ul').find("input:checked").val());
    //as long as listitems is valid
    if (listItems !== null && listItems[0] !== '') {
      //show list
      parseList(listItems, addItem);
      var listItems2 = getListsItems($('.listNames ul').find("input:checked").val().concat('.Checked'));
      //add highlighting to list items
      parseChecked(listItems2);
    }
  });
  /*
  * Function that deals with toggling of highlight and checked on click of both list and list items
  */
  $('ul').on('click', 'li', function(){
    //if this is a list
    if ($(this).find('input').is(':radio')) {
      //remove highlighted from all lists
      $('li').each(function() {
        $(this).toggleClass('highlight', false);
      });
    }
    //if this is a list and not checked, then check
    if ($(this).find("input:radio").val()){
      if (!$(this).find('input').prop('checked')){
        $(this).find('input').prop('checked', true);
      }
      //add highlighting to item
      $(this).toggleClass('highlight', this.checked);
    //otherwise clicked is list item
    } else {
      //get list of checked items
      var checked = getListsItems($('.listNames ul').find("input:checked").val().concat('.Checked'));
      //if item is checked
      if ($(this).find('input').prop('checked')){
        //remove checked from item and remove from checked list
        $(this).find('input').prop('checked', false);
        checked[$(this).index()] = '';
        //otherwise
      } else {
        //add checked and add it to checked list
        $(this).find('input').prop('checked', true);
        checked[$(this).index()] = 'checked';
      }
      //highlight item and add to list of checked on local storage
      $(this).toggleClass('highlight', this.checked);
      setListItem($('.listNames ul').find("input:checked").val().concat('.Checked'), checked);
    }
  });
  /*
  * Function to delete list
  */
  function deleteList() {
    //if the following is a list or list item
    if ($(this).find('input').is(':radio')) {
      //iterate through each
      $(this).parent().each(function() {
        //remove highlighting for each
        $(this).toggleClass('highlight', false);
      });
    }
    //if the following is a list or list item
    if ($(this).prev().find('input').is(':radio'))
      //delete list
      deleteListHelper1.call(this);
    else
      //delete list item
      deleteListHelper2.call(this);
    //delete the list items
    $('.listItems ul').empty();
    var listItems = getListsItems($('.listNames ul').find("input:radio:checked").val());
    var checked = getListsItems($('.listNames ul').find("input:radio:checked").val().concat('.Checked'));
    //show list items and highlight checked
    parseList(listItems, addItem);
    parseChecked(checked);
  }
  /*
  * Function to delete list from shopping list
  */
  function deleteListHelper1() {
    //get the list
    var shopLists = getLists();
    //clear list items
    $('.listItems ul').empty();
    //remove selected list
    shopLists.splice(shopLists.indexOf($(this).prev().find('input').val()), 1);
    //remove list from local storage
    //localStorage.removeItem($(this).prev().find('input').val());TODO redo based on this
    setLists('Shopping Lists', shopLists);
    //if the shopping list length is 2 due to '[]'
    if (localStorage.getItem('Shopping Lists').length === 2) {
      //remove the base item
      localStorage.removeItem('Shopping Lists');
      //set initial list
      initialState();
      //get list and list items
      shopLists = getLists();
      var listItems = getListsItems(shopLists[0]);
      //display list and list items
      parseList(shopLists, addListName);
      parseList(listItems, addItem);
    }
  }
  /*
  * Function to delete item from a list
  */
  function deleteListHelper2() {
    //get list items and what is checked
    var listItems = getListsItems($('.listNames ul').find("input:radio:checked").val());
    var checked = getListsItems($('.listNames ul').find("input:radio:checked").val().concat('.Checked'));
    //remove item from checked list and then remove it from local storage
    checked.splice(listItems.indexOf($(this).parent().find('input').val()), 1);
    localStorage.removeItem($('.listNames ul').find("input:radio:checked").val().concat('.Checked'));
    //remove item from list and remove from local storage
    listItems.splice(listItems.indexOf($(this).prev().find('input').val()), 1);
    setListItem($('.listNames ul').find("input:radio:checked").val(), listItems);
    setLists($('.listNames ul').find("input:radio:checked").val().concat('.Checked'), checked);
  }
  /*
  * Function to test if a storage type is available
  */
  function storageStatus(type) {
  	try {
      //test storage type and add items to it
  		var test = window[type], t1 = 'test';
  		test.setItem(t1, t1);
  		test.removeItem(t1);
      //return true if successful
  		return true;
  	}
  	catch(e) {
      //return false if type is not available
  		return false;
  	}
  }
  /*
  * Function to add a item name to the shopping list items section
  * @param name - item name
  */
  function addItem(name) {
    //add item to the list
    $('.listItems ul').append('<li><label for="" class="checkListName">' +
    '<input type="checkbox" value="' + name + '" class="hidden"> ' + name +
    '</label><i class="fa fa-times delete" aria-hidden="true"></i></li>');
    //clear field
    $('#itemName').val('');
  }
  /*
  * Function to add a list name to the shopping list section
  * @param name - list name
  */
  function addListName(name) {
    //iterate through each element
    $('li').each(function() {
      //remove highlight from all elements
      $(this).removeClass('highlight');
    });
    //add list name
    $('.listNames ul').append('<li><label for=""><input type="radio" name="listName" ' +
    'value="' + name + '"checked="true" class="hidden"> ' + name + '</label><i class="fa ' +
    'fa-times delete" aria-hidden="true"></i></li>').find('li:last').addClass('highlight', this.checked);
    //empty the following field
    $('#listName').val('');
  }
  /*
  * Function to set the state of the application if it has never been run
  */
  function initialState() {
    //if local storage does not contain shopping lists
    if (localStorage.getItem('Shopping Lists') === null) {
      //create shopping list and add default list to local storage
      var value = ['List 1'];
      localStorage.setItem('Shopping Lists', JSON.stringify(value));
      //if List 1 is empty
      if (localStorage.getItem("List 1") === null) {
        //add default values and set all values as unchecked
        value = ['Milk', 'Pepper', 'Salt', 'Eggs', 'Dish Detergent'];
        var value2 = ['', '', '', '', ''];
        //add default list and checked values to local storage
        localStorage.setItem('List 1', JSON.stringify(value));
        localStorage.setItem('List 1.Checked', JSON.stringify(value2));
      }
    }
  }
  /*
  * Function to get shopping list names
  * @return list names
  */
  function getLists() {
    return JSON.parse(localStorage.getItem('Shopping Lists'));
  }
  /*
  * Function to update shopping list on localStorage
  * @param list - name of localstorage item
  * @param shoplists - list names array
  */
  function setLists(list, shopLists) {
    localStorage.setItem(list, JSON.stringify(shopLists));
  }
  /*
  * Function to get list items from shopping list
  * @param list - list name to search
  * @return - list items of shopping list
  */
  function getListsItems(list) {
    return JSON.parse(localStorage.getItem(list));
  }
  /*
  * Function to update items to local storage
  * @param list - key to set list items
  * @param listItems values to store
  */
  function setListItem(list, listItems) {
    localStorage.setItem(list, JSON.stringify(listItems));
  }
  /*
  * Function that takes list and perform function on the list
  * @param list - list to perform function callback
  * @callBack - function to perform on list
  */
  function parseList(list, callback) {
    //iterate over list
    for (var x in list){
      //perform function over list item
      callback(list[x]);
    }
  }
  /*
  * Function that takes a list and adds highlight and checked if the item is checked
  * @param list - list to iterate over
  */
  function parseChecked(list) {
    //ensure list is valid
    if (list !== null) {
      //iterate through list
      for (i = 0; i < list.length; i++) {
        //if item is checked
        if (list[i] === 'checked'){
          //get the list item and input
          var listObj = $('.listItems li')[i];
          var listObj2 = $('.listItems li input')[i];
          //add hightlight to list item and checked to input field
          listObj.className += ' highlight';
          listObj2.checked = true;
        }
      }
    }
  }
});