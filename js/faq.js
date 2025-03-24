// jQuery FAQ functionality
$(document).ready(function() {
    console.log('jQuery FAQ script loaded');
    
    // Handle FAQ question clicks
    $('.faq-question').click(function() {
        console.log('FAQ question clicked');
        
        // Get parent item
        var $item = $(this).parent('.faq-item');
        var $answer = $item.find('.faq-answer');
        
        // If this FAQ is already active, close it
        if ($item.hasClass('active')) {
            $item.removeClass('active');
            $answer.css('max-height', '0');
        } else {
            // Close all open FAQs
            $('.faq-item.active').removeClass('active');
            $('.faq-answer').css('max-height', '0');
            
            // Open this FAQ
            $item.addClass('active');
            $answer.css('max-height', $answer.prop('scrollHeight') + 'px');
        }
    });
    
    // Initialize any FAQs that should start open
    $('.faq-item.active').each(function() {
        var $answer = $(this).find('.faq-answer');
        $answer.css('max-height', $answer.prop('scrollHeight') + 'px');
    });
}); 