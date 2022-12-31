

//TODO a getDispensa e aggiungiIngrediente si può aggiungere i tasti per modificare e eliminare gli ingredienti 
//andrebbe aggiunto il tasto nelle liste


//funzione che cerca un ingrediente nel database e ne l'id come stringa
function cercaIngrediente(nome) {
    return new Promise((resolve, reject) => {
        var url = "http://localhost:8080/ingrediente/" + nome;
        fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            if(data.error) throw new Error(data.error);
            console.log(data);
            resolve(data._id);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("Ingrediente non trovato");
            reject(error);
        }
        );
    });
}

//login
async function login() {
    let nomeUtente = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if(username == null || username == "" || password == null || password == ""){
        alert("Inserisci email e password");
        return;
    }
    
    const url = "http://localhost:8080/login";
    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username : nomeUtente, password : password})
    })
    .then(response => response.json())
    .then(data => {
        if(data.error || data.success == false) throw new Error(data.error);
        console.log(data);
        document.getElementById("login").style.display = "none";
        document.getElementById("nomeUtente").innerHTML = nomeUtente;
        document.getElementById("utente").style.display = "block";
        getDispensa(nomeUtente);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("Email o password errati");
    }
    );
}

//crea una nuova dispensa per l'utente
//ritorna true se la dispensa è stata creata, false se esiste già
async function nuovaDispensa(username) {
    
    const url = "http://localhost:8080/dispensa";
    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nome : username})
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) throw new Error(data.error);
        
        console.log(data);
        return true;
        
    })
    .catch((error) => {
        return false;
    }
    );
}

//aggiunge un ingrediente alla dispensa
async function aggiungiIngrediente() {
    let username = document.getElementById("nomeUtente").textContent;
    console.log("username: " + username);
    const ingrediente = document.getElementById("inputDispensa").value;
    const quantita = document.getElementById("quantita").value;

    if(ingrediente == null || ingrediente == ""){
        alert("Inserisci un ingrediente");
        return;
    }
    
    //console.log("l'attuale quantità è: " + quantita);

    console.log("sono in aggiungiIngrediente con account " + username);

    //aspetto di ricevere l'id dell'ingrediente
    let ingredienteId;
    await cercaIngrediente(ingrediente).then(id => {
        ingredienteId = id;
        console.log(ingredienteId);
    });

    //controllo che l'utente non inserisca una quantità non valida
    if(quantita == null || quantita <= 0){
        alert("Inserisci una quantità valida");
        return;
    }

    //controllo che l'utente abbia una dispensa
    nuovaDispensa(username);

    

    //console.log("qui sta l'id dell'ingrediente prima di entrae nel fetch: " + ingredienteId);
    const url = "http://localhost:8080/dispensa/aggiungiIngrediente/";
    fetch(url, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nome : username, idIngrediente : ingredienteId, quantita : quantita})
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) throw new Error(data.error);
        else{
            console.log(data);
            //cerco l'indice dell'ingrediente in data.ingredienti
            //questo indice mi serve per aggiornare la quantità dell'ingrediente nella lista html
            let index = -1;
            for(let i = 0; i < data.ingredienti.length; i++){
                if(data.ingredienti[i] == ingredienteId){
                    index = i;
                    break;
                }
            }

            //controllo se l'ingrediente è già presente nella lista
            const listItems = document.querySelectorAll('#listaIngredienti li');
            let presente = false;
            for (let i = 0; i < listItems.length; i++) {
                if(listItems[i].textContent.includes(ingrediente)) presente = true;
            }
            //aggiungo l'ingrediente alla lista html se non è già presente
            if(!presente){
                const listaIngredienti = document.getElementById("listaIngredienti");
                let li = document .createElement('li');
                li.innerHTML =  ingrediente;
                listaIngredienti.appendChild(li);

                //aggiungo la quantità alla lista html listaQuantita
                const listaQuantita = document.getElementById("listaQuantita");
                const listaQ = document.createDocumentFragment();
                let liQ = document .createElement('li');
                let Q = document.createElement ('span');
                Q.innerHTML =  data.quantita[index];
                console.log(ingrediente)
                liQ.appendChild(Q);
                listaQ.appendChild(liQ);
                listaQuantita.appendChild(listaQ);
                
            }
            else{
                //aggiorno la quantità dell'ingrediente nella lista html listaQuantita
                const listItems = document.querySelectorAll('#listaQuantita li');
                const listItems2 = document.querySelectorAll('#listaIngredienti li');
                for (let i = 0; i < listItems.length; i++) {
                    if(listItems2[i].textContent.includes(ingrediente)) listItems[i].textContent = data.quantita[index];
                }
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        return false;
    }
    );
}

//get dispensa e la stampa nella lista
function getDispensa(username) {

    console.log("entro in getDispensa");
    console.log("username: " + username);
    
    //controllo che l'utente abbia una dispensa e se non ce l'ha la creo
    console.log(nuovaDispensa(username));

    const url = "http://localhost:8080/dispensa/" + username;
    fetch (url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) throw new Error(data.error);
        console.log(data);
        const vettoreQuantita = data.quantita;
        const listaIngredienti = document.getElementById("listaIngredienti");
        const listaQuantita = document.getElementById("listaQuantita");
        const listaQ = document.createDocumentFragment();
        for(let i = 0; i < data.ingredienti.length; i++){
            
            //GET INGREDIENTE per id per prendere il nome
            const url = "http://localhost:8080/ingrediente/id/" + data.ingredienti[i];
            fetch(url, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => response.json())
            .then(data => {
                if(data.error) throw new Error(data.error);
           
                let li = document .createElement('li');
                li.innerHTML =  data.nome;
                listaIngredienti.appendChild(li);

                let liQ = document .createElement('li');
                let Q = document.createElement ('span');
                Q.innerHTML =  vettoreQuantita[i];
                liQ.appendChild(Q);
                listaQ.appendChild(liQ);
                listaQuantita.appendChild(listaQ);
            })
            .catch((error) => {
                console.error('Error:', error);
                return false;
            }
            );

        }
    })
    .catch((error) => {
        console.error('Error:', error);
        return false;
    }
    );
}

//cancella un ingrediente dalla dispensa
async function cancellaIngrediente() {
    let username = document.getElementById("nomeUtente").textContent;
    let ingrediente = document.getElementById("inputCancella").value;

    //usa cercaIngrediente(nome) per trovare l'id dell'ingrediente
    let ingredienteId;
    await cercaIngrediente(ingrediente).then(id => {
        ingredienteId = id;
        console.log(ingredienteId);
    });

    const url = "http://localhost:8080/dispensa/eliminaIngrediente/";
    fetch(url, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nome : username, idIngrediente : ingredienteId})
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) throw new Error(data.error);
        console.log(data);
        //cancello l'ingrediente dalla lista html
        const listItems = document.querySelectorAll('#listaIngredienti li');
        const listItems2 = document.querySelectorAll('#listaQuantita li');
        for (let i = 0; i < listItems.length; i++) {
            if(listItems[i].textContent.includes(ingrediente)){
                listItems[i].remove();
                listItems2[i].remove();
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        return false;
    }
    );
}



//--------------^GB-------------vDC--------------------------------------------


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
    let risultatiCont = document.getElementById("risultati")

    //svuota campo risultati
    while(risultatiCont.children.length!= 0){
        risultatiCont.removeChild(risultatiCont.lastChild)
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
    console.log(ingredienti)

    if(ingredienti != "ingredienti="){
        link = link.concat(ingredienti)
    
        if(filtri != "filtri=")
            link = link.concat("&"+filtri)

        if(nomeRicetta != "nome=")
            link = link.concat("&"+nomeRicetta)
    }
    console.log(link)

    //filtri da aggiungere a html
    let richiesta = new XMLHttpRequest();
    richiesta.onload = reqListener;
    richiesta.onerror = reqError;
    richiesta.open('get', link, true);
    richiesta.send();

    function reqListener() {
        let data = JSON.parse(this.responseText);

        //converti i dati ricevuti in risultatià
        let arrayRisultati = [];

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
                difficoltà = "bassa"
            else if(data[k].statistica[2] == 2)
                difficoltà == "media"
            else
                difficoltà == "alta"

            stats.innerHTML =  tempo + " " + costo + " " + difficoltà

            ris.appendChild(rating)
            ris.appendChild(stats)

            link_ris.appendChild(ris)
            //aggiungi link_ris a un array e poi li ordini
            arrayRisultati.push(link_ris)
        }

        //ordina i risultati
        //1. prendi il filtro d'ordine
        if(document.getElementById("tempo").checked)
            arrayRisultati.sort(ordinaTempo)
        else if(document.getElementById("costo").checked)
            arrayRisultati.sort(ordinaCosto)
        else if(document.getElementById("rating").checked)
            arrayRisultati.sort(ordinaRating)
        else
            arrayRisultati.sort(ordinaDiff)

        for(let i = 0; i < arrayRisultati.length; i++)
            risultatiCont.appendChild(arrayRisultati[i])
    }
    
    function reqError(err) {
        console.log('Fetch Error :-S', err);
    }
};

const ordinaTempo = function oTemp(tempo1, tempo2) {
    // link: {inner + rating - stats}
    let val1, val2
    let stringaval1 = (tempo1.firstChild).lastChild.innerHTML
    val1 = stringaval1.split(" min")[0]
    let stringaval2 = (tempo2.firstChild).lastChild.innerHTML
    val2 = stringaval2.split(" min")[0]

    return val1 -val2;
    
}
const ordinaCosto = function oCosto(a, b) {
    // link: {inner + rating - stats}
    let val1, val2
    let stringaval1 = (a.firstChild).lastChild.innerHTML
    val1 = stringaval1.split(" ")[2]
    let stringaval2 = (b.firstChild).lastChild.innerHTML
    val2 = stringaval2.split(" ")[2]

    return val1 -val2;
    
}
const ordinaDiff = function oDiff(a, b) {
    // link: {inner + rating - stats}
    let val1, val2
    let stringaval1 = (a.firstChild).lastChild.innerHTML
    val1 = stringaval1.split(" ")[3]
    let stringaval2 = (b.firstChild).lastChild.innerHTML
    val2 = stringaval2.split(" ")[3]

    return val1 -val2;
    
}
const ordinaRating = function oRat(a, b) {
    // link: {inner + rating - stats}
    let val1, val2
    let stringaval1 = (tempo1.firstChild).firstChild.innerHTML
    val1 = stringaval1.split(" stelle")[0]
    let stringaval2 = (tempo2.firstChild).firstChild.innerHTML
    val2 = stringaval2.split(" stelle")[0]

    return val1 -val2;
    
}