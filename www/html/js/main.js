/**
 *  gestisce notifiche e aggiornamento grafici della pagina index.html
*/

var shownErrors = []; // contiene id errori gia' visualizzati
const oilLimit = 100; // visualizza alert se x > oilLimit


function makeNotification(type, text) {
    /**
     * Crea una notifica.
     *
     * La funzione crea un div di classe alert e con il
     * colore alert-<type> che contiene il testo <text>
     *
     * @param {string} type tipo di alert
     * @param {string} text dettagli della notifica
     */

    // definisci classi e ruolo dell'elemento
    var classes = "alert alert-" + type;
    var role = "alert";

    // crea un div impostando le classi e il ruol
    var div = document.createElement("div");
    div.classList = classes;
    div.setAttribute("role", "alert");

    // aggiungi il testo alla notifica
    div.textContent = text;

    // aggiungi la notifica all'elemento delle notifiche
    var notificationsDiv = document.getElementById("notifications");
    notificationsDiv.appendChild(div);
}


function makeGraphTitle(description, id) {
    /**
     * Crea il titolo di un grafico.
     *
     * La funzione crea un h2 con il testo "sensore '<description>' (id '<id>')"
     * e lo inserisce nell'elemento dei grafici
     *
     * @param {string} description descrizione del sensore
     * @param {integer|string} id identificativo del sensore
     */

    var h2 = document.createElement("h2");
    h2.textContent = "sensore '" + description + "' (id '" + id + "')"

    var graphsDiv = document.getElementById("graphs");
    graphsDiv.appendChild(h2)
}


function makeGraph(timestamps, data) {
    /**
     * Crea un grafico.
     *
     * La funzione crea un h2 con il testo "sensore '<description>' (id '<id>')"
     * e lo inserisce nell'elemento dei grafici
     *
     * @param {array[...integer]} timestamps array di timestamp
     * @param {array[...float]} data array di dati
     */

    // crea oggetto con i dati
    var chartoil = {
        labels: timestamps, // timestamp asse x
        datasets: [{
            backgroundColor: '#6c757d', // colore sfondo grafico
            borderColor: 'rgba(c6, c8, ca, 0.75)', // colore bordo del grafico
            hoverBackgroundColor: '#6c757d', // colore sfondo on hover ("passandoci sopra")
            hoverBorderColor: 'rgba(c6, c8, ca, 1)', // colore bordo on hover  ("passandoci sopra")
            data: data // quantita' olio asse y
        }],
    };

    // crea elemento che conterra' i dati
    var ctxoil = document.createElement("canvas");

    // usa chart.js per creare il grafico nel nuovo elemento
    var oilGraph = new Chart(ctxoil, { // nel canvas ctxoil creo grafico
        type: 'line', // tipo "linea"
        data: chartoil, // dati olio
        options: {
            responsive: true, // si adatta allo schermo
            maintainAspectRatio: true, // rispetta altezza del div contenente il canvas
            legend: {
                display: false // Toglie la legenda ( non visualizza informazioni utili... )
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem) {
                        return tooltipItem.yLabel; // toglie legenda
                    }
                }
            },
            animation: {
                duration: 0 // "disabilita" le animazioni (brutto effetto "jump" del grafico a causa update del grafico frequente)
            }
        }
    });

    oilGraph.update(); // Per aggiornare i dati del grafico ad ogni richiesta

    // aggiungi il grafico all'elemento dei grafici
    var graphsDiv = document.getElementById("graphs");
    graphsDiv.appendChild(ctxoil)
}


function emptyGraphs() {
    /**
     * Elimina elementi nell'elemento dei grafici.
     *
     * La funzione elimina il div dei grafici
     * e lo ricrea
     *
     */
    // seleziona l'elemento dei grafici e eliminalo
    var graphsDiv = document.getElementById("graphs");
    graphsDiv.remove();

    // crea un div con l'id "graphs"
    var graphsDiv = document.createElement("div");
    graphsDiv.id = "graphs";

    // aggiungi il div all'elemento principale della pagina
    document.getElementById("main").appendChild(graphsDiv);
}


function emptyNotifications() {
    /**
     * Elimina elementi nell'elemento delle notifiche.
     *
     * La funzione elimina il div delle notifiche
     * e lo ricrea inserendolo subito dopo l'elemento 
     * del titolo della pagina
     *
     */
    var notificationsDiv = document.getElementById("notifications");
    notificationsDiv.remove();

    var notificationsDiv = document.createElement("div");
    notificationsDiv.id = "notifications";

    insertAfter(notificationsDiv, document.getElementById("title"))
}


function insertAfter(newNode, referenceNode) {
    /**
     * Inserisce l'elemento <newNode> dopo <referenceNode>.
     *
     * La funzione ricava l'elemento che contiene <referenceNode>
     * e inserisce l'elemento <newNode> 
     * prima dell'elemento successivo a <referenceNode>
     *
     * @param {Node} newNode elemento da inserire dopo <referenceNode>
     * @param {Node} referenceNode elemento di riferimento
     */
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


function timestampToDate(timestamp) {
    /** 
     * Questa funzione converte il timestamp passato come parametro in data "umana" americana
     *
     * @param {integer} timestamp Timestamp con unita' di misura in secondi
     * @return {string} dformat Data in formato "MM/DD/YYYY hh:mm"
     * @since 01_01
     */


    Number.prototype.padLeft = function (base, chr) {
        /** 
         * aggiunge tanti chr (o "0") a sinistra quanti indica "l'esponente" di base (default "10" -> xx)
         * (es. 6 minuti -> 06)
         * 
         * @param {integer} base numero 10^(x + 1) che indica quanti chr mettere davanti al numero
         * @param {string} chr carattere da aggiungere a sinistra del numero
         * @return {string} padded_string Stringa contenente numero avente a sinistra x + 1 "chr" (base = 10^(x+1)) 
         *   
         * @example 
         * // restituisce "01"
         * (1).padLeft()
         * @example
         * //restituisce "002"
         * (2).padLeft(100)
         * @example
         * //restituisce "xx3"
         * (3).padLeft(100, "x")
         * @since 01_01
         */

        var len = (String(base || 10).length - String(this).length) + 1;
        var padded_string = len > 0 ? new Array(len).join(chr || '0') + this : this;
        return padded_string;
    }


    var d = new Date(timestamp * 1000) // conversione timestamp a data ( timestamp [s] -> [ms] )

    var dformat = [(d.getMonth() + 1).padLeft(), // getMonth()    ottiene mese   ( .padLeft() due digit, mm)
            d.getDate().padLeft(), // getDate()     ottiene giorno ( .padLeft() due digit, dd)
            d.getFullYear()
        ].join('/') + // getFullYear() ottiene anno e questi vengono uniti da '/' -> mm/dd/yyyy
        ' ' + // aggiungi spazio tra data e ore
        [d.getHours().padLeft(), // getHours()    ottiene ore ( .padLeft() due digit, hh)
            d.getMinutes().padLeft()
        ].join(':'); // getMinutes()  ottiene minuti e questi vengono uniti da ':' -> hh:mm 

    return dformat; // risultato finale "MM/DD/YYYY hh:mm"
}


// crea oggetto per fare richiesta AJAX
var xhttp = new XMLHttpRequest();

// prepara AJAX a gestire le risposte
xhttp.onreadystatechange = function () {
    // se la richiesta e' terminata (readyState 4) e con successo (200)
    if (this.readyState == 4 && this.status == 200) {

        // svuota l'array degli errori visualizzati e elimina le notifiche
        shownErrors = []
        emptyNotifications()

        // interpreta la risposta come JSON
        var obj = JSON.parse(this.responseText);
        var data = obj.data;

        // inizializza array con le letture dei sensori
        var sensors_readings = []

        // per ogni lettura ricavata dalla richiesta AJAX...
        for (let index = 0; index < data.length; index++) {
            // memorizza la singola lettura
            const reading = data[index];

            // ricava il timestamp (e ottiene la data), il dato di quantita' d'olio (come float),
            // l'identificativo del sensore e la descrizione del sensore
            const reading_timestamp = timestampToDate(parseInt(reading.tstamp));
            const reading_oildata = parseFloat(reading.oil_data);
            const reading_sensorid = reading.sensor_id;
            const reading_sensordesc = reading.sensor_description;

            // inizializza a falso il fatto che il sensore esista nell'array sensors_readings
            var sensor_exists = false;

            // per ogni sensore in sensors_readings...
            for (let i = 0; i < sensors_readings.length; i++) {
                // memorizza l'oggetto con le informazioni del sensore
                const sensor_readings = sensors_readings[i];

                // se l'id del sensore della lettura e' presente nell'array dei sensori...
                if (sensor_readings.id == reading_sensorid) {
                    // memorizza il timestamp e la data
                    sensor_readings.timestamps.push(reading_timestamp);
                    sensor_readings.oil_data.push(reading_oildata);

                    // memorizza che il sensore esiste
                    sensor_exists = true;
                }
            }

            // se il sensore non esiste in sensors_readings: aggiungilo
            if (!sensor_exists) {
                sensors_readings.push({
                    "id": reading_sensorid,
                    "description": reading_sensordesc,
                    "timestamps": [reading_timestamp],
                    "oil_data": [reading_oildata]
                })
            }
        }

        // svuota i grafici per creare i grafici aggiornati
        emptyGraphs()

        // se la notifica di successo recupero dati non e' presente, creala
        if (document.getElementsByClassName("data-success").length == 0) {
            makeNotification("primary data-success", "Dati ottenuti con successo");
        }

        // per ogni sensore (con le proprie letture)...
        for (let i = 0; i < sensors_readings.length; i++) {
            const sensor_readings = sensors_readings[i];

            // crea il titolo del grafico
            makeGraphTitle(sensor_readings.description, sensor_readings.id)
            // crea il grafico
            makeGraph(sensor_readings.timestamps, sensor_readings.oil_data)

            // se il valore massimo delle letture supera il limite, crea notifica di limite superato
            if (Math.max.apply(Math, sensor_readings.oil_data) > oilLimit) {
                makeNotification("danger", "Superato il limite olio (nelle ultime 1200 letture) sul sensore '" + sensor_readings.description + "' (id '" + sensor_readings.id + "')");
            }
        }

    }
    // se la richiesta e' terminata (readyState 4) e senza successo
    else if (this.readyState == 4 && this.status != 200) {
        // togli tutte le notifiche (per togliere eventuali notifiche di successo)
        emptyNotifications();

        // interpreta la risposta JSON
        var obj = JSON.parse(this.responseText);
        var errors = obj.errors;

        // per ogni errore...
        for (let index = 0; index < errors.length; index++) {
            const error = errors[index];

            // se una notifica di quel errore NON e' ancora visualizzata... visualizzala
            if (!shownErrors.includes(error.id)) {
                shownErrors.push(error.id)
                makeNotification("warning", error.message + " (id: '" + error.id + "')");
            }
        }
    }
};


// apri la richiesta GET alla pagina data.php in modalita' asincrona e invia la richiesta
xhttp.open("GET", "data.php", true);
xhttp.send();

// aspetta 10 secondi, esegui le istruzioni, ripeti...
setInterval(function () {
    // apri la richiesta GET alla pagina data.php in modalita' asincrona e invia la richiesta
    xhttp.open("GET", "data.php", true);
    xhttp.send();

    // per evitare che la pagina ritorni in alto occorre garantire che la altezza resti la stessa
    // nel momento in cui i grafici vengono cancellati per poter essere aggiornati
    var clientHeight = 0
    clientHeight += document.getElementById("title").clientHeight;
    clientHeight += document.getElementById("notifications").clientHeight;
    clientHeight += document.getElementById("graphs").clientHeight;
    clientHeight += 20;

    // imposta l'altezza calcolata
    document.getElementById("main").style.height = clientHeight + "px";

}, 10000);