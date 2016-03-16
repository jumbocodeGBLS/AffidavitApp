$(document).ready(function(){
	$("#myCarousel").carousel({interval: false});
    $(document).on( "click", ".answer", function () {
    	$(this).css("background", "#348017");
    	$(this).siblings('.answer').css("background", "#64E986");
    	useranswer[this.getAttribute("name")[8]] = parseInt(this.getAttribute("value"));
    });
});
var app = angular.module('ngSongs', []);
app.controller('songs', function($scope, $http) {
		$scope.genquiz = function(i, url) {
				var quiz = document.getElementById('questions');
				var options =  [$scope.pop[i]['name'],
								$scope.pop[i + 1]['name'],
								$scope.pop[i + 2]['name'],
								$scope.pop[i + 3]['name']];
				var answer = $scope.pop[i]['name'];
				options = shuffle(options);

				for (var j = 0; j < options.length; j++) {
					if (options[j] == answer) {
						$scope.answers.push(j);
					}
				}
				if ( i == 0 ) {
					class_item = "class='item active'>";
					autoplay_bool = "autoplay";
				} else {
					class_item = "class='item'>";
					autoplay_bool = "";
				}	
				quiz.innerHTML += "<div "+ class_item + 
								"<div class = 'panel'>" + "<div class='question'><p> What song is this? </p>"
				                + " <video id='myVideo" + i/4 + "' name='media' height= 0px width='auto'"+ autoplay_bool +">" + "<source src='"+url+ "'" +"type='audio/mpeg'>" +
				                "</video> <button type='button' id='"+ i/4 + "' onclick='vid_play_pause(this)'> PAUSE </button>" + "</div>"
  	}
		
		$scope.showresults = function() {
		correct = 0;
		for (var i = 0; i < useranswer.length; i++) {
			if (useranswer[i] == $scope.answers[i]) {
				correct += 1;
			}
		}
		localStorage.setItem('correct', correct);
		$scope.sendResults();
		}
		showresults = $scope.showresults;

		$scope.sendResults = function () {
			var user_id = localStorage.getItem("user_id");
			var request = new XMLHttpRequest();
			var url = ??;

			request.open('POST', url, true);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			request.onreadystatechange = function () {
				if (request.readyState == 4 && request.status == 200) {
					window.location = "clientView.html"
				}
			}
			var params = "user_id=" + login + "&score_pop=" + score_pop + "&score_rock="+ score_rock +"&score_jazz=" + score_jazz + "&score_country=" + score_country+"&player_id="+player_id;
			request.send(params);
		}
		
  	$scope.contactServer = function () {
		var request = new XMLHttpRequest();
		var url = "https://musiquiz.herokuapp.com/quizInfo?";
		var params = "genre="+localStorage.getItem('genre');
		request.open('GET', url+params, true);

		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		request.onreadystatechange = function () {
			if (request.readyState == 4 && request.status == 200) {
				var response = request.responseText;
				parsed_objects = JSON.parse(response);
				$scope.pop = parsed_objects;
				$scope.pop = shuffle($scope.pop);
				$scope.numquestions = ($scope.pop.length > 40) ? 10 : ($scope.pop.length/4);
				useranswer = [];
  		   		$scope.answers = [];
  		   		page_no = 0;
  		   		quest_no = 0;
  		   		$scope.contactSpotifyServerCHECK();
			}
		}
		request.send(params);
	}

	$scope.contactSpotifyServerCHECK = function() {
				var requests = [new XMLHttpRequest(), new XMLHttpRequest(), new XMLHttpRequest(),
								new XMLHttpRequest(), new XMLHttpRequest(), new XMLHttpRequest(),
								new XMLHttpRequest(), new XMLHttpRequest(), new XMLHttpRequest(),
								new XMLHttpRequest(), new XMLHttpRequest(), new XMLHttpRequest()];
			var urls = ["https://api.spotify.com/v1/tracks/"+$scope.pop[0]['id'],
						"https://api.spotify.com/v1/tracks/"+$scope.pop[4]['id'],
						"https://api.spotify.com/v1/tracks/"+$scope.pop[8]['id'],
						"https://api.spotify.com/v1/tracks/"+$scope.pop[12]['id'],
						"https://api.spotify.com/v1/tracks/"+$scope.pop[16]['id'],
						"https://api.spotify.com/v1/tracks/"+$scope.pop[20]['id'],
						"https://api.spotify.com/v1/tracks/"+$scope.pop[24]['id'],
						"https://api.spotify.com/v1/tracks/"+$scope.pop[28]['id'],
						"https://api.spotify.com/v1/tracks/"+$scope.pop[32]['id'],
						"https://api.spotify.com/v1/tracks/"+$scope.pop[36]['id'],
						"https://api.spotify.com/v1/tracks/"+$scope.pop[40]['id'],
						"https://api.spotify.com/v1/tracks/"+$scope.pop[44]['id']];
			for (RI = 0; RI < 12; RI++) {
				requests[RI].open('GET', urls[RI], true);
				requests[RI].setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			}
			requests[0].onreadystatechange = function () {
				if (requests[0].readyState == 4 && requests[0].status == 200) {
					var response = requests[0].responseText;
					var parsed_objects = JSON.parse(response);
					preview_url = parsed_objects["preview_url"];
					if (preview_url) {
						quest_no++
						$scope.genquiz(0, preview_url);
					}
					requests[1].send();
				}
			}
			requests[1].onreadystatechange = function () {
				if (requests[1].readyState == 4 && requests[1].status == 200) {
					var response = requests[1].responseText;
					var parsed_objects = JSON.parse(response);
					preview_url = parsed_objects["preview_url"];
					if (preview_url) {
						quest_no++
						$scope.genquiz(4, preview_url);
					}
					requests[2].send();
				}
			}
			requests[2].onreadystatechange = function () {
				if (requests[2].readyState == 4 && requests[2].status == 200) {
					var response = requests[2].responseText;
					var parsed_objects = JSON.parse(response);
					preview_url = parsed_objects["preview_url"];
					if (preview_url) {
						quest_no++
						$scope.genquiz(8, preview_url);
					}
					requests[3].send();
				}
			}
			requests[3].onreadystatechange = function () {
				if (requests[3].readyState == 4 && requests[3].status == 200) {
					var response = requests[3].responseText;
					var parsed_objects = JSON.parse(response);
					preview_url = parsed_objects["preview_url"];
					if (preview_url) {
						quest_no++
						$scope.genquiz(12, preview_url);
					}
					requests[4].send();
				}
			}
			requests[4].onreadystatechange = function () {
				if (requests[4].readyState == 4 && requests[4].status == 200) {
					var response = requests[4].responseText;
					var parsed_objects = JSON.parse(response);
					preview_url = parsed_objects["preview_url"];
					if (preview_url) {
						quest_no++
						$scope.genquiz(16, preview_url);
					}
					requests[5].send();
				}
			}
			requests[5].onreadystatechange = function () {
				if (requests[5].readyState == 4 && requests[5].status == 200) {
					var response = requests[5].responseText;
					var parsed_objects = JSON.parse(response);
					preview_url = parsed_objects["preview_url"];
					if (preview_url) {
						quest_no++
						$scope.genquiz(20, preview_url);
					}
					requests[6].send();
				}
			}
			requests[6].onreadystatechange = function () {
				if (requests[6].readyState == 4 && requests[6].status == 200) {
					var response = requests[6].responseText;
					var parsed_objects = JSON.parse(response);
					preview_url = parsed_objects["preview_url"];
					if (preview_url) {
						quest_no++
						$scope.genquiz(24, preview_url);
					}
					requests[7].send();
				}
			}
			requests[7].onreadystatechange = function () {
				if (requests[7].readyState == 4 && requests[7].status == 200) {
					var response = requests[7].responseText;
					var parsed_objects = JSON.parse(response);
					preview_url = parsed_objects["preview_url"];
					if (preview_url) {
						quest_no++
						$scope.genquiz(28, preview_url);
					}
					requests[8].send();
				}
			}
			requests[8].onreadystatechange = function () {
				if (requests[8].readyState == 4 && requests[8].status == 200) {
					var response = requests[8].responseText;
					var parsed_objects = JSON.parse(response);
					preview_url = parsed_objects["preview_url"];
					if (preview_url) {
						quest_no++
						$scope.genquiz(32, preview_url);
					}
					requests[9].send();
				}
			}
			requests[9].onreadystatechange = function () {
				if (requests[9].readyState == 4 && requests[9].status == 200) {
					var response = requests[9].responseText;
					var parsed_objects = JSON.parse(response);
					preview_url = parsed_objects["preview_url"];
					if (preview_url) {
						quest_no++
						$scope.genquiz(36, preview_url);
					}
					if (quest_no < 10) {
						requests[10].send();
					} else {
						document.getElementById('questions').innerHTML += "<div class='item'>" +
                		'<button class="sub_button" onclick="showresults()">SUBMIT</button></div>';
					}
				}
			}
			requests[10].onreadystatechange = function () {
				if (requests[10].readyState == 4 && requests[10].status == 200) {
					var response = requests[10].responseText;
					var parsed_objects = JSON.parse(response);
					preview_url = parsed_objects["preview_url"];
					if (preview_url) {
						quest_no++
						$scope.genquiz(40, preview_url);
					} if (quest_no < 10) {
						requests[11].send();
					} else {
						document.getElementById('questions').innerHTML += "<div class='item'>" +
                		'<button class="sub_button" onclick="showresults()">SUBMIT</button></div>';
					}
					
				}
			}
			requests[11].onreadystatechange = function () {
				if (requests[11].readyState == 4 && requests[11].status == 200) {
					var response = requests[11].responseText;
					var parsed_objects = JSON.parse(response);
					preview_url = parsed_objects["preview_url"];
					if (preview_url) {
						quest_no++
						$scope.genquiz(44, preview_url);
					}
					if (quest_no < 10) {
						requests[12].send();
					} else {
						document.getElementById('questions').innerHTML += "<div class='item'>" +
                		'<button class="sub_button" onclick="showresults()">SUBMIT</button></div>';
					}
				}
			}
			requests[0].send();
	}
});

// source: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function vid_play_pause() {
		var myVideo = document.getElementById("myVideo" + page_no);
		if (myVideo) {
			if (myVideo.paused) {
			myVideo.play();
			} else {
				myVideo.pause();
			}
		}
}

function car_play_pause() {
		var myVideo = document.getElementById("myVideo" + page_no);
		if (myVideo) {
			if (!myVideo.paused) {
				myVideo.pause();
			}
			increment();
		vid_play_pause();
		}
}

function increment() {
	if (page_no == 9) {
		var object = document.getElementsByClassName('right carousel-control')[0];
		object.style.display = "none";
	}
	page_no++;
}