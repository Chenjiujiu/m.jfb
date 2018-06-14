<?php
header("Content-Type:application/json;charset=utf-8");
$fid=$_REQUEST['fid'];
$pno=$_REQUEST['pno'];
@$num=$_REQUEST['num'];
if(!$num){
    $num=8;
};
$star=($pno-1)*$num;
$end=$num;
require ('init.php');
$sql=" select `txt`,`pic`,`time`,`reply`,`tag`,`author`,";
$sql.=" (select `color` from `jfb_shoes_color` where cid=cid  limit 1 ) as color, ";
$sql.=" (select `size` from `jfb_shoes_size` where zid=zid limit 1) as size";
$sql.=" from `jfb_comment` m join `jfb_shoes` s ";
$sql.=" where s.sid=m.sid and fid=$fid ";
$sql.=" order by mid desc ";
$sql.=" limit $star,$end ";
$result=mysqli_query($conn,$sql);
$info=mysqli_fetch_all($result,MYSQLI_ASSOC);
$data["info"]=$info;

$sql=" select count(mid) from jfb_comment c ,jfb_shoes s  where s.sid =c.sid and fid=$fid";
$result=mysqli_query($conn,$sql);
$pnosum=mysqli_fetch_row($result);
$pages["pageAll"]=ceil($pnosum[0]/$num);
$pages["now"]=$pno;
$data["page"]=$pages;
echo JSON_encode($data);
?>

