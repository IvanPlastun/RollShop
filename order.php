<?php
    require_once('config.php');
    require(ROOT . 'libs/redbean/rb-mysql.php');
    require_once('db.php');


    if (!empty($_POST)) {
        foreach($_POST as $key => $value) {
            $userInfo = json_decode($key);
            if (!empty($_COOKIE) && isset($_COOKIE['cart'])) 
                $orderInfo = json_encode($_COOKIE['cart']);
            $order = R::dispense('order');
            $order->name = htmlentities($userInfo->name);
            $order->phone = htmlentities($userInfo->phone);
            $order->total_cost = htmlentities($userInfo->totalCost);
            $order->cart = htmlentities($_COOKIE['cart']);
            R::store($order);
        }
    }

?>