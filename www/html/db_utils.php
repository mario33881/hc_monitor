<?php
/**
 * **DB_UTILS**: manages database connection and queries.
 * 
 * This script defines a function to connect to the database
 * and two function that execute queries (one returns data in an array and the other as JSON)
 * 
 * @file
 * @since 01_01
 * @author Stefano Zenaro (https://github.com/mario33881)
 * @copyright MIT
*/


/**
 * Connects to a database and returns errors or connection object.
 * 
 * This function connects to the database by reading credentials stored inside the 'credentials.ini' file. 
 *
 * @since 01_01
 * @return array $conn_res array with errors or connection object
*/
function dbconn(){
    // array with default values
    $conn_res = array('errors' => array(), 'connect_obj' => NULL);
    
    // ini file with credentials
    $ini_path = $_SERVER['DOCUMENT_ROOT'] . '/../credentials/credentials.ini';

    // check if file exists
    if (file_exists($ini_path)){
        // parse the config file
        $ini_array = parse_ini_file($ini_path);
        
        // check if the config file is configured correctly
        if (isset($ini_array['DB_NAME']) && isset($ini_array['DB_HOST']) && isset($ini_array['DB_USER']) && isset($ini_array['DB_PASS'])){
            $dbname = $ini_array['DB_NAME'];      // name of the database
            $servername = $ini_array['DB_HOST'];  // name/ip of the host
            $username = $ini_array['DB_USER'];    // username
            $password = $ini_array['DB_PASS'];    // password
            
            // connect to the database
            $conn = new mysqli($servername, $username, $password, $dbname);
            
            // check if connection was successful
            if ($conn->connect_error) {
                // add the error
                array_push($conn_res['errors'], array('id' => 110,
                                                    'htmlcode' => 500,
                                                    'message' => 'Couldn\'t connect to the database'));
            }
            
            $conn->set_charset('utf8mb4');
            
            $conn_res['connect_obj'] = $conn;
        }
		else{
            array_push($conn_res['errors'], array('id' => 112,
                                                  'htmlcode' => 500,
                                                  'message' => 'Config file is not configured properly'));
        }
    }
    else{
        array_push($conn_res['errors'], array('id' => 111,
                                              'htmlcode' => 500,
                                              'message' => 'Config file doesn\'t exist'));
    }
    
    return $conn_res;
}


?>