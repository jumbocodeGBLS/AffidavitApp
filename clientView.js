
var j = jQuery.noConflict();
j(document).ready(function(){
	j("#myCarousel").carousel({interval: false});
    j(document).on( "click", ".answer", function () {
    	j(this).css("background", "#348017");
    	j(this).siblings('.answer').css("background", "#64E986");
    	useranswer[this.getAttribute("name")[8]] = parseInt(this.getAttribute("value"));
    });
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



var app = angular.module('videos', []);
app.controller('videoCtrl', function($scope, $http) {


        /********************** NAV STUFF ****************************/
        $scope.user = {
            'id': 1,
            'name': 'James',
            'type' : 3, // 1 is client, 2 is lawyer, 3 is administrator
            'canView': [1] // list of user ids which this user can view (including their own)
        }
        if ($scope.user['type'] == 1) {
            document.getElementById('options').innerHTML +=
                '<li><a href="history.html">History</a></li>';
        } else if ($scope.user['type'] == 2) {
            document.getElementById('options').innerHTML +=
                '<li><a href="clientlist.html">Client List</a></li>';
        } else if ($scope.user['type'] == 3) {
            document.getElementById('options').innerHTML +=
                '<li><a href="clientlist.html">Client List</a></li>' + 
                '<li><a href="admin.html">Admin Home</a></li>';
        }
        /********************* NAV STUFF END *************************/

        /******************* SCOPE FUNCTIONS *************************/

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

        // returns number of 'showable' videos
        $scope.videoLength = function(){
            numVids = 0;
            for(i = 0; i < $scope.videos.length; i++){
                if($scope.videos[i].show == true){
                    numVids++;
                }
            }
            return numVids;
        };

        // view next video
        $scope.next_vid = function(){
            // set next videos' showing to true or false based on response dependencies
            if($scope.videos[$scope.curIndex].yesno == true){
                if($scope.response == true){
                    for(i = 0; i < $scope.videos[$scope.curIndex].yesRemoves.length; i++){
                        indexRemove = $scope.videos[$scope.curIndex].yesRemoves[i];
                        $scope.videos[indexRemove].show = false;
                    } 
                }
                if($scope.response == false){
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
                console.log("TODO");
            }
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
                console.log("TODO");
            }
        };

        // when 'yes' clicked on yes/no question
        $scope.yes = function() {
            $scope.response = true;
            $scope.videos[$scope.curIndex]['response'] = true;
            document.getElementById('next').hidden = false;
            setyes();
        };

        // when 'no' clicked on yes/no question
        $scope.no = function() {
            $scope.response = false;
            $scope.videos[$scope.curIndex]['response'] = false;
            document.getElementById('next').hidden = false;
            setno();
        };

        /********************** SCOPE DATA ****************************/
        $scope.response = false;
        $scope.curIndex = 0;
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
                yesno: true,
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
});
app.filter("trustUrl", ['$sce', function($sce){
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);

