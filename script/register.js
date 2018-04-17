var UserPool;
var CognitoUser;
var initialize_cognito = (function(){
    AWS.config.region = AWS_CONFIG_REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
    });
    AWSCognito.config.region = AWS_CONFIG_REGION;
    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID
    });
    var data = {
        UserPoolId: AWS_COGNITO_USER_POOL_ID,
        ClientId: AWS_COGNITO_USER_POOL_CLIENT_C_ID,
        Paranoia : 7,
        Storage: sessionStorage
    };
    UserPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);
});

/**
 * ユーザー登録
 */
var fn_register = (function(){
    username = $("#username").val();
    email    = $("#mail").val();
    password = $("#password").val();
    if (!username || !password || !email) {
        return false;
    }
    var attributeList = [
        {
            Name: 'email',
            Value: email
        }
    ];

    UserPool.signUp(username, password, attributeList, null, function (err, result) {
        if (err) {
            console.log("signUp failed==================>>")
            console.log(err.message)
            console.log("==================>>")
            console.log(err)
            // err handling
            alert(err.message);
            message_text = err;
            message_class = "alert-danger";
        } else {
            CognitoUser = result.user;
            console.log('user name is ' + CognitoUser.getUsername());
            message_text = CognitoUser.getUsername() + "が作成されました";
            message_class = "alert-success";
            $('#username').prop('disabled', true);
            $('#password').prop('disabled', true);
            $('#auth_obj').show();
        }
        $("#message").text(message_text);
        $("#message").addClass(message_class);
        $('#message').show();
        setTimeout(function () {
            $('#message').fadeOut();
            $("#message").removeClass(message_class);
        }, 5000);
    });
});

/**
 * 認証コードを入力して有効化
 */
var fn_auth = (function () {
    auth_code = $("#authcd").val();
    if (auth_code) {
        CognitoUser.confirmRegistration(auth_code, true, function (err, result) {
            if (err) {
                console.log("email auth failed==================>>")
                console.log(err.message)
                console.log("==================>>")
                console.log(err)
                return;
            }
            console.log('call result: ' + result);
            fn_login_auth();
        });
    }
});

/**
 * ログイン処理
 */
var fn_login_auth = (function () {
    event.preventDefault();
    var name = $('#username').val()
    var authenticationData = {
        Username : name,
        Password : $('#password').val()
    };
    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
    login_data = {
        UserPoolId: AWS_COGNITO_USER_POOL_ID,
        ClientId: AWS_COGNITO_USER_POOL_CLIENT_R_ID,
        Paranoia : 7,
        Storage: sessionStorage
    };
    UserPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(login_data);
    var userData = {
        Username : name,
        Pool : UserPool,
        Storage: sessionStorage
    };
    CognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    CognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (authresult) {
            var url = "index.html";
            $('form').fadeOut(700, function(){
                $(location).attr("href", url);
            });
            $('.wrapper').addClass('form-success');
        },
        onFailure: function(err) {
            console.log("auth failed==================>>")
            console.log(err.message)
            console.log("==================>>")
            console.log(err)
        },
    });
});

/**
 * event Listner
 */
var initialize_event = (function(){
    $('#btn_register').click(function () {
        fn_register();
    });
    $('#btn_auth').click(function () {
        fn_auth();
    });
});

/**
 * initialize
 */
$(document).ready(function(){
    initialize_cognito();
    initialize_event();
});
