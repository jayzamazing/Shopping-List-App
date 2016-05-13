var count = 5;
$(document).ready(function () {
  $(document).on('mousedown', '.delete', (function(){
    if ($(this).prevAll('input').prop('checked') && $(this).prevAll('input').is(':radio'))
      $(this).parent().next().find('input').prop('checked', true);
    $(this).parent().remove();
    //alert('here');
  }));
  $('#listNameForm').click(function() {
    console.log($(this).next());
    $('.listNames ul').append('<li><input type="radio" name="listName" ' +
    'checked="true" value="list1"><label for=""> List ' + count + '</label><i class="fa ' +
    'fa-times delete" aria-hidden="true"></i></li>');
    count++;
  });
});
