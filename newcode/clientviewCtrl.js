myapp.controller('clientviewCtrl', function($scope, $http, $state) {
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
  };
  $scope.stopDictation = function() {
    $scope.recording = false;
  };

  $scope.setbuttons = function() {
      // set whether or not next button is hidden, and classes of true/false buttons
      if ($scope.videos[$scope.curIndex]['yesno'] == true) {
          if ($scope.videos[$scope.curIndex]['response'] === "") {
              //document.getElementById('next').hidden = true;
              setunclicked();
          } else {
              document.getElementById('next').hidden = false;
              if ($scope.videos[$scope.curIndex]['response'] == true) {
                  setyes();
              } else {
                  setno();
              }
          }
      } else {
          document.getElementById('next').hidden = false;
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
        'id': 1,
        'fname': 'James',
        'lname': 'Smith',
        'uname': 'JSmith01',
        'language': 'English',
        'type' : 14, 
        'clients': [2,3,4]
  };
  $scope.videos = videos;
  $scope.dependencies = dependencies;
  $scope.curvid = $scope.videos[$scope.curIndex]['url'];
  //document.getElementById('next').hidden = true;
  $scope.progress=0;
  //$scope.saveplace();
  console.log($scope.videos, $scope.dependencies);
});

myapp.filter("trustUrl", ['$sce', function($sce){
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);