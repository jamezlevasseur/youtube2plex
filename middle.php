<?php

if (array_key_exists('playlist', $_POST)) {
    foreach ($_POST['data'] as $songData) {
        makeSong($songData);
    }
} else {
    makeSong($_POST);
}

function makeSong($item)
{
    print_r($item);

    $metaArgs = ' -a '.$item['artist'].' -t '.$item['title'];

    if (!empty($item['album']))
        $metaArgs.=' -al '.$item['album'];
    if (!empty($item['tracknum']))
        $metaArgs.=' -tr '.$item['tracknum'];
    if (!empty($item['genre']))
        $metaArgs.=' -g '.$item['genre'];

    echo "php songmaker.php $metaArgs -u ".$item['url']." -d ".$item['library'];

    print_r( shell_exec("php songmaker.php $metaArgs"." -d ".$item['library']." -u ".$item['url']) );
}
