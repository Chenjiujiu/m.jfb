<?php
header("Content-Type:application/json;charset=utf-8");
$fid=$_REQUEST['fid'];
require ('init.php');
//详细信息
$sql=" SELECT `name`,`type`,`delprice`,`price`,`origin`, ";
$sql.=" `sex`,`time`,`trsture`,`height`,`fun`,`close`,`tag`,`tag_type` ,";
$sql.=" (SELECT `name` FROM `jfb_shoes_brand` WHERE jfb_shoes_brand.bid=jfb_shoes_family.bid limit 1) AS brand " ;
$sql.=" FROM `jfb_shoes_family` WHERE `fid`=$fid ";
$result=mysqli_query($conn,$sql);
$info=mysqli_fetch_assoc($result);
$data["order"]=$info;
//所有颜色
$sql="select `cid`,`color`,`img` from jfb_shoes_color where fid=$fid";
$result=mysqli_query($conn,$sql);
$color=mysqli_fetch_all($result,MYSQLI_ASSOC);
$data["allColor"]=$color;
//所有尺码
$sql="select `zid`,`size` from jfb_shoes_size where fid=$fid";
$result=mysqli_query($conn,$sql);
$size=mysqli_fetch_all($result,MYSQLI_ASSOC);
$data["allSize"]=$size;
//详细图片
$sql="select group_concat(img separator ',') as order_pic from jfb_order_pic where `fid`=$fid";
$result=mysqli_query($conn,$sql);
$pics=mysqli_fetch_row($result);
$order_pic=explode(',',$pics[0]);
$data["order_pic"]=$order_pic;

$sql="select `cid`,`s`,`m`,`l`,`xl` from `jfb_shoes_pic` where `fid`=$fid";
$result=mysqli_query($conn,$sql);
$pro_pics=mysqli_fetch_all($result,MYSQLI_ASSOC);
$pic=array();
foreach($pro_pics as $k => $v){
if( in_array($v['cid'],$v))
    $pic[$v['cid']][]=$v;
}
$data["pic"]=$pic;

$sql=" select `cid`,group_concat(`zid` separator ';')as allZid ";
$sql.=" from `jfb_shoes` where fid=$fid group by `cid`";
$result=mysqli_query($conn,$sql);
$size=mysqli_fetch_all($result,MYSQLI_ASSOC);
$allZid=array();
foreach($size as $k => $v){
if( in_array($v['cid'],$v))
    $allZid[$v['cid']]=$v;
}
$data["allZid"]=$allZid;


echo JSON_encode($data);
?>