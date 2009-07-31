<?php
include "Snoopy.class.php";
$snoopy = new Snoopy;
$submit_url = "http://api.fanfou.com/statuses/update.xml";

if($_POST[update] != null && $_POST[update] === "up"){

	if(!isset($_SESSION["username"])){
		//登录
		session_start();
		$_SESSION[username] = trim($_POST[username]);
		$_SESSION[password] = trim($_POST[password]);
	}
	
	//header('Content-type: text/html;charset=GB2312'); 
	
	$snoopy->user = $_SESSION[username];
	$snoopy->pass = $_SESSION[password];
	
	$message = array("status"=>"","source"=>"koomi's fanfou pubtools");
	$message["status"] = trim($_POST[message]);
	//$message["status"] = "再测试snoopy-php-class";
	
	$snoopy->submit($submit_url,$message);
	
	/*
	//header('Content-type: text/html;charset=GB2312'); 
	$host = "http://api.fanfou.com/statuses/update.xml";
	//$host = "http://api.fanfou.com/statuses/user_timeline.xml";
	$message = array("status"=>"");
	$message["status"] = trim($_POST[message]);
	//$message = trim($_POST[message]);
	$username = $_SESSION[username];
	$password = $_SESSION[password];
	$ch = curl_init();
	curl_setopt($ch,CURLOPT_URL,$host);
	curl_setopt($ch,CURLOPT_VERBOSE,1);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
	curl_setopt($ch,CURLOPT_USERPWD,"$username:$password");//设置用户名密码
	curl_setopt($ch,CURLOPT_POST,1);//用POST方式发送
	curl_setopt($ch,CURLOPT_POSTFIELDS,$message);//POST的字段，可以是一个关联数组
	$result = curl_exec($ch);//获取返回结果信息
	//$resultArray = curl_getinfo($ch);//获取响应信息，是一个数组
	curl_close($ch);
	//print_r($result);
	//print_r($resultArray);
	*/
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Desktop Fanfou</title>
<style type="text/css">
<!--
body {
	background-color: #CCCCCC;
}

#body {
	margin: 80px auto;
	width: 500px;
}

/* login */
#login {
	width: 500px;
}
#login #user, #login #pwd {
	height: 30px;
}
#login #user .lbluser, #login #pwd .lblpwd {
	margin: 0 15px 0 0;
}

/* login */
#nowuser {
	width: 500px;
}

/* login */
#msg {
	width: 500px;
}

/* login */
#sbm {
	width: 500px;
	margin-top: 6px;
}
-->
</style>
</head>

<body>
<center>
<h1>Desktop Fanfou!</h1>
<h3>by koomi</h3>
</center>
<form id="form1" name="form1" method="post" action="snoopy_fanfouapi.php">
<div id="body">
	<?php if(!isset($_SESSION["username"])){ ?>
	<div id="login">
    	<div id="user"><span class="lbluser"><label for="username">用户名：</label></span><input type="text" name="username" id="username" /></div>
        <div id="pwd"><span class="lblpwd"><label for="password">密&nbsp;&nbsp;&nbsp;&nbsp;码：</label></span><input type="password" name="password" id="password" /></div>
    </div><?php } else { ?>
	<div>最近发送的消息：<?=trim($_POST[message])?></div>
    <div id="nowuser">当前用户：<?=$_SESSION[username]?></div><?php } ?>
    <div id="msg">
    	<textarea name="message" cols="60" rows="7"></textarea>
    </div>
    <div id="sbm">
  		<input name="submit" type="submit" value="发送消息" />
        <input name="update" type="hidden" value="up" />
    </div>
</div>
</form>
</body>
</html>