<?php
header("Content-Type:application/json;charset=utf-8");
$nums=$_REQUEST['nums'];
require ('init.php');
for($i=0;$i<6;$i++){
    if($i==0){
        $sql=" select `pic`,`price`,`title`,`href`,`tagType`,`tag`";
        $sql.=" from `jfb_index_floor`  where `isbig` != 1 limit $nums" ;
        $result=mysqli_query($conn,$sql);
        $result=mysqli_fetch_all($result ,MYSQLI_ASSOC);
        $data[$i]=$result;
    }else{
        $sql=" select `pic`,`price`,`title`,`href`,`tagType`,`tag`";
        $sql.=" from `jfb_index_floor`  where `floor`= $i and `isbig`=1" ;
        $result=mysqli_query($conn,$sql);
        $result=mysqli_fetch_assoc($result);
        $data[$i]['big']=$result;

        $sql=" select `pic`,`price`,`title`,`href`,`tagType`,`tag`";
        $sql.=" from `jfb_index_floor`  where `floor`= $i and `isbig`!=1 limit $nums" ;
        $result=mysqli_query($conn,$sql);
        $result=mysqli_fetch_all($result ,MYSQLI_ASSOC);
        $data[$i]['small']=$result;
    }

}
echo JSON_encode($data);
?>

