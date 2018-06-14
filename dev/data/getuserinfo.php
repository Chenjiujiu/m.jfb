<?php
header("content-Type:application/json");
session_start();
@$uid=$_SESSION["uid"];
if($uid){
    $data['type']=1;
    require ('init.php');
    $sql="select `uname`,`user_name`, `avatar` from `jfb_user` where `uid`=$uid";
    $result=mysqli_query($conn,$sql);
    $user=mysqli_fetch_all($result,MYSQLI_ASSOC);
    $data['user']=$user[0];

    $sql="select status,count('status') as num from `jfb_order` where `uid`=$uid group by status";
    $result=mysqli_query($conn,$sql);
    $status=mysqli_fetch_all($result,MYSQLI_ASSOC);
    for($i=0;$i<count($status);$i++){
        $k=$status[$i]['status'];
        $v=$status[$i]['num'];
        switch($k){
            case 1:$k='pay';break;
            case 2:$k='send';break;
            case 3:$k='accept';break;
            case 4:$k='comment';break;
        }
        $data['status'][$k]=$v;
    };
}else{
    $data['type']=0;
    $data['msg']='未查到登录信息';
}
echo JSON_encode($data);

?>