<?php
// se impostato a true, nasconde errori per permettere ai 
// client di interpretare risposta JSON anche in caso di errore
$production = true;

if ($production){
    error_reporting(E_ERROR | E_PARSE);
}

?>