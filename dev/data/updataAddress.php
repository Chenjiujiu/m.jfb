<?php
session_start();
@$uid=$_SESSION["uid"];
@$consignee=$_REQUEST['consignee'];
@$cellphone=$_REQUEST['cellphone'];
@$province=$_REQUEST['province'];
@$city=$_REQUEST['city'];
@$county=$_REQUEST['county'];
@$address=$_REQUEST['address'];
@$aid=$_REQUEST['aid'];
@$is_default=$_REQUEST['is_default'];
require ('init.php');
//详细信息
if($uid && $consignee && $cellphone && $province && $city && @$address ){
    if($is_default==1){
         $sql="update `jfb_user_address` set `is_default`=0 where `uid`=$uid";
         $result=mysqli_query($conn,$sql);
    }
    if($aid){
       $sql="update `jfb_user_address` set `consignee`='$consignee',`province`='$province',`city`='$city',`county`='$county',`address`='$address',`cellphone`='$cellphone' ,`is_default`=$is_default where `uid`=$uid and `aid`=$aid ";
    }else{
       $sql =" insert into `jfb_user_address` ";
       $sql.=" (`uid`,`consignee`,`province`,`city`,`county`,`address`,`cellphone`,`is_default`)";
       $sql.=" values ($uid,'$consignee','$province','$city','$county','$address','$cellphone',$is_default)";
    }
    $result=mysqli_query($conn,$sql);
    if($result){
      echo "ok";
    }else{
      echo '添加地址失败';
    }
}else{
    echo "信息不全";
}
?>