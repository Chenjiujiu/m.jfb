<?php
header("content-Type:application/json");
session_start();
@$uid=$_SESSION["uid"];
if(!$uid){
    echo 0;
}else{
    require ('init.php');
    //详细信息
    $sql=" select name,delprice,price,color,size,big.sid, big.num, big.carid,sf.fid, ";
    $sql.=" (select s from jfb_shoes_pic as spp where spp.fid=fid and spp.cid=big.cid limit 1 ) as pic ";
    $sql.=" from jfb_shoes_family as sf, ";
    $sql.=" (select color,size,sid,cz.fid,cz.zid,cz.cid ,cz.num,cz.carid";
    $sql.=" from ";
    $sql.=" jfb_shoes_color as sc, ";
    $sql.=" jfb_shoes_size as ss , ";
    $sql.=" (select jfb_shoes.cid,jfb_shoes.zid,jfb_shoes.sid,jfb_shoes.fid,jfb_car.num,jfb_car.cid as carid from jfb_shoes,jfb_car  where jfb_shoes.sid=jfb_car.sid and jfb_car.uid=$uid) as cz ";
    $sql.=" where sc.cid=cz.cid and ss.zid=cz.zid) as big ";
    $sql.=" where sf.fid= big.fid ";

    $result=mysqli_query($conn,$sql);
    $data=mysqli_fetch_all($result,MYSQLI_ASSOC);

    $all=array();
    foreach($data as $key=>$value){
      $all[$value['sid']]=$value;
    }
    echo JSON_encode($all);
}


?>




