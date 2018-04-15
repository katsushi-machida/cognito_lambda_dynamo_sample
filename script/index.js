AWS.config.region = AWS_CONFIG_REGION;
AWSCognito.config.region = AWS_CONFIG_REGION;

const userData = {
    UserPoolId: AWS_COGNITO_USER_POOL_ID,
    ClientId: AWS_COGNITO_USER_POOL_CLIENT_R_ID,
    Storage: sessionStorage
};
const userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(userData);
const cognitoUser = userPool.getCurrentUser();
var apigClient;

/**
 * ログイン画面遷移
 */
var fn_move_login = (function(){
    $(location).attr("href", "login.html");
});

/**
 * 初期データ取得
 */
var fn_initialize_home_data = (function(){
    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, sessresult) {
            if (sessresult) {
                cognitoUser.getUserAttributes(function(err, attrresult) {
                    if (err) {
                        alert(err);
                        return;
                    }

                    // debug 
                    $("#username").html(cognitoUser.username);
                    for (i = 0; i < attrresult.length; i++) {
                        if (attrresult[i].getName()=="email"){
                            $("#mail").html(attrresult[i].getValue());
                        }
                    }

                    // 認証情報取得
                    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID
                        ,Logins: {
                            AWS_COGNITO_LOGINS_KEY: sessresult.getIdToken().getJwtToken()
                        }
                    });

                    // API gateway client作成
                    apigClient = apigClientFactory.newClient({
                        accessKey: AWS.config.credentials.accessKeyId,
                        secretKey: AWS.config.credentials.secretAccessKey,
                        sessionToken: AWS.config.credentials.sessionToken,
                        region: AWS.config.region
                    });        

                    var additionalParams = {
                        headers: {
                            Authorization: sessresult.getIdToken().jwtToken
                        },
                        queryParams: {}
                    };

                    // API call start ===>>
                    apigClient.HogeHogeGet({}, {}, additionalParams)
                    .then(function(result){
                      // Add success callback code here.
                      console.log("success!!!!!");
                      console.log(result);
                    }).catch( function(result){
                      // Add error callback code here.
                      console.log("fail!!!!!!!");
                      console.log(result);
                    });
                    // <<=== API call end
                });
            } else {
                fn_move_login();
            }
        });
    } else {
        fn_move_login();
    }
});

/**
 * initialize
 */
$(document).ready(function(){
    fn_initialize_home_data();
    // html initialize
    $('ul.tabs').tabs();
});
