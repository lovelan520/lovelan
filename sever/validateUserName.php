<?php
    if($_SERVER['REQUEST_METHOD'] == 'GET'){
        /*1.读取文件*/
        $dataStr = file_get_contents('./data.json');
        /*2.转换为数组，因为我们需要判断数组中的成员的name属性是否是指定的用户名--遍历*/
        $dataArr = json_decode($dataStr,true);
        /*3.遍历*/
        // sleep(3); // 延迟3秒后响应数据
        for($i=0;$i<count($dataArr);$i++){
            if($dataArr[$i]['name'] == $_GET['name']){
                $arr = array(
                    'code'=>1, //状态码
                    'msg'=>'用户名已存在' //状态信息
                );
                echo json_encode($arr);
                return;
            }
        }

        $arr = array(
            'code'=>0,
            'msg'=>'恭喜你,用户名可以使用'
        );
        echo json_encode($arr);
    }
?>