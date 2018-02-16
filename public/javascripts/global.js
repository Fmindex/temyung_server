// Userlist data array for filling in info box
var coworkingListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#coworkingList table tbody').on('click', 'td a.linkshowuser', showCoworkingInfo);

    // Add User button click
    $('#btnAddCoworking').on('click', addCoworking);
    $('#btnEditCoworking').on('click', editCoworking);

    // Delete User link click
    $('#coworkingList table tbody').on('click', 'td a.linkdeleteuser', deleteCoworking);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/coworking/coworkinglist/', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        coworkingListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.name + '" myid="' + this._id + '" myimg="' + this.img + '" myclick="' + this.click + '" title="Show Details">' + this.name + '</a></td>';
            tableContent += '<td>' + this.img + '</td>';
            tableContent += '<td>' + this.space + '</td>';
            tableContent += '<td>' + this.click + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#coworkingList table tbody').html(tableContent);
    });
};

// Show User Info
var thisCoworkingName, thisCoworkingId, thisCoworkingImg, thisCoworkingClick;
function showCoworkingInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    thisCoworkingName = $(this).attr('rel');
    thisCoworkingId = $(this).attr('myid');
    thisCoworkingImg = $(this).attr('myimg');
    thisCoworkingClick = $(this).attr('myclick');
    console.log(thisCoworkingId);
    // Get Index of object based on id value
    var arrayPosition = coworkingListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisCoworkingName);

    // Get our User Object
    var thisCoworkingObject = coworkingListData[arrayPosition];

    //Populate Info Box
    $('#coworkingInfoName').text(thisCoworkingObject.name);
    $('#coworkingInfoImg').text(thisCoworkingObject.img);
    $('#coworkingInfoSpace').text(thisCoworkingObject.space);

};

// Add Coworking
function addCoworking(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addCoworking input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newCoworking = {
            'name': $('#addCoworking fieldset input#inputCoworkingName').val(),
            'img': $('#addCoworking fieldset input#inputCoworkingImg').val(),
            'space': $('#addCoworking fieldset input#inputCoworkingSpace').val(),
            'click': 0,
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newCoworking,
            url: '/coworking/addcoworking/',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addCoworking fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteCoworking(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {
        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/coworking/deletecoworking/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

//Edit Coworking
function editCoworking(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#editCoworking input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newCoworking = {
            'name': thisCoworkingName,
            'img': thisCoworkingImg,
            'space': $('#editCoworking fieldset2 input#inputSpace').val(),
            'click': thisCoworkingClick
        }
        console.log(newCoworking);
        console.log(thisCoworkingId);
        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'PUT',
            data: newCoworking,
            url: '/coworking/editcoworking/' + thisCoworkingId,
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            

                // Clear the form inputs
                $('#editCoworking fieldset2 input#inputSpace').val('');
                $('#coworkingInfoSpace').text(newCoworking.space);

                // Update the table
                populateTable();
            
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};