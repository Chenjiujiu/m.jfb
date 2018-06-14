<?php
header("content-Type:application/json");
session_start();
$uid=$_SESSION['uid'];
@$aid=$_REQUEST['aid'];
require ('init.php');
if($aid){
    $sql=" select `aid`,`consignee`,`province`,`city`,`county`,`address`,`cellphone`,`fixedphone`,`postcode`,`is_default` ";
    $sql.=" from `jfb_user_address` where `uid`=$uid and `aid`=$aid";
    $result=mysqli_query($conn,$sql);
    $address=mysqli_fetch_assoc($result);
}else{
    $sql=" select `aid`,`consignee`,`province`,`city`,`county`,`address`,`cellphone`,`fixedphone`,`postcode`,`is_default` ";
    $sql.=" from `jfb_user_address` where `uid`=$uid";
    $result=mysqli_query($conn,$sql);
    $address=mysqli_fetch_all($result,MYSQLI_ASSOC);
}


echo JSON_encode($address);

?>