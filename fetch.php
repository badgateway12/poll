<?php
include("db_connection.php");

$data = json_decode(file_get_contents($db_poll), true);
echo json_encode($data);
