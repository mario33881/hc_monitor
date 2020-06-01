# HC_MONITOR

Basic hydrocarbon monitoring system.

Semplice sistema di monitoraggio degli idrocarburi.

![Homepage](/images/home.JPG)

## Introduzione
Il sistema e' composto di 3 componenti principali:
* un database MySQL con i dati delle quantita' di idrocarburi in acqua,
il timestamp della lettura, un id e una descrizione (ad esempio la posizione) del sensore
* una pagina PHP che si connette al database MySQL e restituisce i dati ai client che li richiedono
* una pagina html con CSS bootstrap per rendere la pagina responsive e che richiama
lo script javascript che utilizza AJAX per ottenere i dati dalla pagina PHP, crea i grafici e visualizza le notifiche.

## Guida all'uso
1. Installare Apache e l’interprete PHP. 
Per fare questo è possibile scaricare il mio script bash disponibile su Github ed eseguirlo con il comando ```./install.sh -apachephp”```. ([link](https://github.com/progetto201/progetto201-autoinstall/tree/master/autoapachephp))

2. Installare MySQL e importare il file SQL ```db_pp.sql```. Anche qui e' possibile utilizzare uno script ([disponibile qui](https://github.com/progetto201/progetto201-autoinstall/tree/master/automysql))

3. Inserire il contenuto della cartella ```www``` nella cartella ```/var/www/```
4. Modificare le credenziali nel file ```credentials.ini``` per permettere a PHP di connettersi al database.

## Descrizione
### backend: PHP
    
    settings.php
In produzione (```$production = true```) nasconde
gli errori di PHP per permettere ai client web
di interpretare correttamente il JSON.

    db_utils.php
Contiene la funzione ```dbconn()``` che si occupa di
leggere le informazioni del file ```credentials.ini```
per connettersi al database.

    data.php
Utilizza ```settings.php``` per nascondere gli errori di PHP
e ```db_utils.php``` per connettersi al database.
A connessione avvenuta (e se la richiesta e' una richiesta GET)
restituisce le ultime 1200 letture (limite scelto per non restituire troppi dati)
in formato JSON

### frontend: index.html, CSS e javascript

    bootstrap.min.css
CSS di bootstrap per aggiungere stile alla pagina
e per renderla responsive.

    Chart.min.js
Libreria Chart.js: permette di creare
i grafici con le quantita' di olio rilevate.

    main.js
Contiene le funzioni necessarie per gestire
le notifiche e i grafici e richiede
via AJAX i dati da ```data.php```.
> La richiesta viene effettuata ogni 10 secondi
> per mantenere aggiornati i dati

    index.html
Pagina restituita al browser: contiene
lo scheletro della pagina, importa
```bootstrap.min.css``` per
migliorare visivamente la pagina web,
importa ```Chart.min.js``` per gestire i grafici
e ```main.js``` per creare e aggiornare i grafici
e creare le notifiche

## Requisiti
* Apache e PHP
* MySQL

## Changelog

**2020-06-01 01_01:** <br>
Primo commit

## Autore
Zenaro Stefano