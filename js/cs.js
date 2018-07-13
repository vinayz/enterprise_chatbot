var app = angular.module('empappChatApp', []);
app.controller('empappChatCtrl', function($scope, $http, $compile, $window) {
    // var nodeServerUrl = "http://botuat.maxlifeinsurance.com/postdata";
    var nodeServerUrl = "http://10.1.255.255:3000/postdata" ;
    var botAvatar = "img/bot-icon-white.png";
    var userAvatar = "img/user-icon.png";
    var botTypingLoader = "img/chat_dots.gif";
    $scope.scrollArr =[];

    //Generate here a random string
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    for (var i = 0; i < 9; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    var randomString = text;

    var sendOnLoadText;

//On load display default msg**************************************************************************************Start
    (function() {
        $window.sessionStorage.setItem("pinCode", "false");   //for locate us
        sendOnLoadText ="hi";
        var sendData = {query: sendOnLoadText, randomString: randomString,  botName: "CS"};
        console.log(sendOnLoadText)
        $http({
            method: 'POST',
            url: nodeServerUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: sendData,
        }).then(function successCallback(response) {
            if (response && response.data && response.data.result && response.data.result.fulfillment) {
                var botResponse = response.data.result.fulfillment.speech;

                var botElemeent =
                    '<li class="other">' +
                    '<div class="avatarbox">' +
                    '<div class="avatar">' +
                    '<img src="img/bot-icon-white.png" alt="bot-icon">' +
                    '</div>' +
                    '</div>' +
                    '<div class="msg cardbox">' +
                    '<p style="border-radius:3px 10px 10px 10px">' + botResponse + '</p>' +
                    '<div class="card-wrap clearfix">'+
                    '</div>'+
                    '</div>' +
                    '</li>'+
                    '<ul class="list-inline tags">' +
                    '</ul>';
                angular.element(document.getElementById('chatResponseBox')).append($compile(botElemeent)($scope));
                $scope.scrollArr.push(botResponse);
            }
            else {

            }
            if (response && response.data && response.data.result && response.data.result.fulfillment && response.data.result.fulfillment.data
                && response.data.result.fulfillment.data.facebook && response.data.result.fulfillment.data.facebook.buttons) {
                var botResBtn = response.data.result.fulfillment.data.facebook.buttons;
                for (var i = 0; i < botResBtn.length; i++) {
                    var buttonsElem =   '<li>' +
                        `<a ng-click="clickThisBtn($event)" data-value="${botResBtn[i].postback}">` +
                        botResBtn[i].text +
                        '</a>' +
                        '</li>';
                    angular.element(document.getElementsByClassName('tags')).append($compile(buttonsElem)($scope));
                }
            }
        }, function errorCallback(response) {

        });
    })();
//On load display default msg****************************************************************************************End

//Send text msg****************************************************************************************************Start
    $scope.sendChatData= function(buttonText, postBack){
        var chatText = $scope.inputText;
        var userText;
        if(!chatText){
            userText = buttonText;
        }
       else{
            userText = chatText;
       }
        if(userText) {
            var userElemeent =    '<li class="self">'+
                '<div class="msg">'+
                '<p>'+userText+
                '</p>'+
                '</div>'+
                '</li>';
                if(postBack){
                  userText = postBack;
                }

            angular.element(document.getElementById('chatResponseBox')).append($compile(userElemeent)($scope));
            $scope.inputText = "";
            $scope.scrollArr.push(userText);

            var botImage = document.getElementsByClassName('botTypingLoader');
            if(botImage.length >0) {
                var botImageLen = botImage.length - 1;
                botImage[botImageLen].style.display = "none";
            }
            var botElemeent =   '<li class="other botTypingLoader" style="display: inline-flex">'+
                                '<div class="avatar">'+
                                '<img src="img/bot-icon-white.png" alt="bot-icon">'+
                                '</div>'+
                                '<div class="msg bot botGif">'+
                                '<img class="botTyping" src="img/chat_dots.gif" alt="typing-loader">'+
                                '</div>'+
                                '</li>';
            angular.element(document.getElementById('chatResponseBox')).append($compile(botElemeent)($scope));
            $scope.scrollArr.push(botTypingLoader);

            var btnArr = ["premiumdue", "maturity and term", "policypack", "Fundvalue", "csv", "ppt", "premiumreceipt", "locateus", "LoanInquiry", "UpdatePersonalDetails", "pay online", "direct debit", "credit", "other procedure", "loanegigibilitydetails", "outstandingloandetials", "UpdateMobile", "UpdateEmail", "UpdateAadhaar"]
            if(btnArr.indexOf(userText) > -1){
              $window.sessionStorage.setItem("customerExp", "no");
            }
            //for pin code
            var pinCodeStatus = $window.sessionStorage.getItem("pinCode");
            if(pinCodeStatus == "pinCode"){
              userText = "pincode for finding location "+ userText;
            }
            //for customerexperience
            var customerExp = $window.sessionStorage.getItem("customerExp");
              if(customerExp == "yes"){
                userText = "customerexperience "+ userText;
              }
              //for smiley Frowney yes/no user text
              var smileyFrowney = $window.sessionStorage.getItem("smileyFrowney");
                if(smileyFrowney == "smileyFrowney"){
                  userText = "chat"+userText;
                }

                var dob = $window.sessionStorage.getItem("dob");
                  if(dob == "dob"){
                    userText = "clientdob "+userText;
                  }
                var mobile = $window.sessionStorage.getItem("mobile");
                  if(mobile == "yes"){
                    userText = "mobile "+userText;
                  }
                var email = $window.sessionStorage.getItem("email");
                  if(email == "yes"){
                    userText = "email "+userText;
                  }

            var sendData = {query: userText, randomString: randomString,  botName: "CS"};
            $http({
                method: 'POST',
                url: nodeServerUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: sendData,
              //  timeout:5000,
            }).then(function successCallback(response) {
                if (response && response.data && response.data.result && response.data.result.fulfillment && response.data.result.fulfillment.speech) {
                    var botResponse = response.data.result.fulfillment.speech;
                    var botText;
                    console.log(response);
                    // if(botResponse =="Looks like the entered mobile number is incorrect, request you to enter correct mobile number."){
                    //   $window.sessionStorage.setItem("mobile", "yes");
                    // }
                    if(botResponse =="Please enter 10 digits mobile number you wish to register with your Max Life policy."){
                      $window.sessionStorage.setItem("mobile", "yes");
                    }
                    else{
                      $window.sessionStorage.setItem("mobile", "no");
                    }
                    if(botResponse =="Please enter the email id you wish to register with your Max Life policy."){
                      $window.sessionStorage.setItem("email", "yes");
                    }
                    else{
                      $window.sessionStorage.setItem("email", "no");
                    }
                       if(botResponse =="Please share your experience."){
                         var btnArr = ["premiumdue", "maturity and term", "policypack", "Fundvalue", "csv", "ppt", "premiumreceipt", "locateus", "LoanInquiry", "UpdatePersonalDetails", "pay online", "direct debit", "credit", "other procedure", "loanegigibilitydetails", "outstandingloandetials", "UpdateMobile", "UpdateEmail", "UpdateAadhaar"]
                         $window.sessionStorage.setItem("customerExp", "yes");
                       }
                       else{
                         $window.sessionStorage.setItem("customerExp", "no");
                       }
                       if(botResponse =="Please enter 6 digit pin code to help you with the nearest Max Life office."){
                         $window.sessionStorage.setItem("pinCode", "pinCode");
                       }
                       else if(botResponse.split(",")[0] =="Looks like you have entered incorrect PIN code"){
                         $window.sessionStorage.setItem("pinCode", "pinCode");
                       }
                       else{
                         $window.sessionStorage.setItem("pinCode", "false");
                       }
                       if(botResponse.split("-")[0] ==" Please enter policy holder's date of birth in DD"){
                         $window.sessionStorage.setItem("dob", "dob");
                       }
                       else if(botResponse.split(",")[0] =="No policy found matching the entered details"){
                         $window.sessionStorage.setItem("dob", "dob");
                       }
                       else{
                         $window.sessionStorage.setItem("dob", "false");
                       }

                       if(botResponse =="Thank you for contacting Max Life. Was the chat helpful to you?(Yes/No)"){
                         $window.sessionStorage.setItem("smileyFrowney", "smileyFrowney");
                         botText =     '<li class="other">' +
                                       '<div class="avatarbox">' +
                                       '<div class="avatar">' +
                                       '<img src="img/bot-icon-white.png" alt="bot-icon">' +
                                       '</div>' +
                                       '</div>' +
                                       '<div class="msg cardbox">' +
                                       '<p class="botResponse">' + botResponse + '</p>' +
                                       '<div class="card-wrap clearfix">'+
                                       '<img ng-click="sendYesNo($event)" class="smiley" src="img/smiley.png" alt="bot-icon">' +
                                       '<img ng-click="sendYesNo($event)" class="frowney" src="img/frowny.png" alt="bot-icon">' +
                                       '</div>'+
                                       '</div>' +
                                       '</li>'+
                                       '<ul class="list-inline tags">' +
                                       '</ul>';
                       }
                       else{
                         $window.sessionStorage.setItem("smileyFrowney", "false");
                          botText =    '<li class="other">' +
                                       '<div class="avatarbox">' +
                                       '<div class="avatar">' +
                                       '<img src="img/bot-icon-white.png" alt="bot-icon">' +
                                       '</div>' +
                                       '</div>' +
                                       '<div class="msg cardbox">' +
                                       '<p class="botResponse">' + botResponse + '</p>' +
                                       '<div class="card-wrap clearfix">'+
                                       '</div>'+
                                       '</div>' +
                                       '</li>'+
                                       '<ul class="list-inline tags">' +
                                       '</ul>';
                       }


                    angular.element(document.getElementById('chatResponseBox')).append($compile(botText)($scope));
                    $scope.scrollArr.push(botResponse);
                    var imageClass = document.getElementsByClassName('botTypingLoader');
                    var imageClassLen = imageClass.length -1;
                    imageClass[imageClassLen].style.display = "none";
                }
                else{

                }

                if (response && response.data && response.data.result && response.data.result.fulfillment && response.data.result.fulfillment.data
                    && response.data.result.fulfillment.data.facebook && response.data.result.fulfillment.data.facebook.buttons) {
                    var botResBtn = response.data.result.fulfillment.data.facebook.buttons;
                    var buttonsElem;
                    for (var i = 0; i < botResBtn.length; i++) {
                             buttonsElem =   '<li>' +
                                              `<a ng-click="clickThisBtn($event)" data-value="${botResBtn[i].postback}">` +
                                              botResBtn[i].text +
                                              '</a>' +
                                              '</li>';
                          var btnClass = document.getElementsByClassName('tags');
                          var btnClassLen = btnClass.length -1;

                        angular.element(document.getElementsByClassName('tags')[btnClassLen]).append($compile(buttonsElem)($scope));
                    }
                }
            }, function errorCallback(response) {

            });
        }
    };
//Send text msg******************************************************************************************************End

//Click channel btn************************************************************************************************Start
    $scope.clickThisBtn = function (event) {
        var buttonData = event.currentTarget;
        var postBack =  buttonData.attributes['data-value'].value;
        var buttonText = angular.element(buttonData).text();
        return $scope.sendChatData(buttonText, postBack);
    };
//Click channel btn**************************************************************************************************End

//Yes/No text function*********************************************************************************************START

$scope.sendYesNo = function (event) {
  var userElemeent;
  if(event.target.attributes["class"].value =="smiley"){
 userElemeent =    '<li class="self">'+
        '<div class="msg">'+
        '<img src="img/smiley.png" alt="bot-icon">' +
        '</div>'+
        '</li>';
        userText= "chatyes";
  }
  else{
    userElemeent =    '<li class="self">'+
           '<div class="msg">'+
           '<img src="img/frowny.png" alt="bot-icon">' +
           '</div>'+
           '</li>';
           userText= "chatno";
     }


  angular.element(document.getElementById('chatResponseBox')).append($compile(userElemeent)($scope));
  $scope.inputText = "";

  var botImage = document.getElementsByClassName('botTypingLoader');
  if(botImage.length >0) {
      var botImageLen = botImage.length - 1;
      botImage[botImageLen].style.display = "none";
  }
  var botElemeent =   '<li class="other botTypingLoader" style="display: inline-flex">'+
                      '<div class="avatar">'+
                      '<img src="img/bot-icon-white.png" alt="bot-icon">'+
                      '</div>'+
                      '<div class="msg bot botGif">'+
                      '<img class="botTyping" src="img/chat_dots.gif" alt="typing-loader">'+
                      '</div>'+
                      '</li>';
  angular.element(document.getElementById('chatResponseBox')).append($compile(botElemeent)($scope));
  $scope.scrollArr.push(botTypingLoader);


  var sendData = {query: userText, randomString: randomString,  botName: "CS"};
  $http({
      method: 'POST',
      url: nodeServerUrl,
      headers: {
          'Content-Type': 'application/json'
      },
      data: sendData,
    //  timeout:5000,
  }).then(function successCallback(response) {
      if (response && response.data && response.data.result && response.data.result.fulfillment && response.data.result.fulfillment.speech) {
          var botResponse = response.data.result.fulfillment.speech;
          var botText;
          if(botResponse =="Please share your experience."){
            $window.sessionStorage.setItem("customerExp", "yes");
          }
          else{
            $window.sessionStorage.setItem("customerExp", "no");
          }
          $window.sessionStorage.setItem("smileyFrowney", "false");

                botText =    '<li class="other">' +
                             '<div class="avatarbox">' +
                             '<div class="avatar">' +
                             '<img src="img/bot-icon-white.png" alt="bot-icon">' +
                             '</div>' +
                             '</div>' +
                             '<div class="msg cardbox">' +
                             '<p class="botResponse">' + botResponse + '</p>' +
                             '<div class="card-wrap clearfix">'+
                             '</div>'+
                             '</div>' +
                             '</li>'+
                             '<ul class="list-inline tags">' +
                             '</ul>';



          angular.element(document.getElementById('chatResponseBox')).append($compile(botText)($scope));
          $scope.scrollArr.push(botResponse);
          var imageClass = document.getElementsByClassName('botTypingLoader');
          var imageClassLen = imageClass.length -1;
          imageClass[imageClassLen].style.display = "none";
      }
      else{

      }

  }, function errorCallback(response) {

  });
};
//Yes/No text function**********************************************************************************************END
});


//Directive to keep scroll bar at bottom***************************************************************************Start
app.directive('schrollBottom', function () {
    return {
        scope: {
            schrollBottom: "="
        },
        link: function (scope, element) {
            scope.$watchCollection('schrollBottom', function (newValue) {
                if (newValue)
                {
                    $(element).scrollTop($(element)[0].scrollHeight);
                }
            });
        }
    }
});
//Directive to keep scroll bar at bottom*****************************************************************************End
