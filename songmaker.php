#!/usr/bin/php
<?php

function getArgWithSpaces($i, $av)
{
  $a = $av[$i];
  $i++;
  $leng = count($av);
  while ($i<$leng) {
    if (strpos($av[$i], '-')===0)
      break;
    else
      $a.=' '.$av[$i];
    $i++;
  }
  return $a;
}

$dir = '';

for ($i=0; $i<count($argv); $i++) {
  $v = $argv[$i];
  if ($v=="-u")
    $url = $argv[$i+1];
  else if ($v=="-d")
    $dir = $argv[$i+1];
  else if ($v=="-a")
    $artist = getArgWithSpaces($i+1, $argv);
  else if ($v=="-t")
    $title = getArgWithSpaces($i+1, $argv);
  else if ($v=="-al")
    $album = getArgWithSpaces($i+1, $argv);
  else if ($v=="-tr")
    $tracknum = $argv[$i+1];
  else if ($v=="-g")
    $genre = getArgWithSpaces($i+1, $argv);
}

if ($url==null)
  exit("NO URL DEFINED");

if (substr($dir, -1)!='/')
  $dir = $dir.'/';

echo shell_exec("rm /plex/temp.mp4");
print_r( shell_exec("youtube-dl \"$url\" -o /plex/temp.mp4") );
echo "<br>--------------------- PART 2 --------------------<br>";

$tracknum = empty(trim($tracknum)) ? 0 : $tracknum;

$name = str_replace(' ', '\ ', "$tracknum - ".$title);

$metadata = '-metadata title="'.$title.'" -metadata artist="'.$artist.'"';

if (!empty($album))
  $metadata.=' -metadata album="'.$album.'"';
else
  $metadata.=' -metadata album="'.$artist.'"';
if (!empty($tracknum))
  $metadata.=' -metadata track="'.$tracknum.'"';
if (!empty($genre))
  $metadata.=' -metadata genre="'.$genre.'"';

$cmd = "ffmpeg -i /plex/temp.mp4 -vn -acodec libmp3lame -ac 2 -qscale:a 4 -ar 48000 $metadata /plex/$dir$name.mp3";

shell_exec($cmd);

echo $cmd;

echo file_exists("/plex/$dir$name.mp3") ? 'SUCCESS' : 'FAIL';

/*
echo '<br>';
echo $cmd;
print_r($argv);*/