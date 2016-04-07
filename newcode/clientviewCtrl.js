var mediaRecorder;
function startRecording(){
  var mediaConstraints = {
      audio: true
  };

  navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

  function onMediaSuccess(stream) {
      mediaRecorder = new MediaStreamRecorder(stream);
      mediaRecorder.mimeType = 'audio/ogg';
      mediaRecorder.audioChannels = 1;
      mediaRecorder.ondataavailable = function (blob) {
          // POST/PUT "Blob" using FormData/XHR2
          var blobURL = URL.createObjectURL(blob);
          console.log("blob", blobURL);
          // document.write('<a href="' + blobURL + '">' + blobURL + '</a>');
      };
      mediaRecorder.start(3000);
  }

  function onMediaError(e) {
      console.error('media error', e);
  }
}

function stopRecording(){
  mediaRecorder.stop();
  console.log("STOPPED", mediaRecorder);
}

// function startRecording(){
//   navigator.getUserMedia({audio: true}, onMediaSuccess, onMediaError);

//   console.log("START", mediaRecorder);
//   mediaRecorder.start(30000000);
// }
// function stopRecording(){
//   mediaRecorder.stop();
//   mediaRecorder.ondataavailable = function (blob) {
//         // POST/PUT "Blob" using FormData/XHR2
//         var blobURL = URL.createObjectURL(blob);
//         console.log(blobURL);
//     };
// }

// function onMediaError(e) {
//     console.error('media error', e);
// }


myapp.controller('clientviewCtrl', function($scope, $http) {
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
      // mediaRecorder.start();

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
        mediaRecorder.stop();
      }
    }
  };
  $scope.stopDictation = function() {
    $scope.recording = false;
  };
  // $scope.startAudioRecording = function()
  // {
  //   console.log("START TRIG");
  //   navigator.getUserMedia(session, function (MediaStream) {
  //       window.recordRTC = RecordRTC(MediaStream);
  //       recordRTC.startRecording();
  //   }, function(error){console.log(error)});
  // };

  // $scope.stopAudioRecording = function()
  // { 
  //   console.log("STOP TRIG");
  //   navigator.getUserMedia({audio: true}, function(MediaStream) {
  //       window.recordRTC = RecordRTC(MediaStream);
  //       recordRTC.startRecording();
  //   });
  // };

  // returns true if we're on the first page, false otherwise
  $scope.firstpage = function(){
      i = $scope.curIndex;
      i--;
      while(i > -1 && $scope.videos[i].show == false){
          i--;
      }
      if (i == -1){
          return true;
      }
      else {
          return false;
      }
  };

  // returns true if we're on the last page, false otherwise
  $scope.lastpage = function(){
      i = $scope.curIndex;
      i++;
      while(i < $scope.videos.length && $scope.videos[i].show == false){
          i++;
      }
      if (i == $scope.videos.length){
          return true;
      }
      else {
          return false;
      }
  };

  // returns progress as a percentage
  $scope.getprogress = function(){
      var numVids = 0;
      var numAnswers = 0;
      for(i = 0; i < $scope.videos.length; i++){
          if($scope.videos[i].show == true){
              numVids++;
              if ($scope.videos[i].response === ""){
              } else {
                numAnswers++;
              }
          }
      }
      return (numAnswers/numVids)*100;
  };

  $scope.setbuttons = function() {
      // set whether or not next button is hidden, and classes of true/false buttons
      if ($scope.videos[$scope.curIndex]['yesno'] == true) {
          if ($scope.videos[$scope.curIndex]['response'] === "") {
              document.getElementById('next').hidden = true;
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
    return $scope.videos[$scope.curIndex]['yesno'];
  };

  // view next video
  $scope.next_vid = function(){
      // set next videos' showing to true or false based on response dependencies
      if($scope.videos[$scope.curIndex].yesno == true){
          if($scope.videos[$scope.curIndex]['response'] == true){
              for(i = 0; i < $scope.videos[$scope.curIndex].yesRemoves.length; i++){
                  indexRemove = $scope.videos[$scope.curIndex].yesRemoves[i];
                  $scope.videos[indexRemove].show = false;
              } 
          }
          if($scope.videos[$scope.curIndex]['response'] == false){
              for(i = 0; i < $scope.videos[$scope.curIndex].noRemoves.length; i++){
                  indexRemove = $scope.videos[$scope.curIndex].noRemoves[i];
                  $scope.videos[indexRemove].show = false;
              } 
          }
      }

      // find index of next video
      $scope.curIndex = $scope.curIndex +1;
      while($scope.videos[$scope.curIndex].show != true &&
            $scope.curIndex < $scope.videos.length-1){
          $scope.curIndex = $scope.curIndex +1;    
      }
      $scope.curvid = $scope.videos[$scope.curIndex]['url'];
      $scope.setbuttons();
      $scope.progress=$scope.getprogress();
  };

  // view previous video
  $scope.prev_vid = function(){
      // find index of prev video
      $scope.curIndex = $scope.curIndex - 1;
      while($scope.videos[$scope.curIndex].show != true &&
            $scope.curIndex >= 0){
          $scope.curIndex = $scope.curIndex - 1;    
      }
      $scope.curvid = $scope.videos[$scope.curIndex]['url'];
      $scope.setbuttons();
      $scope.progress=$scope.getprogress();
  };

  // when 'yes' clicked on yes/no question
  $scope.yes = function() {
      $scope.videos[$scope.curIndex]['response'] = true;
      document.getElementById('next').hidden = false;
      setyes();
  };

  // when 'no' clicked on yes/no question
  $scope.no = function() {
      $scope.videos[$scope.curIndex]['response'] = false;
      document.getElementById('next').hidden = false;
      setno();
  };

  // goes to first unanswered question
  $scope.saveplace = function() {
      while ($scope.curIndex < $scope.videos.length) {
          if ($scope.videos[$scope.curIndex].show == true &&
              $scope.videos[$scope.curIndex].response === "") {
              break;
          }
          $scope.curIndex = $scope.curIndex + 1;
      }
      if ($scope.curIndex == $scope.videos.length) {
          $scope.curIndex = 0;
      }
      $scope.curvid = $scope.videos[$scope.curIndex]['url'];
      $scope.setbuttons();
      $scope.progress=$scope.getprogress();
  };




  /********************** SCOPE DATA ****************************/
  $scope.curIndex = 0;
  $scope.user = {
        'id': 1,
        'fname': 'James',
        'lname': 'Smith',
        'uname': 'JSmith01',
        'language': 'English',
        'type' : 15, 
        'clients': [2,3,4]
  };
  $scope.videos = [
      {   
          url:"https://www.youtube.com/embed/G3pmJeZGcwA",
          yesno: true,
          yesRemoves: [],
          noRemoves: [],
          show: true,
          response: ""
      },
      {   
          url:"https://www.youtube.com/embed/nFAK8Vj62WM",
          yesno: false,
          // list of videos it removes (by index)
          yesRemoves: [],
          noRemoves: [],
          show: true,
          response: ""
      },
      {   
          url:"https://www.youtube.com/embed/YtIPmVN6zdc",
          yesno: true,
          yesRemoves: [3],
          noRemoves: [4],
          show: true,
          response: ""
      },
      {   
          url:"https://www.youtube.com/embed/ZhSSLZpl-Vg",
          yesno: true,
          yesRemoves: [],
          noRemoves: [],
          show: true,
          response: ""
      },
      {   
          url:"https://www.youtube.com/embed/dTnKYgyCD8A",
          yesno: true,
          yesRemoves: [],
          noRemoves: [],
          show: true,
          response: ""
      }
  ];
  $scope.curvid = $scope.videos[$scope.curIndex]['url'];
  document.getElementById('next').hidden = true;
  $scope.progress=0;
  $scope.saveplace();
});

myapp.filter("trustUrl", ['$sce', function($sce){
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);