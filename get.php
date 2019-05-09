<?php
    require_once('config.php');
    require(ROOT . 'libs/redbean/rb-mysql.php');
    require_once('db.php');

    if(!empty($_GET)) {
        if (isset($_GET['id'])) { 
            $product = R::findOne( 'products', 'id=' . $_GET['id']);

            echo json_encode($product);
        }
    }
?>