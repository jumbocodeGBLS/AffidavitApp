angular.module('myapp').controller('clientviewCtrl', ['$scope', '$state', 'AuthenticationService', 
  function ($scope, $state, AuthenticationService) {
  var j = jQuery.noConflict();
  j(document).ready(function(){
    j("#myCarousel").carousel({interval: false});
  });

  // sets classes of yes/no buttons depending on current click / click history
  function setyes() {
      var j = jQuery.noConflict();
      j('#b1').removeClass('unclicked');
      j('#b1').addClass('clicked');
      j('#b2').removeClass('clicked');
      j('#b2').addClass('unclicked');
  }
  function setno() {
      var j = jQuery.noConflict();
      j('#b2').removeClass('unclicked');
      j('#b2').addClass('clicked');
      j('#b1').removeClass('clicked');
      j('#b1').addClass('unclicked');
  }
  function setunclicked() {
      var j = jQuery.noConflict();
      j('#b2').removeClass('clicked');
      j('#b2').addClass('unclicked');
      j('#b1').removeClass('clicked');
      j('#b1').addClass('unclicked');
  }
  function setrecording() {
      var j = jQuery.noConflict();
      j('#b3').removeClass('unclicked');
      j('#b3').addClass('clicked');
      j('#b4').removeClass('clicked');
      j('#b4').addClass('unclicked');
  }
  function setpaused() {
      var j = jQuery.noConflict();
      j('#b3').removeClass('clicked');
      j('#b3').addClass('unclicked');
      j('#b4').removeClass('unclicked');
      j('#b4').addClass('clicked');
  }
  function setstart() {
      var j = jQuery.noConflict();
      j('#b3').removeClass('clicked');
      j('#b3').addClass('unclicked');
      j('#b4').removeClass('clicked');
      j('#b4').addClass('unclicked');
  }

  // TRANSCRIPTION STUFF
  $scope.result = "";
  $scope.start = function() {
    $scope.recording = true;
    $scope.startDictation();
  };
  $scope.startDictation = function() {
    if (!$scope.recording) {
      return;
    }
    if (window.hasOwnProperty('webkitSpeechRecognition')) {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      if ($scope.user.language == "English")
        recognition.lang = "en-US";
      else
        recognition.lang = "es-MX";
      recognition.start();
      recognition.onresult = function(e) {
        $scope.result += e.results[0][0].transcript;
        recognition.stop();
        console.log($scope.result);
        if ($scope.recording)
          $scope.startDictation();
        else
          $scope.videos[$scope.curIndex].response = $scope.result;
      };
      recognition.onerror = function(e) {
        console.log("error");
        recognition.stop();
      }
    }
    setrecording();
  };
  $scope.stopDictation = function() {
    $scope.recording = false;
    setpaused();
  };

  $scope.setbuttons = function() {
      // set whether or not next button is hidden, and classes of true/false buttons
      if ($scope.videos[$scope.curIndex]['yesno'] == true) {
          if ($scope.videos[$scope.curIndex]['response'] === "") {
              //document.getElementById('next').hidden = true;
              setunclicked();
          } else {
              //document.getElementById('next').hidden = false;
              if ($scope.videos[$scope.curIndex]['response'] == true) {
                  setyes();
              } else {
                  setno();
              }
          }
      } else {
          //document.getElementById('next').hidden = false;
          setstart();
      }
  };

  // set buttons based on whether it's a yes or no question
  $scope.yesno = function() {
    if ($scope.curIndex < $scope.videos.length)
      return $scope.videos[$scope.curIndex]['yesno'];
    else
      return true;
  };

  // view next video
  $scope.next_vid = function(){
      if ($scope.curIndex >= $scope.videos.length - 1) {
        //return;
        $scope.lastpage = true;
        return;
      }
      if($scope.videos[$scope.curIndex].yesno == true &&
         $scope.videos[$scope.curIndex]['response'] == true){
          $scope.curIndex = $scope.dependencies[$scope.curIndex]['yesJump'];
      } else {
          $scope.curIndex = $scope.dependencies[$scope.curIndex]['noJump'];
      }
      $scope.curvid = $scope.videos[$scope.curIndex]['url'];
      $scope.setbuttons();
  };

  // when 'yes' clicked on yes/no question
  $scope.yes = function() {
      $scope.videos[$scope.curIndex]['response'] = true;
      //document.getElementById('next').hidden = false;
      setyes();
  };

  // when 'no' clicked on yes/no question
  $scope.no = function() {
      $scope.videos[$scope.curIndex]['response'] = false;
      //document.getElementById('next').hidden = false;
      setno();
  };

  $scope.submit = function() {
      $state.go('history');
  };

  /********************** SCOPE DATA ****************************/
  $scope.curIndex = 0;
  
  $scope.user = {
        'type' : 0, 
        'viewee': []
  };

  AuthenticationService.getUser(function(res){
    if (res != "") {
      console.log(res.password.email);
      var j = jQuery.noConflict();
      j.ajax({
        method: "GET",
        url: '/userData',
        data: {data: res.password.email} 
      })
      .done(function(msg) {
        $scope.user = msg[0];
        console.log($scope.user);
        if ($scope.user.type == "client") {
            $scope.user.type = 1;
        } else if ($scope.user.type == "lawyer") {
            $scope.user.type = 2;
        } else if ($scope.user.type == "admin") {
            $scope.user.type = 8;
        } else {
            $scope.user.type = 4;
        }
        $scope.$apply();
      });
    }
  });

  $scope.videos = videos;
  $scope.dependencies = dependencies;
  $scope.curvid = $scope.videos[$scope.curIndex]['url'];
  //document.getElementById('next').hidden = true;
  $scope.progress=0;
  //$scope.saveplace();
  console.log($scope.videos, $scope.dependencies);

}]);

myapp.filter("trustUrl", ['$sce', function($sce){
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);





















