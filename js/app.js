$(function(){

  // global arguments
  var body = $('body')

  // return a HTML update book form object
  function bookForm(id, author, title, isbn, publisher, genre, method){
    if (method === 'POST') {
      var form = $('<form class="add-book" method="post">')
      form.attr('action', `http://127.0.0.1:8000/book/`)
      var formGroup = $('<div class="form-group">')
      id = 'new'
      var updateButton = $('<input class="btn btn-info add_submit" type="submit" value="Add">')
    } else {
      var form = $('<form class="update-book" method="put">')
      form.attr('action', `http://127.0.0.1:8000/book/${id}/`)
      var formGroup = $('<div class="form-group">')

      // id
      var inputId = $('<input type="hidden" name="id">')
      inputId.val(id)

      // submit
      var updateButton = $('<input class="btn btn-info update_submit" type="submit" value="Update">')
    }

    // author
    var authorLabel = $('<label>Author</label>')
    authorLabel.attr('for', `author-${id}`)
    var authorField = $('<input class="form-control" type="text" name="author">')
    authorField.attr('id', `author-${id}`)
    authorField.val(author)

    // title
    var titleLabel = $('<label>Title</label>')
    titleLabel.attr('for', `title-${id}`)
    var titleField = $('<input class="form-control" type="text" name="title">')
    titleField.attr('id', `title-${id}`)
    titleField.val(title)

    // isbn
    var isbnLabel = $('<label>Isbn</label>')
    isbnLabel.attr('for', `isbn-${id}`)
    var isbnField = $('<input class="form-control" type="text" name="isbn">')
    isbnField.attr('id', `isbn-${id}`)
    isbnField.val(isbn)

    //publisher
    var publisherLabel = $('<label>Publisher</label>')
    publisherLabel.attr('for', `publisher-${id}`)
    var publisherField = $('<input class="form-control" type="text" name="publisher">')
    publisherField.attr('id', `publisher-${id}`)
    publisherField.val(publisher)

    // genre options
    var genreLabel = $('<label>Genre</label>')
    genreLabel.attr('for', `genre-${id}`)
    var genreField = $('<select class="form-control" id="genre" name="genre">')
    genreField.attr('id', `genre-${id}`)
    genreField.val(genre)

    var option1 = $('<option value="1" >Romans</option>')
    var option2 = $('<option value="2" >Obyczajowa</option>')
    var option3 = $('<option value="3" >Sci-fi i fantasy</option>')
    var option4 = $('<option value="4" >Literatura faktu</option>')
    var option5 = $('<option value="5" >Popularnonaukowa</option>')
    var option6 = $('<option value="6" >Popularnonaukowa</option>')
    var option7 = $('<option value="7" >Kryminał, sensacja</option>')

    var hr = $('<hr>')

    genreField.append(option1, option2, option3, option4, option5, option6, option7)
    formGroup.append(inputId, authorLabel, authorField, titleLabel, titleField, isbnLabel, isbnField)
    formGroup.append(publisherLabel, publisherField, genreLabel, genreField, hr, updateButton)
    form.append(formGroup)

    return form
  }

  // return a HTML delete book form object
  function deleteForm(id, title){
    var form = $('<form class="form-inline" method="delete">')
    var formGroup = $('<div class="form-inline">')
    var inputId = $('<input type="hidden" name="id">')
    var deleteButton = $('<input class="btn btn-danger btn-sm delete_submit" type="submit" value="X">')
    var textLabel = $('<span class="book_details">')
    inputId.val(id)
    textLabel.text(title)

    formGroup.append(inputId)
    formGroup.append(deleteButton)
    formGroup.append(textLabel)
    form.append(formGroup)

    return form
  }

  // return a HTML card template
  function createCard(id, title, type){
    var mainContaier = $('<div class="container">')
    var card = $('<div class="card">')
    var cardHeader = $('<div class="card-header">')
    if (type === 'ADD') {
      var cardBody = $('<div class="card-body">')
      cardBody.append(bookForm(null, null, null, null, null, null, "POST"))
      form = $('<p>')
      form.text('Add new book')
    } else {
      var cardBody = $('<div class="card-body hidden">')
      form = deleteForm(id, title)
    }
    cardHeader.append(form)
    card.append(cardHeader)
    card.append(cardBody)

    mainContaier.append(card)

    return mainContaier
  }

  // add eventListener to all delete buttons. Removes book from database
  body.on('click', '.delete_submit', function(event){
    event.preventDefault()
    var book = $(event.currentTarget);
    var container = book.parent().parent().parent().parent().parent()
    var id = $(book).siblings().first().val();
    container.remove();

    // ajax delete request to database
    $.ajax({
      url: `http://127.0.0.1:8000/book/${id}/`,
      data: {},
      type: "DELETE",
      dataType: "json",
    }).done(function(book){
      alert("Book was deleted")
    })
  })

  // add eventListener to all update buttons. Updates book in database
  body.on('submit', '.update-book', function(event){
    event.preventDefault()
    var data = $(this).serializeArray()

    // ajax delete request to database
    $.ajax({
      url: `http://127.0.0.1:8000/book/${data[0].value}/`,
      data: data,
      type: "PUT",
      dataType: "json",
    }).done(function(book){
      alert("Book was updated")
    }).fail(function(msg){
      alert("Something went wrong.")
    })
  })

  // add eventListener to all add buttons. Addsnew book to database
  body.on('submit', '.add-book', function(event){
    event.preventDefault()
    var data = $(this).serializeArray()
    console.log(data);

    // ajax delete request to database
    $.ajax({
      url: 'http://127.0.0.1:8000/book/',
      data: data,
      type: "POST",
      dataType: "json",
    }).done(function(book){
      alert("Book was Added")
    }).fail(function(msg){
      alert("Something went wrong.")
    })
  })

  // add eventListener to all title labels to expand div with book details
  body.on('click', '.book_details', function(event){
    event.preventDefault()

    var book = $(event.currentTarget);
    var id = $(book).siblings().first().val();

    var cardBody = $(book).parent().parent().parent().siblings('.card-body').first()
    cardBody.toggleClass('hidden')

    // ajax get request to database. collect book item
    $.ajax({
      url: `http://127.0.0.1:8000/book/${id}/`,
      data: {},
      type: "GET",
      dataType: "json",
    }).done(function(b){
      if (cardBody.find('form').length === 0) {
        var form = bookForm(b.id, b.author, b.title, b.isbn, b.publisher, b.genre)
        cardBody.append(form)
      } else {
        // updateForm()
      }
    })
  })

  // add book form to html
  var card = createCard(null, null, 'ADD')
  body.append(card)

  // ajax get request to collect book list. Create list of books in HTML
  $.ajax({
    url: "http://127.0.0.1:8000/book/",
    data: {},
    type: "GET",
    dataType: "json",
  }).done(function(book){
    for (var i = 0; i < book.length; i++) {
      var title = book[i].title;
      var id = book[i].id;

      body.append(createCard(id, title));
    }
  })

})
