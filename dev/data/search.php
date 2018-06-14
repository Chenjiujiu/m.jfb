<?php
header("content-Type:application/json");
$keywords=$_REQUEST['keywords'];
$keywords=JSON_decode($keywords);
$pno=$_REQUEST['pno'];
$nums=$_REQUEST['nums'];
$star=($pno-1)*$nums;
$end=$nums;
require ('init.php');
$sql=" select ss.`sid`,sf.`price`,sf.`tag`,sb.`name` as bname,sc.`color`,sf.`type`,sz.`size`,sf.`name`,sp.`pic`,sf.`fid`";
$sql.="  from jfb_shoes_family as sf ";
$sql.=" join jfb_shoes_color as sc on sf.fid=sc.fid ";
$sql.=" join jfb_shoes_size as sz on sf.fid=sz.fid ";
$sql.=" join jfb_shoes_brand as sb on sf.bid=sb.bid ";
$sql.=" join (select `fid`,`cid`,`m` as pic from `jfb_shoes_pic` group by `fid`,`cid`)";
$sql.=" as sp on sp.fid=sc.fid and sp.cid=sc.cid ";
$sql.=" join jfb_shoes as ss on ss.cid=sc.cid and ss.zid=sz.zid ";
$sql.=" where ";
if($keywords){
    foreach($keywords as $key=>$value){
        $sql.=" concat( ";
        $sql.=" ifnull(sc.`color`,''),',',";
        $sql.=" ifnull(sc.`color_type`,''),',',";
        $sql.=" ifnull(sz.`size`,''),'码',',',";
        $sql.=" ifnull(sb.`name`,''),',',";
        $sql.=" ifnull(sf.`name`,''),',',";
        $sql.=" ifnull(sf.`type`,''),',',";
        $sql.=" ifnull(sf.`price`,''),',',";
        $sql.=" ifnull(sf.`origin`,''),',',";
        $sql.=" ifnull(sf.`sex`,''),',',";
        $sql.=" ifnull(sf.`time`,''),',',";
        $sql.=" ifnull(sf.`trsture`,''),',',";
        $sql.=" ifnull(sf.`height`,''),',',";
        $sql.=" ifnull(sf.`fun`,''),',',";
        $sql.=" ifnull(sf.`close`,''),',',";
        $sql.=" ifnull(sp.`pic`,''),',',";
        $sql.=" ifnull(sf.`tag`,'')";
        $sql.=" )";
        $sql.=" like '%";
        $sql.=$value;
        $sql.="%'";
        if($key!==count($keywords)-1){
             $sql.=" and";
        }
    }
    /*每个款式只显示一个尺码*/
    $sql.=" group by sf.`price`,bname,sc.`color`,sf.`type`,sf.`name`,sp.`pic`,sf.`fid`";
    $sql.=" order by sf.`price` ";
    //$sql.=" limit $star,$en
    $result=mysqli_query($conn,$sql);
    $products=mysqli_fetch_all($result,MYSQLI_ASSOC);
    $data['type']=1;
    $data['products']=$products;
    $data["now"]=$pno;
    $data["proNums"]=count($products);
    $data["pages"]=ceil(count($products)/$nums);
}else{
    $data['type']=0;
    $data['msg']='查询关键词缺失';
}
 echo JSON_encode($data);


?>










