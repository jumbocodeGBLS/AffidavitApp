
var j = jQuery.noConflict();
j(document).ready(function(){
	console.log("READY");
	j("#myCarousel").carousel({interval: false});
    j(document).on( "click", ".answer", function () {
    	j(this).css("background", "#348017");
    	j(this).siblings('.answer').css("background", "#64E986");
    	useranswer[this.getAttribute("name")[8]] = parseInt(this.getAttribute("value"));
    });
    j("#b1").click(function(){
    	console.log("clicked");
    });
});
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


        $scope.response = false;
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
        $scope.videoLength = function(){
            numVids = 0;
            for(i = 0; i < $scope.videos.length; i++){
                if($scope.videos[i].show == true){
                    numVids++;
                }
            }
            console.log("num", numVids);
            return numVids;
        };
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
        $scope.next_vid = function(){
            $scope.curIndex = $scope.curIndex +1;
            while($scope.videos[$scope.curIndex].show != true){
                $scope.curIndex = $scope.curIndex +1;    
            }
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
            $scope.curvid = $scope.videos[$scope.curIndex]['url'];
        };
        $scope.prev_vid = function(){
            $scope.curIndex = $scope.curIndex - 1;
            while($scope.videos[$scope.curIndex].show != true){
                $scope.curIndex = $scope.curIndex - 1;    
            }
            $scope.curvid = $scope.videos[$scope.curIndex]['url'];
        };
        $scope.curIndex = 0;
        $scope.videos = [
            {   
                url:"https://www.youtube.com/embed/G3pmJeZGcwA",
                yesno: true,
                yesRemoves: [],
                noRemoves: [],
                show: true
            },
            {   
                url:"https://www.youtube.com/embed/nFAK8Vj62WM",
                yesno: false,
                // list of videos it removes (by index)
                yesRemoves: [],
                noRemoves: [],
                show: true
            },
            {   
                url:"https://www.youtube.com/embed/YtIPmVN6zdc",
                yesno: true,
                yesRemoves: [3],
                noRemoves: [4],
                show: true
            },
            {   
                url:"https://www.youtube.com/embed/ZhSSLZpl-Vg",
                yesno: true,
                yesRemoves: [],
                noRemoves: [],
                show: true
            },
            {   
                url:"https://www.youtube.com/embed/dTnKYgyCD8A",
                yesno: false,
                yesRemoves: [],
                noRemoves: [],
                show: true
            }
        ];
        $scope.curvid = $scope.videos[$scope.curIndex]['url'];
        console.log($scope.curvid);

});
app.filter("trustUrl", ['$sce', function($sce){
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);

