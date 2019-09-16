<?php
include("db_connection.php");

$ip = $_SERVER["REMOTE_ADDR"];
$has_voted = json_decode(file_get_contents($db_voted), true);
if(isset($_POST["option"]) && !$has_voted[$ip]) {
    var_dump($_POST["option"]);
    $value = $_POST["option"];
    $data = json_decode(file_get_contents($db_poll), true);
    $data[$_POST["option"]]++;
    var_dump($data);
    file_put_contents($db_poll, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);
    $has_voted[$ip]++;
    file_put_contents($db_voted, json_encode($has_voted, JSON_PRETTY_PRINT), LOCK_EX);
}

