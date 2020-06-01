<?php
/**
 * **DATA**: manages sensors data.
 * 
 * Client perspective:
 * - **GET** METHOD  --> returns the data of a sensor
 * 
 * 
 * ## Description
 * This script sets the returned **content type to JSON**,
 * **includes the db_utils.php script** 
 * > It is used to connect to MySQL.
 * 
 * If the script isn't included it tries to connect to the database,
 * and checks the request method:
 * - if the method is GET it calls the getData() function
 * 
 * When the called function ends PHP disconnects from the DB,
 * and data (or errors) is collected inside the response array.
 * The response array gets echoed to the client in JSON format
 * 
 * @file
 * @since 01_01
 * @author Stefano Zenaro (https://github.com/mario33881)
 * @copyright MIT
 * 
*/

// Set the response type to JSON
header("Content-type: application/json");

// =======================================================================================
// INCLUDES 

// Include db_utils.php: database connection
include_once(__DIR__ . "/db_utils.php");
include_once(__DIR__ . "/settings.php");

// =======================================================================================
// VARIABLES

/// Prepare default response array with no errors
$response = array("errors" => array());

/// Prepare default request array response with no errors
$request_res = array('errors' => array());

// =======================================================================================
// FUNCTIONS


/** 
 * Returns the data in the t_sensors_data table.
 * 
 * The function selects the data with a SELECT query.
 * 
 * @since 01_01
 * @param array $t_conn_res array with the DB connection object
 * @return array $action_res array with errors or data
*/
function getData($t_conn_res) {
	// array that will be returned by this function
    $action_res = array('errors' => array());
	
	// get last 1200 readings from the t_sensors folder
	$query = "SELECT id, tstamp, oil_data, sensor_id, sensor_description         -- select id, timestamp, oil data, sensor id and description from 'temp'
              FROM (SELECT id, tstamp, oil_data, sensor_id, sensor_description   -- select id, timestamp, oil data, sensor id and description
                           FROM t_sensors_data                                   -- from the t_sensors_data table
                           ORDER BY tstamp DESC                                  -- order from last to first reading
                           LIMIT 1200                                            -- limit the result
                    ) temp                                                       -- (temporary name of the table)
              ORDER BY tstamp                                                    -- order from first to last reading
	";                   
	
	// prepare the SQL query
    $stmt = $t_conn_res["connect_obj"]->prepare($query);
	
	// execute query and get the result
    $stmt->execute();
    $result = $stmt->get_result();
    
    // check if there was an error
    if (!$stmt->error) {
        // the query should return at least one row
        if (!empty($result) && $result->num_rows > 0) {
			// get an associative array with all the data
            $arr = $result->fetch_all(MYSQLI_ASSOC);
            $action_res['data'] = $arr;
        }
        else{
            // sql instruction gave 0 results
            array_push($action_res["errors"], array('id' => 210,
                                                    'htmlcode' => 500,
                                                    'message' => "Query returned nothing"));
        }
    }
    else {
        // executing the query gave an error
        array_push($action_res["errors"], array('id' => 211,
                                                'htmlcode' => 500,
                                                'message' => "Error executing query"));
    }

    return $action_res;
}


// =======================================================================================
// MAIN
    
if (!count(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS))) {
    // connect to the database
    $conn_res = dbconn();
    
    // check if no errors happened (connection successful)
    if (count($conn_res["errors"]) == 0){
        
        // check the request method
        if ($_SERVER["REQUEST_METHOD"] === "GET") {
            // get data/errors
            $request_res = getData($conn_res);
        }
        else {
            // Unexpected request method
            // 405: The method received in the request-line is known by the origin server but not supported by the target resource.
            $request_res = array('errors' => array());
            array_push($request_res['errors'], array("id" => 200,
                                                     "htmlcode" => 405,
                                                     "message" => "Method not supported by the target resource"));
        }

        // close DB connection
        $conn_res["connect_obj"] -> close();
    }

    // Add all the connection errors inside the response's errors array (if present)
    foreach ($conn_res["errors"] as &$error) {
        array_push($response["errors"], $error);
    }

    // Add all the request errors inside the response's errors array (if present)
    foreach ($request_res['errors'] as &$error) {
        array_push($response['errors'], $error);
    }
    
    // insert data inside the response or set the response code 
    if (count($response['errors']) > 0){
        // If there were errors, set the the response code to the one of the first error
        http_response_code($response['errors'][0]["htmlcode"]);
    }
    else if (isset($request_res["data"])){
        // there were no errors and the data is set, put it inside the response
        $response["data"] = $request_res["data"];
    }
    else {
        // no errors and no data... Shouldn't happen, but set an error anyway
        array_push($response['errors'], array("id" => 201,
                                              "htmlcode" => 500,
                                              "message" => "No data but also No errors"));
        http_response_code(500);
    }
    
    // echo the result
    echo json_encode($response);
}

?>