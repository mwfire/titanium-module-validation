#Titanium Validation Module

##Description
This module is designed to help you with validating input fields & switches. It is based on Rick Harrisons [validate.js](http://rickharrison.github.com/validate.js).

##Installation
Just add `de.mwfire.validate.js` to your current projects `lib` folder. Create the folder as a child of Resources if it does not exist yet on classic Titanium projects. If you are using Alloy `lib` should be in the `app` directory.
    
##Methods
**`validate( inputFields, options )`**
<br>Inits validation and returns **true** if all validation rules have passed, otherwise **false**

* **inputFields** [Array] required<br>The input fields you want to validate
* **options** [Dictionary] optional<br>Options, by now only **showAlert: bool** is supported. Set true if you want to display an alert containing the validation errors

##Rules
Applying rules is easily done by adding a `rule` and `name` property to your Ti.UI.TextField or Ti.UI.Switch. You set all rules in your .tss file as well, only the `matches` rule and Sitches need special treatment. The following rules are available and should be pretty self explanatory:

    required
    matches
    valid_email
    valid_emails
    min_length[int]
    max_length[int]
    exact_length[int]
    greater_than[float]
    less_than[float]
    is_checked
    agree_on
    age_at_least[int(years)]
    alpha
    alpha_numeric
    alpha_dash
    numeric
    integer
    decimal
    is_natural
    is_natural_no_zero
    valid_ip
    valid_base64
    valid_credit_card
    valid_url

Some rules require a parameter, passed in square brackets.<br>
` rules: 'min_length[5]'`<br>
Multiple rules can be combined, separated by **|**.<br>
` rules: 'required|min_length[5]|integer'`<br>
Have a look at the examples for more info.

##Accessing the module
To access this module, you would do the following:

    var validation = require('/lib/de.mwfire.validate');

If you are on Alloy, you can omit the lib folder:

    var validation = require('de.mwfire.validate');   

##Example

```javascript
// Assuming you have a window called win
// Require the module
var validation = require('/lib/de.mwfire.validate');

// Email is required and has to be valid
var emailField = Ti.UI.createTextField({
    hintText     : 'Email',
    name         : 'Email',
    rules        : 'required|valid_email'
});
win.add(emailField);

// Password is required, min of 5 chars and max of 30
var passwordField = Ti.UI.createTextField({
    hintText     : 'Password',
    name         : 'Password',
    passwordMask : true,
    rules        : 'required|min_length[5]|max_lenght[30]'
});
win.add(passwordField);

// Special case "matches". Add property "matchField"
// and pass the field you want to validate
var repeatPasswordField = Ti.UI.createTextField({
    hintText     : 'Repeat Password',
    name         : 'Repeat Password',
    passwordMask : true,
    rules        : 'matches',
    matchField   : passwordField
});
win.add(repeatPasswordField);

// Special case "switch".
// Add property "isSwitch" and pass true
var termsCheckbox = Ti.UI.createSwitch({
    rules        : 'is_checked',
    isSwitch     : true
});
win.add(termsCheckbox);

// Our send button
var sendButton = Ti.UI.createButton({
   title         : 'Send'
});

// Validate the "form"
sendButton.addEventListener('click', function() {
   if(validation.validate([ emailField, passwordField, repeatPasswordField, termsCheckbox], { showAlert: true})) {
      alert('Passed!');
   } else {
      alert('Failed!');
   }
});
```

##Note
I did not have the chance to test all rules, so if you find anything that does not work, feel free to notify me!

##Platform
This should work on all platforms, though it is only tested on iOS and Android.

## Author

© 2013 Martin Wildfeuer<br>
mwfire web development<br>
[www.mwfire.de](http://www.mwfire.de)

## License

Licensed under the Apache License, Version 2.0 (the "License")

