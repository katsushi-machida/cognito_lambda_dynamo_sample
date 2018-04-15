// aws region
const AWS_CONFIG_REGION = 'ap-northeast-1';
// cognito identity pool id
const AWS_COGNITO_IDENTITY_POOL_ID = 'ap-northeast-1:*************************';
// cognito user pool id
const AWS_COGNITO_USER_POOL_ID = 'ap-northeast-1_*************';
// cognito application client ユーザーログイン用
const AWS_COGNITO_USER_POOL_CLIENT_R_ID = '******************';
// cognito application client ユーザー登録用
const AWS_COGNITO_USER_POOL_CLIENT_C_ID = '******************';
// cognito 認証情報取得用キー
const AWS_COGNITO_LOGINS_KEY = 'cognito-idp.' + AWS_CONFIG_REGION + '.amazonaws.com/' + AWS_COGNITO_USER_POOL_ID;


