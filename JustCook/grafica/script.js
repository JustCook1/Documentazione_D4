
let account
//1: controlla se l'utente è loggato
//2: se l'utente è loggato controlla se ha una dispensa
//3: se l'utente ha una dispensa carica gli ingredienti
//4: se l'utente non ha una dispensa crea una nuova dispensa e carica gli ingredienti
//5: se l'utente non è loggato mostra un messaggio di errore
function aggiungiAllaDispensa() {

    //alcune cose da tenere a mente
    const nome = document.getElementById("inputDispensa").value;
    const quantita = document.getElementById("quantita").value;
    //se il tipo di ingrediente è grammi o ml aggiungere il tipo e chiamare la funzione aggiungiIngredienteDispensa
    //per aggiornare la dispensa
    //nella lista andrebbe anche aggiunta una box per modificare la quantità
}

//cerca in database un ingrediente per nome e lo aggiunge alla lista ingredienti dispensa
function cercaIngrediente() {
    const listaIngredienti = document.getElementById("listaIngredienti");
    const lista = document.createDocumentFragment();
    var nome = document.getElementById("inputDispensa").value;
    var url = "http://localhost:8080/ingrediente/" + nome;
    fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        //body: JSON.stringify({nome : nome})
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) throw new Error(data.error);
        console.log(data);
        //tutta questa parte andrà messa in una funzione che aggiunge un ingrediente alla dispensa
        let li = document .createElement('li');
        let name = document.createElement ('span');
        name.innerHTML =  data.nome;
        li.appendChild(name);
        lista.appendChild(li);
        listaIngredienti.appendChild(lista);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("Ingrediente non trovato");
    }
    );

}

//login
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const url = "http://localhost:8080/controllers/authentications";
    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username : username, password : password})
    })
    .then(response => response.json())
    .then(data => {
        if(data.error || data.success == false) throw new Error(data.error);
        console.log(data);
        document.getElementById("login").style.display = "none";
        document.getElementById("nomeUtente").innerHTML = username;
        account = username
        document.getElementById("utente").style.display = "block";
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("Email o password errati");
    }
    );
}


//funzioni per la selezione dei filtri
function seleziona(id){
    let bottone = document.getElementById(id)
    if(bottone.style.backgroundColor == "green")
        bottone.style.backgroundColor = "white"
    else
        bottone.style.backgroundColor = "green"

}

//ricerca ricetta
function cercaRicette(){
    //funzione di ricerca
    let risultati = document.getElementById("risultati")

    //svuota campo risultati
    while(risultati.children.length!= 0){
        risultati.removeChild(risultati.lastChild)
    }

    //estrai i vari campi
    let nomeRicetta = "nome=" + document.getElementById("ricerca_input").value
    let ingredientiLista= Array.prototype.slice.call(document.getElementById("listaIngredienti").children)
    let ingredienti = "ingredienti=";
    
    for(let i = 0; i < ingredientiLista.length; i++){

        ingredientiLista[i] = (ingredientiLista[i]).innerHTML
        ingredienti = ingredienti.concat(ingredientiLista[i])
        //aggiungi virgola
        if(i != ingredientiLista.length -1)
            ingredienti = ingredienti.concat(",")
    }

    //prendi i filtri
    let filtri = "filtri=";
    let refFiltri =  Array.prototype.slice.call(document.getElementById("filtri").children)

    for(let i = 0; i < refFiltri.length; i++){
        let sottoFiltri =  Array.prototype.slice.call(refFiltri[i].children)

        for(let j = 0; j < sottoFiltri.length; j++){
            if(sottoFiltri[j].style.backgroundColor == "green"){ // se il bottone è selezionato
                //controlla se appendere 'senza'
                id = sottoFiltri[j].innerHTML
                if(id == "uova" || id == "latte" || id == "glutine" || id == "frutta secca")
                    id = ("senza " + id)
                
                if(filtri == "filtri=")
                    filtri = filtri.concat(id)
                else
                    filtri = filtri.concat(","+id)
            }

        }

    }
    //aggiungi anche lo slider dell'attrezzatura
    if(document.getElementById("sliderAttrezzatura").value == 1){
        filtri = filtri.concat(",attrezatura speciale")
    }

    let link = "http://localhost:8080/cercaRicette/cerca?";
    if(ingredienti != "ingredienti="){
        link = link.concat(ingredienti)
    
        if(filtri != "filtri=")
            link = link.concat("&"+filtri)

        if(nomeRicetta != "nome=")
            link = link.concat("&"+nomeRicetta)
    }

    //filtri da aggiungere a html
    let richiesta = new XMLHttpRequest();
    richiesta.onload = reqListener;
    richiesta.onerror = reqError;
    richiesta.open('get', link, true);
    richiesta.send();

    function reqListener() {
        let data = JSON.parse(this.responseText);

        //converti i dati ricevuti in risultati
        for(let k = 0; k < data.length; k++){
            let link_ris = document.createElement("a")
            link_ris.href = "#"
            link_ris.onclick = function(){
                link_ris.href = "ricetta.html?nome=" + data[k].nome + 
                "&autore=" + data[k].autore +"&account=" + account
                console.log(document.getElementById("nomeUtente").innerHTML)
            }
            
            let ris = document.createElement("div")
            ris.innerHTML = data[k].nome + "\ndi " + data[k].autore

            //converti statistiche
            let rating = document.createElement("div")
            rating.innerHTML = data[k].rating + "stelle"
            let stats = document.createElement("div")
            let tempo = data[k].statistica[0] + " min", costo, difficoltà

            if(data[k].statistica[1] == 1)
                costo = "basso"
            else if(data[k].statistica[1] == 2)
                costo == "medio"
            else
                costo == "alto"

            if(data[k].statistica[2] == 1)
                difficoltà = "basso"
            else if(data[k].statistica[2] == 2)
                difficoltà == "medio"
            else
                difficoltà == "alto"

            stats.innerHTML =  tempo + " " + costo + " " + difficoltà

            ris.appendChild(rating)
            ris.appendChild(stats)

            link_ris.appendChild(ris)
            risultati.appendChild(link_ris)
        }
    }
    
    function reqError(err) {
        console.log('Fetch Error :-S', err);
    }
};


