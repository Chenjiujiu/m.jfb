<?php
session_start();
$uid=$_SESSION["uid"];
$sid=$_REQUEST['sid'];
$num=$_REQUEST['num'];
require ('init.php');
//详细信息
if($num==0){
    $sql="delete from `jfb_car` where `uid`=$uid and `sid`=$sid ";
}else{
    $sql="update `jfb_car` set `num`=$num where `uid`=$uid and `sid`=$sid ";
}
$result=mysqli_query($conn,$sql);
 if($result){
        echo 1;
    }else{
        echo 0;
    }
?>