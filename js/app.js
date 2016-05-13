$(document).ready(function () {
  $(document).on('mousedown', '.delete', (function(){
    console.log($(this).prevAll('input').prop('checked'));
    console.log($(this).parent().prev().find('input').length);
    console.log($(this).parent().next().find('input').length);
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
    $('.listNames ul').append('<li><input type="radio" name="listName" ' +
    'checked="true" value="list1"><label for=""> ' + $('#listName').val() + '</label><i class="fa ' +
    'fa-times delete" aria-hidden="true"></i></li>');
    $('#listName').val('');
  });
  $('#itemNameButton').click(function() {
    $('.listItems ul').append('<li><input type="checkbox" class="checkList">' +
    '<label for="" class="checkListName"> ' + $(itemName).val() +'</label><i class="fa fa-times  ' +
    'delete" aria-hidden="true"></i></li>');
    $(itemName).val('');
  });
});
