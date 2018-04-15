var UserPool;
var CognitoUser;
var Data;
var initialize_cognito = (function(){
    AWS.config.region = AWS_CONFIG_REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
    });
    AWSCognito.config.region = AWS_CONFIG_REGION;
    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID
    });
    Data = {
        UserPoolId: AWS_COGNITO_USER_POOL_ID,
        ClientId: AWS_COGNITO_USER_POOL_CLIENT_R_ID,
        Paranoia : 7,
        Storage: sessionStorage
    };
    var UserPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(Data);
    var CognitoUser;

    const CurrentUser = UserPool.getCurrentUser();
    if (CurrentUser != null) {
        CurrentUser.signOut();
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
    UserPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(Data);
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
            // err handling
            alert(err.message);
        },
    });
});

/**
 * event Listner
 */
var initialize_event = (function(){
    $('#btn_cognito_login').click(function () {
        fn_login_auth();
    });
    $('#btn_register').click(function () {
        window.location.href = './register.html';
    });
});

/**
 * initialize
 */
$(document).ready(function(){
    initialize_cognito();
    initialize_event();
});
