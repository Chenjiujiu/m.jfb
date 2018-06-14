<?php
header("content-Type:application/json");
session_start();
$uname=$_REQUEST['uname'];
$uphone=$_REQUEST['uphone'];
$upwd=$_REQUEST['upwd'];
$code=$_REQUEST['code'];
require ('init.php');


if(strtolower($_SESSION["code"])==strtolower($code)){
    $sql="INSERT INTO `jfb_user` (`uname`,`uphone`,`upwd`) VALUES ('$uname','$uphone','$upwd')";
    $result=mysqli_query($conn,$sql);
    if($result===true){
         $data['flag']=1;
         $data['uid']=mysqli_insert_id($conn);
         $_SESSION["uid"]=$data['uid'];
    }else{
        $data['flag']=0;
        $data['msg']='注册失败，请重试！';
    }
}else{
    $data['flag']=0;
    $data['msg']='验证码错误';
}
echo JSON_encode($data);
?>