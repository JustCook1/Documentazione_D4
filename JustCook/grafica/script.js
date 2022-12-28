

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
        document.getElementById("utente").style.display = "block";
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("Email o password errati");
    }
    );
}


//ricerca ricetta
function cercaRicette(){
    //funzione di ricerca
    let risultati = document.getElementById("risultati")
    //estrai i vari campi
    let nomeRicetta = document.getElementById("ricerca_input").value
    let ingredientiLista= Array.prototype.slice.call(document.getElementById("listaIngredienti").children)
    let ingredienti = "http://localhost:8080/cercaRicette/cerca?";
    
    for(let i = 0; i < ingredientiLista.length; i++){
        if(i == 0)
            ingredienti = ingredienti.concat("ingredienti=")

        ingredientiLista[i] = (ingredientiLista[i]).innerHTML
        ingredienti = ingredienti.concat(ingredientiLista[i])
        //aggiungi virgola
        if(i != ingredientiLista.length -1)
            ingredienti = ingredienti.concat(",")
    }

    //filtri da aggiungere a html
    console.log("ricetta: " + nomeRicetta)
    console.log(ingredientiLista)

    let richiesta = new XMLHttpRequest();
    richiesta.onload = reqListener;
    richiesta.onerror = reqError;
    richiesta.open('get', "http://localhost:8080/cercaRicette/cerca?ingredienti=" + ingredienti +"&nome=Tiramisù", true);
    richiesta.send();

    function reqListener() {
        let data = JSON.parse(this.responseText);
        console.log(data);
    }
    
    function reqError(err) {
        console.log('Fetch Error :-S', err);
    }
};


