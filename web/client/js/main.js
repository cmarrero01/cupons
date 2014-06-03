$(document).ready(function(){
    $(document).delegate('.toggleRegister','click',function(){
        $('.loginForm').slideToggle();
        $('.registerForm').slideToggle();
        return false;
    });

    $(document).delegate('.sendToMyFriend','click',function(){
        $('.sendToMyFriendForm').show();
        return false;
    });

    $(document).delegate('.sendToMyFriendForm .overlay','click',function(){
        $('.sendToMyFriendForm').fadeOut();
        return false;
    });

    $(document).delegate('.nav-left','click',function(){
        $('.collapse-mobile').slideToggle();
    });

    $(document).delegate('.nav-right','click',function(){
        $('.collapse-location').slideToggle();
    });

    $(document).delegate('.terms','click',function(){
        $('#terms').slideToggle();
    });

});