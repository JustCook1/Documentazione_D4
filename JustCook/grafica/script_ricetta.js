let account, ricetta, autore

const comp = function completa(){    
    let richiesta = new XMLHttpRequest();
    richiesta.onload = reqListener;
    richiesta.onerror = reqError;
    richiesta.open('patch', link, true);
    let body = {
        "ricetta": ricetta,
        "autore": autore,
        "account": account
    };
    richiesta.send(body);
    
    function reqListener() {
        let data = JSON.parse(this.responseText);
        //gestisci messaggi
    }
    
    function reqError(err) {
        console.log('Fetch Error :-S', err);
    }
            

}

const gestisciPreferiti = function preferiti(){
    let bottone = document.getElementById("pref")

    if(bottone.innerHTML == "aggiungi ai preferiti"){
        let link = "http://localhost:8080/aggiungiAiPreferiti"
        let richiesta = new XMLHttpRequest();
        richiesta.onload = reqListener;
        richiesta.onerror = reqError;
        richiesta.open('patch', link, true);
        let body = {
            "ricetta": ricetta,
            "autore": autore,
            "account": account
        };
        richiesta.send(body);
        
        function reqListener() {
            let data = JSON.parse(this.responseText);
        }
        
        function reqError(err) {
            console.log('Fetch Error :-S', err);
        }
        
        bottone.innerHTML == "togli dai preferiti"
    }else{
        let link = "http://localhost:8080/togliDaiPreferiti"
        let richiesta = new XMLHttpRequest();
        richiesta.onload = reqListener;
        richiesta.onerror = reqError;
        richiesta.open('patch', link, true);
        let body = {
            "ricetta": ricetta,
            "autore": autore,
            "account": account
        };
        richiesta.send(body);
        
        function reqListener() {
            let data = JSON.parse(this.responseText);
        }
        
        function reqError(err) {
            console.log('Fetch Error :-S', err);
        }
        bottone.innerHTML = "aggiungi ai preferiti"
    }
            

}


function riempiCampi() {
    let url = document.location.href
    if(url.split("?")[1] != null){
        let params = url.split("?")[1]
        account = params.split("account=")[1]

        //parametri si trovano nella forma: nome=Tirmisù, passaggi = 
        let richiesta = new XMLHttpRequest();
        richiesta.onload = reqListener;
        richiesta.open('get', "http://localhost:8080/trovaRicetta/params?" + params, true);
        richiesta.send();

        function reqListener() {
            let data = JSON.parse(this.responseText);
            data = data[0]
            ricetta = data.nome, autore = data.autore

            let titoloEl = document.getElementById('titolo')
            titoloEl.innerHTML = decodeURI(data.nome) + " di " + data.autore;

            //bottone completa
            let completa = document.createElement("button")
            completa.innerHTML = "completa"
            completa.onclick = comp
            if(account == "undefined")
                completa.disabled = true
            completa.id = "completa"
            titoloEl.appendChild(completa)

            //bottone 
            let pref = document.createElement("button")
            pref.innerHTML = "aggiungi ai preferiti"
            pref.onclick = gestisciPreferiti
            if(account == "undefined")
                pref.disabled = true
            pref.id = "pref"
            titoloEl.appendChild(pref)

            document.getElementById("rating").innerHTML = "rating: " + data.rating + " stelle"    

            let costo, diff
            if(data.statistica[1] == 1)
                costo = "basso"
            else if(data.statistica[1] == 2)
                costo = "medio"
            else
                costo = "alto"
            
            if(data.statistica[2] == 1)
                diff = "bassa"
            else if(data.statistica[2] == 2)
                diff = "media"
            else
                diff = "alta"

            document.getElementById('stats').innerHTML =  "tempo: " + data.statistica[0] + " min" + " costo: " + costo + " difficoltà: " + diff
            document.getElementById('desc').innerHTML = data.descrizione

            let listaIng = document.getElementById('ingredienti')
            for(let i = 0; i < data.ingredienti.length; i++){
                let li = document.createElement("li")
                li.innerHTML = data.ingredienti[i].nome + ": " + data.quantità[i] + data.ingredienti[i].tipo
                listaIng.appendChild(li)
            }

            let listaPass = document.getElementById('passaggi')
            for(let i = 0; i < data.passaggi.length; i++){
                let div = document.createElement("div")
                div.innerHTML = (i +1) + ". " + data.passaggi[i]
                listaPass.appendChild(div)
            }

            

        }
    

    
        //nascondi parametri*/
    }
}
