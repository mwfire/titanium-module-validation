/* 
 * This is more or less a port from Rick Harrisons validate.js to Titanium
 * @author Martin Wildfeuer
 * @version 0.1
 * 
 * Requires underscore.js!
 * 
 * Based on validate.js 1.3
 * Copyright (c) 2013 Rick Harrison, http://rickharrison.me
 * validate.js is open sourced under the MIT license.
 * Portions of validate.js are inspired by CodeIgniter.
 * http://rickharrison.github.com/validate.js
 */

/**
 * Holds the error messages
 * @property errors
 * @type {Array}
 * @private
 */
var errors = [];

/**
 * Underscore goodness
 * @property _
 * @type {Object}
 * @private
 */
var _ = require('/lib/underscore')._;

/**
 * Error messages
 * @property messages
 * @type {Object}
 * @private
 */
var messages = {
    required           : L('validationRequiredField', 'The %s field is required.'),
    matches            : L('validationMatchField', 'The %s field does not match the %p field.'),
    valid_email        : L('validationValidEmail', 'The %s field must contain a valid email address.'),
    valid_emails       : L('validationValidEmails', 'The %s field must contain all valid email addresses.'),
    min_length         : L('validationMinLength', 'The %s field must be at least %p characters in length.'),
    max_length         : L('validationMaxLength', 'The %s field must not exceed %p characters in length.'),
    exact_length       : L('validationExactLength', 'The %s field must be exactly %p characters in length.'),
    greater_than       : L('validationGreaterThan', 'The %s field must contain a number greater than %p.'),
    is_checked         : L('validationIsChecked', '%s has to be set.'),
    agree_on           : L('validationAgreeOn', 'You have to agree to %s.'),
    age_at_least       : L('validationAgeAtLeast', 'You must be at least %p years old to continue!'),
    less_than          : L('validationLessThan', 'The %s field must contain a number less than %p.'),
    alpha              : L('validationAlpha', 'The %s field must only contain alphabetical characters.'),
    alpha_numeric      : L('validationAlphaNumeric', 'The %s field must only contain alpha-numeric characters.'),
    alpha_dash         : L('validationDash', 'The %s field must only contain alpha-numeric characters, underscores, and dashes.'),
    numeric            : L('validationNumeric', 'The %s field must contain only numbers.'),
    integer            : L('validationInteger', 'The %s field must contain an integer.'),
    decimal            : L('validationDecimal', 'The %s field must contain a decimal number.'),
    is_natural         : L('validationIsNatural', 'The %s field must contain only positive numbers.'),
    is_natural_no_zero : L('validationIsNaturalNoZero', 'The %s field must contain a number greater than zero.'),
    valid_ip           : L('validationValidIp', 'The %s field must contain a valid IP.'),
    valid_base64       : L('validationValidBase64', 'The %s field must contain a base64 string.'),
    valid_credit_card  : L('validationValidCreditCard', 'The %s field must contain a valid credit card number.'),
    valid_url          : L('validationValidUrl', 'The %s field must contain a valid URL.')
};

/**
 * Regex check vars
 * @type {Vars}
 * @private
 */
var ruleRegex          = /^(.+?)\[(.+)\]$/,
    numericRegex       = /^[0-9]+$/,
    integerRegex       = /^\-?[0-9]+$/,
    decimalRegex       = /^\-?[0-9]*\.?[0-9]+$/,
    emailRegex         = /^[a-zA-Z0-9.!#$%&amp;'*+\-\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/,
    alphaRegex         = /^[a-z]+$/i,
    alphaNumericRegex  = /^[a-z0-9]+$/i,
    alphaDashRegex     = /^[a-z0-9_\-]+$/i,
    naturalRegex       = /^[0-9]+$/i,
    naturalNoZeroRegex = /^[1-9][0-9]*$/i,
    ipRegex            = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
    base64Regex        = /[^a-zA-Z0-9\/\+=]/i,
    numericDashRegex   = /^[\d\-\s]+$/,
    urlRegex           = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

/**
 * Regex check functions
 * @property hooks
 * @type {Object}
 * @private
 */
var hooks = {
    required: function(value) {
        return (value !== null && value !== '');
    },
    
    matches: function(value, param) {
        return value === param;
    },

    valid_email: function(value) {
        return emailRegex.test(value);
    },

    min_length: function(value, length) {
        if (!numericRegex.test(length)) {
            return false;
        }
        return (value.length >= parseInt(length, 10));
    },

    max_length: function(value, length) {
        if (!numericRegex.test(length)) {
            return false;
        }

        return (value.length <= parseInt(length, 10));
    },

    exact_length: function(value, length) {
        if (!numericRegex.test(length)) {
            return false;
        }
        return (value.length === parseInt(length, 10));
    },

    greater_than: function(value, param) {
        if (!decimalRegex.test(value)) {
            return false;
        }
        return (parseFloat(value) > parseFloat(param));
    },

    less_than: function(value, param) {
        if (!decimalRegex.test(value)) {
            return false;
        }
        return (parseFloat(value) < parseFloat(param));
    },

    age_at_least: function(value, param) {
        var today = new Date();
        var birthDate = new Date(value);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return parseInt(age) >= parseInt(param);
    },
    
    is_checked: function(value) {
        return value;
    },
    
    agree_on: function(value) {
        return value;
    },

    alpha: function(value) {
        return (alphaRegex.test(value));
    },

    alpha_numeric: function(value) {
        return (alphaNumericRegex.test(value));
    },

    alpha_dash: function(value) {
        return (alphaDashRegex.test(value));
    },

    numeric: function(value) {
        return (numericRegex.test(value));
    },

    integer: function(value) {
        return (integerRegex.test(value));
    },

    decimal: function(value) {
        return (decimalRegex.test(value));
    },

    is_natural: function(value) {
        return (naturalRegex.test(value));
    },

    is_natural_no_zero: function(value) {
        return (naturalNoZeroRegex.test(value));
    },

    valid_ip: function(value) {
        return (ipRegex.test(value));
    },

    valid_base64: function(value) {
        return (base64Regex.test(value));
    },

    valid_url: function(value) {
        return (urlRegex.test(value));
    },

    valid_credit_card: function(value){
        // Luhn Check Code from https://gist.github.com/4075533
        // accept only digits, dashes or spaces
        if (!numericDashRegex.test(value)) return false;

        // The Luhn Algorithm. It's so pretty.
        var nCheck = 0, nDigit = 0, bEven = false;
        var strippedField = value.replace(/\D/g, "");

        for (var n = strippedField.length - 1; n >= 0; n--) {
            var cDigit = strippedField.charAt(n);
            nDigit = parseInt(cDigit, 10);
            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }

            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) === 0;
    }
};

/**
 * Holds the error messages
 * @method validate
 * @param {Array} inputFields
 * @param {Object} options
 * @return {Bool} Validation success
 * @public
 */
function validate(inputFields, options) {
    // Check for dependencies
    if(!_) { return Ti.API.error('[validationModule] this plugin requires underscore!'); } 
    
    // Check if inputFields are valid
    if(!inputFields || !_.isArray(inputFields) || !inputFields.length) { return Ti.API.error('[validationModule] Please specify at least one input field!'); }
    
    // Prepare options
    options = options || {};
    
    // Reset errors array
    errors = [];
    
    // Validate all fields that have rules applied
    for(var i=0, max=inputFields.length; i<max; i++ ) {
        var inputField = inputFields[i];
        if(inputField.rules) {
            validateField(inputField);
        }
    }
    
    // Error handling
    if (errors.length > 0) {
        if(options.showAlert) { showAlert(); }
        return false;
    }
    return true;
};

/**
 * Holds the error messages
 * @method validateField
 * @param {Ti.UI.TextField} inputField
 * @return {Void}
 * @private
 */
function validateField(inputField) {
    var rules = inputField.rules.split('|'),
        indexOfRequired = inputField.rules.indexOf('required'),
        isEmpty = (!inputField.value || inputField.value === '' || inputField.value === undefined);

     // Run through the rules and execute the validation methods as needed
    for (var i = 0, ruleLength = rules.length; i < ruleLength; i++) {
        var method = rules[i],
            param = null,
            failed = false,
            parts = ruleRegex.exec(method);

        // If this field is not required and the value is empty, continue on to the next rule
        if (!inputField.isSwitch && indexOfRequired === -1 && isEmpty) {
            continue;
        }

        // If the rule has a parameter (i.e. matches[param]) split it out
        if (parts) {
            method = parts[1];
            param = parts[2];
        }
        
        if (method.charAt(0) === '!') {
            method = method.substring(1, method.length);
        }

        // If the hook is defined, run it to find any validation errors
        if (typeof hooks[method] === 'function') {
            
            // Special treatment for "matches"
            if(method === 'matches') {
                if (!hooks[method].apply(this, [inputField.value, inputField.matchField.value])) {
                    failed = true;
                }
            // All other tests
            } else if (!hooks[method].apply(this, [inputField.value, param])) {
                failed = true;
            }
        }
     
        // If the hook failed, add a message to the errors array
        if (failed) {
            var source = messages[method];
            var message = source.replace('%s', inputField.name);
            if(method === 'matches') { param = inputField.matchField.name; } // Special matches treatment
            if(param) { message = message.replace('%p', param); }
            errors.push({ message: message });

            // Break out so as to not spam with validation errors (i.e. required and valid_email)
            break;
        }
    }
    return;
};

/**
 * Holds the error messages
 * @method showAlert
 * @return {Void}
 * @private
 */
function showAlert() {
    var alertText = '';
    for(var i=0, max=errors.length; i<max; i++) {
        alertText += errors[i].message + '\n';
    }
    var alert = Ti.UI.createAlertDialog({
        title   : L('validationErrorTitle', 'Oh, there\'s still work to do!'),
        message : alertText
    }).show();
    return;
}

// Public API
exports.validate = validate;