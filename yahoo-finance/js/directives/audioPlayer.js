'use strict';

angular.module('SnapPlayPortalApp')	
  .directive('audioplayer', function ($timeout, MediaService, GenreService, ArtistService, AlbumService, PlaylistService, $rootScope, FavoriteService, EnvService, $cookieStore, $filter) {
	return {
	  restrict: 'A',
	  templateUrl : '/views/play/partials/audioPlayer.html',
	  controller: function ($scope, $rootScope, AudioPlayerAPI, FavoriteService, ModalService, SlidingQueue) {
			$scope.play = false;
			$scope.song = null;
			$scope.initialized = false;
			$scope.api = AudioPlayerAPI;
			$scope.ps = PlaylistService;
			$scope.modalSetQueue = function(song_id) {
				var queuedSongs = [];
				for(var i = 0; i < player.getItem('arr').length; i++) {
					var tmpItem = {
						id: player.getItem('arr')[i].ID
					}
					queuedSongs.push(tmpItem);
				}
				ModalService.setSongs(queuedSongs);
	    }

	    $rootScope.dropped = function(dragEl, dropEl) {
	    	var drag = angular.element(dragEl);
	    	var media_id = drag.attr('data-media-id');
	    	$scope.api.addToQueue(media_id, 'song');
	    	$scope.$apply();
			}
		},
	  link: function($scope){
	  	 		//$cookieStore.get(key);
				//$cookieStore.put(key, val);
				var setVolume = function(){
					var volume = 0.8;
					if($cookieStore.get('projekktor_controlbar')){
						var projCookie = $cookieStore.get('projekktor_controlbar');
						volume = projCookie.volume;
					}
				  	return {
				  		slider : 100-(volume*100),  //(100 - Math.round(vol))/100 [in the other direction]
				  		projekktor : volume
				  	}
				  };
				var playing = false;
				var player;
				var silence = {0: {src: 'https://s3.amazonaws.com/intstatic.snapone.com/img/silence.mp3', type:'audio/mpeg'}, 
								config: {
									title: 	"---",
									name: 	"---",
									artist: "---",
									album: 	"---",
									id: 	0
								}}
				
				$scope.$watch('api.album_id', addAlbum);
				$scope.$watch('api.playlist_id', addPlaylist);
				$scope.$watch('api.genre_id', addGenre);
				$scope.$watch('api.artist_id', addArtist);
				$scope.$watch('api.item_id', setSong);
				$scope.$watch('api.song_id', playSong);
				$scope.$watch('api.clearq', clearQueue);
				$scope.$watch('api.more_media', addToQueue, true);
				$scope.env = EnvService;
				$rootScope.$on('logout', clearQueue);



				function parseType(song) {
					if (/mp3/.test(song) || /MP3/.test(song)) {
						return "audio/mp3";
					  } else if (/mp4/.test(song) || /m4a/.test(song)) {
						return "audio/mp4";
					  }
				};

				function togglePlayer() {
					if (player) {	      		
						if ($scope.api.play) {
							player.setPlay();
						} else {
							player.setPause();	
						}
					}
				};
				var sortProperty = null;

				$rootScope.$on('sortChange', function(){
					sortProperty = ($rootScope.sortBy) ? $rootScope.sortBy : null;
				});

				function parseMedia(origMedia){
						var playlistArray = [];


						// sort if needed // TODO: detect ASC/DESC
						var media = [];
						angular.copy(origMedia, media);

						if(sortProperty != null){
							 function compare(a,b) {
						          if (a[sortProperty] < b[sortProperty]){return -1;}
						          if (a[sortProperty] > b[sortProperty]){return 1;}
						          return 0;
					        }
					        media.sort(compare);
						}

						for(i = 0, l = media.length; i < l; i ++){
							// _log("song url", media[i].url.replace(/\?.*/,"").replace(/http:/,"https:"))
							// _log("new url", media[i].transcodings[0].url.replace(/http:/,"https:"))
							//playlistArray[i] = {0: {src: media[i].url.replace(/\?.*/,"").replace(/http:/,"https:"), type: parseType(media[i].url)},

							var song = {};

							if (/mp3/.test(media[i].url) || /MP3/.test(media[i].url)){
								song.s = $filter('handleProxyUrl')(media[i].url.replace(/\?.*/,"").replace(/http:/,"https:"));
								song.t = "audio/mp3";
							}else if(media[i].transcodings && media[i].transcodings[0].url != ''){
								song.s = $filter('handleProxyUrl')(media[i].transcodings[0].url.replace(/http:/,"https:"));
								song.t = "audio/mp3";
							}else{
								song.s = $filter('handleProxyUrl')(media[i].url.replace(/\?.*/,"").replace(/http:/,"https:"));
								song.t = parseType(media[i].url);
							}

							playlistArray[i] = {0: {src: song.s, type: song.t},
							config: {
								img: 	media[i].thumbnail_url,
								title: 	media[i].title,
								name: 	media[i].name,
								artist: media[i].artist,
								album: 	media[i].album,
								id: 	media[i].id,
								path: 	media[i].path,
								favorite: media[i].favorite,
								poster: ""
							}}
						};
						_log("playlistArray",playlistArray)
						return playlistArray;
				};
				function addToQueue() {
					if (player) { 
						if(typeof $scope.api.more_media == "object"){
							var playList = parseMedia($scope.api.more_media);
							for(i = 0, l =  playList.length; i < l; i ++){
						          player.setItem(playList[i]);
						    }
						}else{
							// fetch media by id, then parse.
							var service = $scope.api.whichService;
							switch(service){
								case "artist" : (function (){
													ArtistService.getArtistMedia($scope.api.more_media).then(function(response){
														var playList = parseMedia(response.data.data);
														if (!$scope.initialized) {
															$scope.initialized = true;
															for(i = 0, l =  playList.length; i < l; i ++){
														        player.setItem(playList[i], i, true);
														    }
															player.setPlay();
														}else{
															for(i = 0, l =  playList.length; i < l; i ++){
													          	player.setItem(playList[i]);
													    	}
														}
													});
												})();
								break;
								case "album" :  (function (){
													AlbumService.getAlbumMedia($scope.api.more_media).then(function(response){
														var playList = parseMedia(response.data.data);
													    if (!$scope.initialized) {
															$scope.initialized = true;
															for(i = 0, l =  playList.length; i < l; i ++){
														        player.setItem(playList[i], i, true);
														    }
															player.setPlay();
														}else{
															for(i = 0, l =  playList.length; i < l; i ++){
													          	player.setItem(playList[i]);
													    	}
														}
													});
												})();
								break;
								case "song" : (function (){
													MediaService.getMedia($scope.api.more_media).then(function(response){
														var list = [];
														list[0] = response.data;
														var playList = parseMedia(list);
														for(i = 0, l =  playList.length; i < l; i ++){
													          player.setItem(playList[i]);
													    }
													});
												})();
								break;				
							}
						}
					}
				};
				function setSong(){
					if (player) {
								var playlistArray = parseMedia($scope.api.media);
								if (!$scope.initialized) {
									$scope.initialized = true;
								}
								player.setFile(playlistArray);

								var currPlaylist = player.getPlaylist();	
								var getKey = function(){
									var indexOfItem;
									angular.forEach(currPlaylist, function (value, key){
											if(currPlaylist[key].ID == $scope.api.item_id){
												indexOfItem = key;				      					
											}
									})
									return indexOfItem;
								}
								var num = parseInt(getKey(), 10);
								player.setActiveItem(num);
								player.setPlay();
								$rootScope.queueSlider.setCurrLeft(num);
							}
				};
				function playSong(){
					if (player) {
						var currPlaylist = player.getPlaylist();	
						var getKey = function(){
							var indexOfItem;

							angular.forEach(currPlaylist, function (value, key){
									if(currPlaylist[key].ID == $scope.api.song_id){
										indexOfItem = key;				      					
									}
							})
							return indexOfItem;
						}
						var num = parseInt(getKey(), 10);
						player.setActiveItem(num);
						player.setPlay();
					}
				};
				function addAlbum() {
					if (player) { 
						AlbumService.getAlbumMedia({id: $scope.api.album_id}).then(function(response){
							
							var playlistArray = parseMedia(response.data.data);

							if ($scope.initialized) {
								$scope.initialized = true;
							}
							player.setFile(playlistArray);
							player.setPlay();

						});
					}
				};
				function addPlaylist() {
					if (player) { 
						PlaylistService.getPlaylistMedia($scope.api.playlist_id).then(function (response){

							if(response.data.data != undefined){
								var playlistArray = parseMedia(response.data.data);
							}else{
								// TODO: get the media some other way
								return;
							}

							if ($scope.initialized) {
								$scope.initialized = true;
							}
							player.setFile(playlistArray);
							player.setPlay();

						});
					}
				};
				function addArtist() {
					if (player) { 
						ArtistService.getArtistMedia($scope.api.artist_id).then(function (response){
							if(response.data.data != undefined){
								var artistArray = parseMedia(response.data.data);
							}else{
								// TODO: get the media some other way
								return;
							}
							

							if ($scope.initialized) {
								$scope.initialized = true;
							}
							player.setFile(artistArray);
							player.setPlay();

						});
					}
				};
				function addGenre() {
					if (player) { 
						GenreService.getGenreMedia($scope.api.genre_id).then(function (response){

							var playlistArray = parseMedia(response.data.data);

							if ($scope.initialized) {
								$scope.initialized = true;
							}
							player.setFile(playlistArray);
							player.setPlay();

						});
					}
				};
				function playNext(){
					if($scope.api.shuffle && !$scope.api.loop){
						shuffleQ();
					}else if($scope.api.loop){
						loopSong();
					}
					
				};
				function loopSong(){
					var idx = player.getItemIdx();
					$timeout(function(){
						player.setActiveItem(idx);
						player.setPlay();
					}, 100);
					
				};
				function shuffleQ(){
						var max = player.getItemCount();
						var randInt = getRandomInt(0, max);
						// I noticed a repeat of the same song in the shufle, so this is a check for next time that happens to happen:
						if(randInt == player.getItemIdx()){ 
							if(randInt != max){
								randInt += 1; 
							}else{
								randInt -= 1;
							}
						}
						player.setActiveItem(randInt);
				};

				function clearQueue(){
					if(player){
						player.setFile([silence]);
					}
					$scope.api.resetAudioPlayer();
					$scope.initialized = false;
					$scope.play = false;
					$scope.song = null;

					// close the player container if it's open:
					if(playerContainer.clicked == true){
						playerContainer.close();
						playerContainer.clicked = !playerContainer.clicked;
						// reset the height of the wrapper, now that the player container is closed:
						var winHeight = $(window).height();
						$(".wrapper").height(winHeight - 80); 
					}

					$scope.api.clearq = false;
				};

				$timeout(function(){
						player = new projekktor('#audioplayertag', {
						  debug: false,
						  volume: (player && player.currVol) ? player.currVol : setVolume().projekktor,
						  controls: true,
						  //loop:true,
						  continuous:true,
						  plugin_controlbar: {
							showOnStart:true,
							showOnIdle:true,
							controlsTemplate :  '<div class="top audio-buttons clearfix">'+
												'<div %{prev}></div><div %{play}></div><div %{pause}></div><div %{next}></div>'+
												'</div>'+
												'<div class="bottom scrubber">'+
												'<div class="time-remaining">%{min_elp}:%{sec_elp}</div>'+
												'<div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div>'+
												'<div class="duration">%{min_dur}:%{sec_dur}</div>'+
												'</div>'
						  },
						  playlist: [silence],
						  playerFlashMP4: 'http://s3.amazonaws.com/intstatic.snapone.com/js/projekktor-1.2.34r295/jarisplayer.swf',
						  playerFlashMP3: 'http://s3.amazonaws.com/intstatic.snapone.com/js/projekktor-1.2.34r295/jarisplayer.swf',
						  skipTestcard: true
						}, function(player) {
						
								  player.addListener('start', function () {  
									$scope.$$phase || $scope.$apply();
								  }); 
								  player.addListener('state', function () {  
									$rootScope.$$phase || $rootScope.$apply(); 
								  })  


						 });
					$scope.$watch(function () {return player.getItem('*')}, function () {
						
						
						 // console.log("obj", player.getItem('*'));
						 // console.log("newarr", player.getItem('arr'));

						$scope.playlist = player.getItem('arr');

						$rootScope.queueSlider.init(player.getItemCount(), $('.slider'));
						$rootScope.queueSlider.reflow();

													   
						
						 // $scope.playlist = [];
						 // $scope.playlistObj = player.getItem('*');
						// turn this object into an array so ng-repeat will display in correct order.
						// angular.forEach($scope.playlistObj, function (value, key){
						// 	$scope.playlist[key] = $scope.playlistObj[key];
						// 	console.log("$scope.playlist::", $scope.playlist);
						// });
					}, true);

					$rootScope.$watch(function () {return player.getItem("current").config}, function () {
									if(!player.getItem("current").config.id == 0){
										$scope.enablePlayer = true;
									}else{
										$scope.enablePlayer = false;
									}
									$rootScope.currentSong = player.getItem("current").config;
									$rootScope.currentSongId = player.getItemIdx();
								  },true);

					$rootScope.$watch(function(){return player.getState("PLAYING")}, function(){
									$rootScope.isPlaying = player.getState("PLAYING");
								  },true);
					$rootScope.$watch(function(){return player.getState("COMPLETED")}, function(){
									$rootScope.isCompleted = player.getState("COMPLETED");
									playNext();
								  },true);
					$rootScope.$watch(function(){return player.getState("STARTING")}, function(){
									$rootScope.queueSlider.setCurrLeft(player.getItemIdx());
								  },true);
					$rootScope.$watch(function(){return player.getState("PAUSED")}, function(){
									$rootScope.isPaused = player.getState("PAUSED");
								  },true);



					window.player=player;
				}, 100);

				$rootScope.$on('toggleFav', function(e, song){
					  if($rootScope.currentSong.id == song.id){
			          $rootScope.currentSong.favorite = song.favorite;
			        }
				});
				var playerContainer = {
					open: function () {
						if (Modernizr.csstransforms) {
							$(".player-container").addClass("open");
						} else {
							$(".player-container").animate({
								"bottom": 0
							});
						}
						$(".wrapper").height(winHeight - 300);
					},
					close: function () {
						if (Modernizr.csstransforms) {
							$(".player-container").removeClass("open");
						} else {
							$(".player-container").animate({
								"bottom": -220
							});
						}
						$(".wrapper").height(winHeight - 80);
					},
					"clicked": false
				}
				$(".reveal-playlist").on({
					click: function (e) {
						e.preventDefault();
						e.stopPropagation();
						if (!playerContainer.clicked) {
							playerContainer.open();
						} else {
							playerContainer.close();
						}
						playerContainer.clicked = !playerContainer.clicked;
						return false;
					}
				});
				$(".player").swipeEvents().on({
					swipeUp: playerContainer.open,
					swipeDown: playerContainer.close
				});
				var winHeight = $(window).height();
				$(window).resize($.debounce(200, function () {
					winHeight = $(window).height();
					$(".wrapper").height(winHeight - 80);
					$rootScope.queueSlider.init(player.getItemCount(), $('.slider'));
					$rootScope.queueSlider.reflow();
				})).trigger("resize");

				(function volumeControl(){
						  var vol_timer;

						  $(".volume-slider").noUiSlider({
											  range: [0, 100]
											 ,start: setVolume().slider
											 ,handles: 1
											 ,orientation: "vertical",
											 slide : function(){
													  vol = (100 - Math.round($(this).val()))/100;
													  projekktor('#audioplayertag').setVolume(vol);
													  if(player){
													  	 player.currVol = vol;
													  }
													 
											 }
										  }).on({
											'mouseleave touchend' : function(){
											
											}
										  });
						  $("body").find(".volume-icon").on({
						  	'mouseleave touchend' : function(){
											  var that = $(this);
											  vol_timer = setTimeout(function(){
												that.find(".noUiSlider").fadeOut();
											  }, 1000); // a little hover intent action

											},
							'mouseenter touchstart' : function(){
								clearTimeout(vol_timer);
								$(this).find(".noUiSlider").show();
							}
						  });
				})();
  }}});
