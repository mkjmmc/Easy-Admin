// 加载
app.controller('LoadingController', function ($scope, $resource, $state, $localStorage, rest_access) {

    if (!$localStorage.user) {
        $state.go('access.signin');
        return;
    }
    // get user info
    rest_access.get().then(function (data) {
        switch (data.result) {
            case 0:
                $scope.session_user = data.data;
                $localStorage.user = data.data;
                $state.go('app.projects');
                break;
            default :
                $state.go('access.signin');
                break;
        }
    }, function () {
        $state.go('access.signin');
    });
});
// 登录
app.controller('SigninFormController', function ($scope, $state, $stateParams, $http,$location, $resource, Base64, $localStorage, md5, rest_access) {
    $scope.user = {};
    $scope.email = $stateParams.email;
    $scope.url = $stateParams.url;
    if ($stateParams.email) {
        $scope.user.email = $stateParams.email;
    }
    $scope.login = function () {
        // 对密码进行md5加密
        var password = md5.createHash($scope.user.password || '');
        $scope.authError = "";
        rest_access
            .signin({username: $scope.user.email, password: password})
            .then(function (data) {
                switch (data.result) {
                    case 0:
                        // 登录成功处理
                        var user = data.data;
                        $scope.session_user = user;
                        $localStorage.user = user;
                        $localStorage.auth = user.LoginKey;
                        $http.defaults.headers.common['Authorization'] = $localStorage.auth;
                        if ($stateParams.url && $stateParams.url.length > 0) {
                            $location.url($stateParams.url);
                        }
                        else {
                            $state.go('app.projects');
                        }
                        break;
                    default:
                        // 异常处理
                        $scope.authError = data.message;
                        break;
                }
            }, function () {
                $scope.authError = "服务器登录错误"
            });
    }
});

// 注册
app.controller('SignupFormController', function ($scope, $http, $state,$stateParams, $resource, Base64, $localStorage, md5, $timeout, rest_access) {
    $scope.user = {};

    $scope.email = $stateParams.email;
    $scope.url = $stateParams.url;

    $scope.user.email = $scope.email;
    $scope.authError = null;

    $scope.checkcodetime = 0;

    $scope.signup = function () {

        //alert('内测阶段，注册暂时不可用')
        //return;

        //if ($scope.user.password != $scope.user.password1) {
        //    $scope.authError = "两次密码输入不一致";
        //    return;
        //}

        // 对密码进行md5加密
        var password = md5.createHash($scope.user.password || '');
        $scope.authError = "";
        rest_access
            .signup({name: $scope.user.name, email: $scope.user.email, password: password})
            .then(function (data) {
                switch (data.result) {
                    case 0:
                        // 登录成功处理
                        //var user = data.data;
                        //$scope.session_user = user;
                        //$localStorage.user = user;
                        //$localStorage.auth = user.Token;
                        //$http.defaults.headers.common['Authorization'] = $localStorage.auth;
                        $state.go('access.signin', {email:$scope.email, url:$scope.url});
                        break;
                    default:
                        // 异常处理
                        $scope.authError = data.message;
                        break;
                }
            });
    };
});
// 修改密码
app.controller('ChangePasswordController', function ($scope, $http, $state, $resource, Base64, $localStorage, md5) {
    $scope.user = {};
    $scope.authError = null;
    $scope.submit = function () {
        // 对密码进行md5加密
        var oldpassword = md5.createHash($scope.user.OldPassword || '');
        var newpassword = md5.createHash($scope.user.NewPassword || '');
        $scope.authError = "";
        var $com = $resource($scope.app.resource.changepassword);
        $com.save({OldPassword: oldpassword, NewPassword: newpassword}, function (data) {
            switch (data.Code) {
                case 0:
                    // 修改成功处理
                    $state.go('app.dashboard');
                    break;
                default:
                    // 异常处理
                    $scope.authError = data.message;
                    break;
            }
        }, function () {
            $scope.authError = "服务器登录错误"
        });
    };
});

// 邀请
app.controller('InviteController', function ($scope, $state, $stateParams, $location,$localStorage, rest_access) {

    var code = $stateParams.code;
    var email = $stateParams.email;
    var t = $stateParams.t;

    // 验证邀请码
    $scope.errormessage = '';
    if (!code || !email) {
        $scope.errormessage = '邀请码错误';
        $state.go('access.loading');
    }
    // 判断本地是否登录
    if (!$localStorage.user) {
        $state.go('access.signin', {email: email, url: $location.url()});
        return;
    }
    // 判断登录账号是否同一个
    if($localStorage.user.Email != email){
        $state.go('access.signin', {email: email, url: $location.url()});
        return;
    }
    // 验证邀请码
    rest_access
        .invite(code, email)
        .then(function (data) {
            if(data.result == 0){
                // 验证通过
                $state.go('app.projects')
                return;
            }
            else{
                alert(data.message);
            }
        }, function (resp) {
            alert(resp)
        })
});
app.factory('Base64', function () {
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
})