var j = jQuery.noConflict();
j(document).ready(function(){
  navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);

// var record = document.getElementById('b3');
// var stop = document.getElementById('b4');

var audioCtx = new(window.AudioContext || webkitAudioContext)();
var soundClips = j(".sound-clips");
console.log("SOUND", soundClips);
if (navigator.getUserMedia) {
  console.log('YO WE getUserMedia supported.');

  var constraints = {
    audio: true
  };
  var chunks = [];
  console.log("WE MIGHT GET SUCCESS");
  var onSuccess = function(stream) {
    console.log("WE ARE ABOUT TO CLICK");
    var mediaRecorder = new MediaRecorder(stream);

    console.log(j("#b3"));
    // console.log(document.getElementById("b3"));

  j(document).on("click", "#b3", function(){
      console.log("RECORD WAS CLICKED");
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
    });

  j(document).on("click", "#b4", function() {
      console.log("STOP WAS CLICKED");
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
    });

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      var clipName = prompt('Enter a name for your sound clip?', 'My unnamed clip');
      console.log(clipName);
      var clipContainer = document.createElement('article');
      var clipLabel = document.createElement('p');
      var audio = document.createElement('audio');
      var deleteButton = document.createElement('button');

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      if (clipName === null) {
        clipLabel.textContent = 'My unnamed clip';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      var j = jQuery.noConflict();

      console.log("BEFORE APPEND", soundClips);
      sounds = document.getElementById("TRY");
      sounds.appendChild(clipContainer);
      // console.log("NOW SOUND CLIPS TRY");
      // soundClips.appendChild(clipContainer);

      audio.controls = true;
      var blob = new Blob(chunks, {
        'type': 'audio/ogg; codecs=opus'
      });
      chunks = [];
      var audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped");

      deleteButton.onclick = function(e) {
        evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      clipLabel.onclick = function() {
        var existingName = clipLabel.textContent;
        var newClipName = prompt('Enter a new name for your sound clip?');
        if (newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }
  var onError = function(err) {
    console.log('The following error occured: ' + err);
  }
  navigator.getUserMedia(constraints, onSuccess, onError);
} else {
  console.log('getUserMedia not supported on your browser!');
}

});

angular.module('myapp').controller('clientviewCtrl', ['$scope', '$state', 'AuthenticationService', 
  function ($scope, $state, AuthenticationService) {
  var j = jQuery.noConflict();
  j(document).ready(function(){
    j("#myCarousel").carousel({interval: false});
  });
  // calls updateUserProgress to store curIndex in database
  $scope.$on('$stateChangeStart', function( event ) {
    var answer = confirm("Are you sure you want to leave this page?")
    if (!answer) {
        event.preventDefault();
    }
    else {
      console.log("CUR QUESTION", $scope.curIndex);
      saveQuestion = {
            'user_id': $scope.user.user_id,
            'curr_question': $scope.curIndex
        };

        var j = jQuery.noConflict();
        j.post('/updateUserProgress', saveQuestion, function(response, status) {
            console.log("NEW", response, status);
            // deal with results
        });
    }
  });
  // sets classes of yes/no buttons depending on current click / click history
  // $scope.mediaRecorder;
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
        // $scope.mediaRecorder.stop();
        // $scope.mediaRecorder.save();
      }
    }
    // navigator.getUserMedia(
    //   {audio: true},
    //   function(stream) {
    //     $scope.mediaRecorder = new MediaStreamRecorder(stream);
    //     $scope.mediaRecorder.mimeType = 'audio/ogg';
    //     $scope.mediaRecorder.audioChannels = 1;
    //     $scope.mediaRecorder.ondataavailable = function(e) {
    //       // POST/PUT "Blob" using FormData/XHR2
    //       // console.log("Invoking save");
    //       // $scope.mediaRecorder.save();
    //       console.log("e", e);
    //       var audioURL = URL.createObjectURL(e);
    //       // console.log("blob", blob);
    //       console.log("URL", audioURL);
    //       localStorage.setItem("audio", audioURL);
    //       var audio = document.createElement('audio');
    //       audio.src = audioURL;
    //       console.log("TRY TO SAVE YO");
    //       $scope.mediaRecorder.save();
    //       $scope.audioU = localStorage.getItem("audio");
    //       // document.write('<a href="' + blobURL + '">' + blobURL + '</a>');
    //     };
    //     $scope.mediaRecorder.start();
    //     console.log("starting");
    //     console.log("state", $scope.mediaRecorder.state);
    //     console.log("recorder started");},
    //     function errorCallback(e){
    //       console.error('media error', e);
    //     }
    //   );
  };
  // $scope.stopDictation = function() {
  //   $scope.recording = false;
  //   if ($scope.mediaRecorder == undefined){
  //     console.log("uh oh");
  //   }
  //   $scope.mediaRecorder.stop();
  //   console.log("state", $scope.mediaRecorder.state);
  //   // $scope.mediaRecorder.save();
  //   setrecording();
  // };
  $scope.stopDictation = function() {
    $scope.recording = false;
    setpaused();
    // $scope.mediaRecorder.stop();
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
    if (typeof($scope.videos) == "undefined" || typeof($scope.curIndex) == "undefined"){
      return false;
    }
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
        $scope.curIndex = $scope.user.curr_question;
        $scope.videos = videos;
        $scope.dependencies = dependencies;
        $scope.curvid = $scope.videos[$scope.curIndex]['url'];
        $scope.$apply();
      });
    }
  });
  console.log($scope.videos, $scope.dependencies);

}]);

myapp.filter("trustUrl", ['$sce', function($sce){
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);





















