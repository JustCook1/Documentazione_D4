let accountAtt, ricettaAtt, autoreAtt

const comp = function completa(){    
    let link = "http://localhost:8080/completaRicetta"
    fetch(link, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            ricetta: ricettaAtt,
            autore: autoreAtt,
            account: accountAtt}
        )
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) throw new Error(data.error);
        alert("Ok: ricetta completata")
    })
    .catch((error) => {
        let string = "" + error
        alert(string.split("Error:")[1]);
    }
    );
            

}

const gestisciPreferiti = function preferiti(){
    let bottone = document.getElementById("pref")

    if(bottone.innerHTML == "aggiungi ai preferiti"){
        let link = "http://localhost:8080/aggiungiAiPreferiti"
        fetch(link, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                ricetta: ricettaAtt,
                autore: autoreAtt,
                account: accountAtt}
            )
        })
        .then(response => response.json())
        .then(data => {
            if(data.error) throw new Error(data.error);
            alert("Ok: ricetta aggiunta ai preferiti");
            
        })
        .catch((error) => {
            let string = "" + error
            alert(string.split("Error:")[1]);
        }
        );
        
        bottone.innerHTML = "togli dai preferiti"
    }else{
        let link = "http://localhost:8080/togliDaiPreferiti"
            
        fetch(link, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                ricetta: ricettaAtt,
                autore: autoreAtt,
                account: accountAtt}
            )
        })
        .then(response => response.json())
        .then(data => {
            if(data.error) throw new Error(data.error);
            alert("Ok: ricetta tolta dai preferiti");
            
        })
        .catch((error) => {
            let string = "" + error
            alert(string.split("Error:")[1]);
        }
        );
        bottone.innerHTML = "aggiungi ai preferiti"
    }
            

}


function riempiCampi() {
    let url = document.location.href
        let params = url.split("?")[1]
        accountAtt = params.split("account=")[1]

        //parametri si trovano nella forma: nome=Tirmisù, passaggi = 
        let richiesta = new XMLHttpRequest();
        richiesta.onload = reqListener;
        richiesta.open('get', "http://localhost:8080/trovaRicetta/params?" + params, true);
        richiesta.send();

        function reqListener() {
            let data = JSON.parse(this.responseText);
            data = data[0]
            ricettaAtt = data.nome, autoreAtt = data.autore

            let titoloEl = document.getElementById('titolo')
            titoloEl.innerHTML = decodeURI(data.nome) + " di " + data.autore;

            //bottone completa
            let completa = document.createElement("button")
            completa.innerHTML = "completa"
            completa.onclick = comp
            if(accountAtt == "undefined")
                completa.disabled = true
            completa.id = "completa"
            titoloEl.appendChild(completa)

            //bottone 
            let pref = document.createElement("button")
            pref.innerHTML = "aggiungi ai preferiti"
            pref.onclick = gestisciPreferiti
            if(accountAtt == "undefined")
                pref.disabled = true
            pref.id = "pref"
            titoloEl.appendChild(pref)

            //rating::
            //prendi il rating della ricetta globale
            let ratingGlobale = data.rating

            if(accountAtt != "undefined"){
                //scopri se c'è un rating precedentemente dato
                let link = "http://localhost:8080/infoRatingDati/params?ricetta=" + ricettaAtt + "&autore=" + autoreAtt +"&account=" + accountAtt
                
                fetch(link, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                })
                .then(response => response.json())
                .then(data => {
                    let srcImg, limite;
                    if(data == -1){
                        srcImg = "img/star_yellow.png"
                        limite = ratingGlobale
                    }else{
                        srcImg = "img/star_orange.png"
                        limite = data
                    }

                    for(let i = 0; i < 5; i++){
                        let img = document.createElement("IMG")
                        if(limite > i)
                            img.src = srcImg
                        else
                            img.src = "img/star_yellow%20_transp.png"
        
                        img.width = "20"
                        img.alt= "star "
                        img.onclick = function(event){
                            let ratingCont = document.getElementById("rating")
                            let ratingCliccato = -1
                            do{
                                ratingCliccato++;
                            }while(ratingCont.childNodes[ratingCliccato] != event.target);
                            
                            ratingCliccato++;

                            //invia rating
                            let link = "http://localhost:8080/aggiungiRating"
                                
                            fetch(link, {
                                method: 'PATCH',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({
                                    ricetta: ricettaAtt,
                                    autore: autoreAtt,
                                    account: accountAtt,
                                    rating: ratingCliccato
                                }
                                )
                            })
                            .then(response => response.json())
                            .then(data => {
                                if(data.error) throw new Error(data.error);
                                alert("Ok: nuovo rating aggiunto");
                                let i = -1
                                do{
                                    i++;
                                    ratingCont.childNodes[i].src = "img/star_orange.png"

                                }while(ratingCont.childNodes[i] != event.target);
                                i++;
                                while(i < ratingCont.childNodes.length){
                                    ratingCont.childNodes[i].src = "img/star_yellow%20_transp.png"
                                    i++;
                                }
                                
                            })
                            .catch((error) => {
                                let string = "" + error
                                alert(string.split("Error:")[1]);
                            }
                            );
                        }
                        document.getElementById("rating").appendChild(img)
                    }
                    
                });
                
            }else{
                //non si può cambiare rating
                for(let i = 0; i < 5; i++){
                    let img = document.createElement("IMG")
                    //rating Globale
                    if(ratingGlobale > i)
                        img.src = "img/star_yellow.png"
                    else
                        img.src = "img/star_yellow%20_transp.png"
    
                    img.width = "20"
                    img.alt= "star "
                    document.getElementById("rating").appendChild(img)

                }
            }

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
                li.innerHTML = data.ingredienti[i].nome + ": " + data.quantita[i] + data.ingredienti[i].tipo
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
