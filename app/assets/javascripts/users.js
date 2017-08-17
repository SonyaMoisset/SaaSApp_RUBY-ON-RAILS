/* global $, Stripe */

$(document).on('turbolinks:load', function() {
    var theForm = $('#pro_form');
    var submitBtn = $('#form-submit-btn')
    
    Stripe.setPublishableKey($('meta[name="stripe-key"]').attr('content'));
    
    submitBtn.click(function(event) {
        event.preventDefault();
        submitBtn.val("Processing").prop('disabled', true);
        
        var ccNum = $('#card_number').val();
        var cvcNum = $('#card_code').val();
        var expMonth = $('#card_month').val();
        var expYear = $('#card_year').val();
        
        var error = false;
        
        if(!Stripe.card.validateCardNumber(ccNum)) {
            error = true;
            alert('The credit card number appears to be invalid');
        }
        
        if(!Stripe.card.validateCVC(cvcNum)) {
            error = true;
            alert('The CVC numver appears to be invalid');
        }
        
        if(!Stripe.card.validateExpiry(expMonth, expYear)) {
            error = true;
            alert('The expiration date appears to be invalid');
        }
        
        if(error) {
            submitBtn.val("Sign Up").prop('disabled', false);
        } else {
            Stripe.createToken({
                number: ccNum,
                cvc: cvcNum,
                exp_month: expMonth,
                exp_year: expYear
            }, stripeReponseHandler);
        }
        return false;
    });
    
    function stripeReponseHandler(status, response) {
        var token = response.id;
        
        theForm.append($('<input type="hidden" name="user[stripe_card_token]">').val(token));
        theForm.get(0).submit();
    }
});