<?php
header("content-Type:application/json");
$maxnum=$_REQUEST['maxnum'];
require ('init.php');
$sql="SELECT `img`,`title`,`href` FROM `jfb_index_slide` WHERE `site`=0 order by `isid` LIMIT $maxnum";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_all($result,MYSQLI_ASSOC);

echo JSON_encode($result);
?>