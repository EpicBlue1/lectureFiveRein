<?php

    include 'db_connection.php';

    header('Access-Control-Origin: *');
    header('Access-Control-Headers: *');

    $request_body = file_get_contents('php://input');
    $data= json_decode($request_body);

    $username = $data -> username;

    if($username === ''){
        echo '';
    } else {
        $sql = "SELECT * FROM users WHERE username = '$username';";
        $result = mysqli_query($conn, $sql);
        $result_check = mysqli_num_rows($result);

        if($result_check > 0){
            echo 'Not Available';
        } else {
            echo 'Available';
        }
    }


?>