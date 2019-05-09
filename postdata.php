<?php
    require_once('config.php');
    require(ROOT . 'libs/redbean/rb-mysql.php');
    require_once('db.php');

    class shopAPI {
        private function getProductsFromDB($tableName) {
            $productsAll = R::find($tableName);
            return $productsAll;
        }

        public function getProducts($tableName) {
            echo json_encode($this->getProductsFromDB($tableName));
        }
    }

    $shop = new shopAPI;
    $shop->getProducts('products');











































    // //define(ROOT, dirname(__FILE__) . '/');

    //$data_from_file = file_get_contents(HOST . "data.json");
    //$product = json_decode($data_from_file);
    //print_r($product);
    // $product[0]->counter = 25;
    // $productWriteToFile = json_encode($product);
    // //print_r($product);
    // file_put_contents( 'D:\Programs\open-server\OSPanel\domains\rollShop\data.json', $productWriteToFile);
    


    //print_r(json_encode($_POST)); // work
    //print_r($_POST);

    //function updataJsonFile() {
        // $data_from_file = file_get_contents(HOST . "data.json");
        // $product = json_decode($data_from_file);
        // //print_r($product);
        // if(!empty($_POST)) {
        //     foreach($_POST as $data => $key) {
        //         $val = json_decode($data);
        //         $index = $val->index;
        //         $count = $val->count;
        //         $price = $val->price;
        //         //print_r($product[$index]);
        //         $product[$index]->counter = $count;
        //         $product[$index]->totalPrice = $price;
        //         $productWriteToFile = json_encode($product);
        //         file_put_contents( 'D:\Programs\open-server\OSPanel\domains\rollShop\data.json', $productWriteToFile);
        //         print_r($product[$index]);
        //         //echo $data;
        //     }
        // }
    //}
    

    // $datastr = '[{"fname":"Ivan","lname":"Plastun","age":22,"prof":"Programmer"}]';
    // $parseData = json_decode($datastr);
    // print_r($parseData[0]->fname);
    //echo $data_from_file;
    // (
    //     [{"fname":"Ivan","lname":"Plastun","age":22,"prof":"Programmer"}] => 
    // )
?>
