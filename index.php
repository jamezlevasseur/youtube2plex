
<head>
  <meta charset="utf-8">
  <title>Lul</title>
  <!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

<link rel="stylesheet" type="text/css" href="css/main.css">
<link rel="stylesheet" type="text/css" href="css/animate.css">

</head>

<div class="container">
  <header class="col-md-12">
    <img style="" width="100" src="assets/aardlogo.png" alt="really cool header">
  </header><!-- /header -->
  <div id="menu-bar" class="col-md-4 col-md-offset-4">
    <!-- version 2
    <span id="casette"></span>
    <span id="cd"></span> -->
    <span id="album-button">ALBUM</span>
    <span id="reset-button">RESET</span>
  </div>
  <div id="fake-form">

    <div class="row">
      <div class="col-md-4 col-md-offset-4">
        <input type="text" class="url" name="url" placeholder="url goes here"/>
        <select class="library" name="library">
          <option value="music">music</option>
          <option value="podcast">podcast</option>
          <option value="memories">memories</option>
        </select>
      </div>

      <div class="col-md-4 col-md-offset-4" id="playlist">

      </div>

      <div class="col-md-4 col-md-offset-4" id="single">
        <label class="yt-original"></label>
        <label class="artist-label"><span class="switcheroo"></span><input type="text" name="artist" class="artist" value="" placeholder=""></label>
        <br>
        <label class="title-label"><span class="switcheroo"></span><input type="text" name="title" class="title" value="" placeholder=""></label>
        
        <div class="additional-container">
          <label class="track-label"><input type="text" name="tracknum" class="tracknum" value="" placeholder=""></label>
          <br>
          <label class="album-label"><input type="text" name="album" class="album" value="" placeholder=""></label>
          <br>
          <label class="genre-label"><input type="text" name="genre" class="genre" value="" placeholder=""></label>
          <br>
          <input type="submit" value="Let's Do It">
        </div>
        
      </div>
    </div>

  </div>

  
</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="js/dropzone.js" type="text/javascript" charset="utf-8"></script>
<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

<script type="text/javascript" src="js/main.js" charset="utf-8"></script>