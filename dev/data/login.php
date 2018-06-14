<?php
header("content-Type:application/json");
session_start();
$uname=$_REQUEST['uname'];
$upwd=$_REQUEST["upwd"];
$code=$_REQUEST["code"];
require ('init.php');
$sql="SELECT `uid`,`upwd` FROM `jfb_user` WHERE `uname`='$uname' OR `uphone`='$uname'";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_assoc($result);
if(
    $upwd===$result['upwd'] &
    $result['upwd'] != null &
    strtolower($_SESSION["code"])==strtolower($code)
    ){
    $data['flag']=1;
    $data['uname']=$uname;
    $_SESSION["uid"]=$result['uid'];
    $_SESSION['code']="";

}else if(strtolower($_SESSION["code"])!=strtolower($code)){
    $data['flag']='验证码错误';
}else{
    $data['flag']='用户名密码错误';

}
echo JSON_encode($data);
?>