$(function () {
  var albumData = [];
  var linkLength = 0;
  var finishedLoading = 0;
  var playlistFinishInterval = null;
  var startIntervalTime = null;
  var amDoingSomething = false;

  // FUNCTIONS


  function cleanUpGuessing (beforeDash) {
    $.each($('.playlist-item'), function(index, val) {
      var theTitle = $(this).find('.title').val();
      if (theTitle=='') {
        var newtitle = $(this).find('label').text();
        if (newtitle.indexOf('-')!=-1) {
          if (beforeDash) {
            newtitle = newtitle.split('-')[0].trim()
          } else {
            newtitle = newtitle.split('-')[1].trim()
          }
        }

        $(this).find('.title').val(newtitle);
      }
    });

    $.each($('.playlist-item'), function(index, val) {
      var theTitle = $(this).find('.title').val();
      if (theTitle.indexOf('&') && theTitle.indexOf(';')) {
        $('body').append('<span id="nope" style="display:none;"></span>');
        var decoded = $('#nope').html(theTitle).text();
        $(this).find('.title').val(decoded);
        $('#nope').remove();
      }
    });
  }

  function doGuess () {
    amDoingSomething = true;
    if ($('#album-button').hasClass('active')) {
      guessPlaylist($('.url').val());
    } else {
      guessSongDetails($('.url').val());
    }
  }

  function guessAlbumArtist () {
    var freq = {};
    for (var k in albumData) {
      var d = albumData[k];
      if (d in freq) {
        freq[d] += 1;
      } else {
        freq[d] = 1;
      }
    }
    console.log(freq)
    var most = null;
    for (var k in freq) {
      if (most==null) {
        most = k;
        continue;
      }
      if (freq[k]>freq[most])
        most = k;
    }
    $('.album-artist').val(most);
    var times = 0, switched = false;
    $.each($('#playlist .title'), function(index, val) {
      if (switched)
        return;
      if ($(this).val()==most)
        times++;
      if (times>3) {
        switched = true;

        $.each($('.playlist-item'), function(index, val) {
          $(this).find('.title').val( $(this).find('.title').data('artist-guess') );
        });

      }
    });
    $('#playlist .artist').val(most);
    cleanUpGuessing(switched);
  }

  function guessSongDetails (urlToGuess, parentElement) {
    var artist, songTitle;

    parentElement = typeof parentElement=='undefined' ? $('body') : parentElement;

    $.ajax({
      url: 'guess.php',
      type: 'GET',
      data: {'url': urlToGuess.trim()},
      success: function (data) {
        try {
          var title = "";
          if (data.indexOf('watch-title-container')!=-1) {
            title = data.split('watch-title-container"')[1].substring(0, 500).split('title="')[1].split('"')[0];
          } else {
            if (parentElement.prop('tagName').toUpperCase()!='BODY') {
              parentElement.remove();
            }
            $('.yt-original').html('Click album if this is a playlist.');
            console.log('link:'+urlToGuess+' - might be playlist - FINSIHED '+parentElement.attr('id')+' num: '+(finishedLoading+1))
            finishedLoading++;
            return;
          }
          
          parentElement.find('.yt-label').prepend(title);

          if (parentElement.prop('tagName').toUpperCase()=='BODY') {
            $('#single .yt-original').html(title);
          }

          title = title.indexOf('(')==-1 ? title : title.substring( 0, title.indexOf('(') );

          var titleElement = parentElement.find('.title');

          titleElement.data('song-url', urlToGuess.trim());
          titleElement.attr('song-url', urlToGuess.trim());

          if (title.indexOf('-')!=-1) {
            artist = title.split('-')[0].trim();
            songTitle = title.split('-')[1].trim();

            if ($('#playlist .artist').length>0) {
              titleElement.data('artist-guess', artist);
            } else {
              parentElement.find('.artist').val(artist);
            }

            titleElement.val(songTitle);

            albumData.push(artist);
            albumData.push(songTitle);
          } else {
            titleElement.val(title);
          }
        } catch (e) {}
        finally {
          console.log('link:'+urlToGuess+' - NOT PLAYLIST - FINSIHED '+parentElement.attr('id')+' num: '+(finishedLoading+1))
          finishedLoading++;
        }
      }
    });
  }


  function guessPlaylist (urlToGuess) {
    startLoading();
    albumData = [];
    finishedLoading = 0;

    $.ajax({
      url: 'guess.php',
      type: 'GET',
      data: {'url': urlToGuess.trim()},
      success: function (data) {
        var list = data.split('pl-load-more-destination"')[1].split('</tbody>')[0];
        $('body').append('<span style="display:none;" id="chamber">'+list+'</span>');
        $('#chamber img').remove();
        linkLength = $('#chamber .pl-video-thumb a').length;
        //linkLength = linkLength - linkLength%2;

        console.log('LINK LENG: '+linkLength)

        $.each($('#chamber .pl-video-thumb a'), function(index, val) {
          try {

              var pid = 'playlist-item-'+$('.playlist-item').length;
              $('#playlist-songs').append('<div class="playlist-item" id="'+pid+'"><label class="yt-label"><input type="text" name="title" class="title" value="" placeholder=""></label><br></div>');

              var link = 'https://www.youtube.com'+$(this).attr('href');

              if (link.indexOf('watch')!=-1) {
                guessSongDetails(link, $('#'+pid));
        
                startIntervalTime = Math.floor(Date.now() / 1000);

                if (playlistFinishInterval==null) {
                  playlistFinishInterval = setInterval(function () {
                    if (finishedLoading<linkLength)
                      return;
                    clearInterval(playlistFinishInterval);
                    stopLoading();
                    $('#chamber').remove();
                    guessAlbumArtist();
                  }, 500);
                }

              } else {
                finishedLoading++;
              }
              
            
          } catch (e) {console.warn(e)}

        });
      }
    });
    
  }

  function initSubmit () {
    $('#fake-form input[type=submit]').off();
    $('#fake-form input[type=submit]').click(function (e) {
      startLoading();
      if ($('#playlist .artist').length>0) {


        var lib = $('.library').val();
        var _data = [];
        $.each($('.playlist-item'), function(index, val) {
          var thisTitle = $(this).find('.title');
          _data.push({'library': lib, 'url': thisTitle.data('song-url'), 'title': thisTitle.val(), 'artist': $('#playlist .artist').val(), 'album': $('#playlist .album').val(), 'tracknum': (index+1), 'genre': $('#playlist .genre').val()});
        });
        console.log(_data);
        $.ajax({
          url: 'middle.php',
          type: 'POST',
          data: {playlist:'true', data: _data},
          success: function (data) {

            console.log(data);
            stopLoading();
            uploadSuccess();
          },
          error: function (data) {

            console.log(data);
            stopLoading();
          }
        });

      } else {
        $.ajax({
          url: 'middle.php',
          type: 'POST',
          data: {'library': $('.library').val(), 'url': $('.url').val(), 'title': $('.title').val(), 'artist': $('.artist').val(), 'album': $('.album').val(), 'tracknum': $('.tracknum').val(), 'genre': $('.genre').val()},
          success: function (data) {
            console.log(data);
            if (data.indexOf('FAIL')!=-1 || true) {
              stopLoading();
              uploadFailure();
              console.warn('BAD UPLOAD');
              return;
            }
            
            stopLoading();
            uploadSuccess();
          },
          error: function (data) {

            console.log(data);
            stopLoading();
          }
        });
      }
      return false;
    });
  }

  function startLoading () {
    $('body').append('<div id="loading-gif" style="background:#f1f1f1; opacity: .8; z-index:9999; position:fixed; top:0;left:0;bottom:0;right:0; text-align:center;"><img src="loading.gif" alt="loading" /></div>');
  }

  function stopLoading () {
    $('#loading-gif').remove();
    amDoingSomething = false;
  }

  function uploadFailure () {
    $('body').append('<div class="wrapper"><div id="failed-upload" style="color:red; font-size:60px; text-align: center; position:fixed; top:30%;left:0;right:0;bottom:0;">CANNOT UPLOAD</div></div>');
    setTimeout( function () {
      $('#failed-upload').remove();
      $('#reset-button').click();
    }, 3000);
  }

  function uploadSuccess () {
    console.log('UPLOADED');
    $('body').append('<div class="wrapper" id="check-anim"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 98.5 98.5" enable-background="new 0 0 98.5 98.5" xml:space="preserve"><path class="checkmark" fill="none" stroke-width="8" stroke-miterlimit="10" d="M25,30 L 40,40 L 70,10"/></svg></div>');
    setTimeout( function () {
      $('#check-anim').remove();
      $('#reset-button').click();
    }, 3000);
  }


  //LISTENERS

  $('#reset-button').click(function(event) {
    if ($('#playlist .artist').length>0) {
      $('.url').val('');
      $('#album-button').click();
      $('#album-button').click();
    } else {
      $('.url').val('')
      $('#single input').val('');
    }
    $('input[type=submit]').val("Let's Do It");
  });
    

  $('#fake-form .url').change(function(event) {
    if (!amDoingSomething)
      doGuess();
  });

  $('#album-button').click(function(event) {
    if (!$(this).hasClass('active')) {
      $('#single').css('display', 'none');
      $('#playlist').css('display', 'block');
      $('#playlist').append('<label class="artist-label"><input type="text" name="artist" class="artist" value="" placeholder=""></label><br><label class="album-label"><input type="text" name="album" class="album" value="" placeholder=""></label><br><label class="genre-label"><input type="text" name="genre" class="genre" value="" placeholder=""></label><br><input type="submit" value="Let\'s Do It"><div id="playlist-songs"></div>');
      if ($('.url').val().length>0) {
        guessPlaylist($('.url').val());
      }
    } else {
      $('#single').css('display', 'block');
      $('#playlist').css('display', 'none');
      $('#playlist').empty();
    }
    initSubmit();
    $(this).toggleClass('active');
    if ($('.url').val().length>0 && !amDoingSomething)
      doGuess();

  });

  $('.switcheroo').click(function(event) {
    var temp = $('#single .title').val();
    $('#single .title').val( $('#single .artist').val() );
    $('#single .artist').val( temp );
  });

  $('select').change(function(event) {
    $(this).width($(this).find('option:selected').text().length*15);
  });

  initSubmit();
});