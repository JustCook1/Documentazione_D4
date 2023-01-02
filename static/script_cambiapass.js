//funzione che cambia la password dell'utente
function cambiaPassword() {
    let email = document.getElementById("mail").value;
    let nuovaPassword = document.getElementById("nuovaPassword").value;

    const url = "https://justcook.herokuapp.com/account/params?indirizzoEmail="+email+"&password="+nuovaPassword;
    fetch(url, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) throw new Error(data.error);
        console.log(data);
        window.location.href = "index.html";
        alert("Password cambiata con successo");
        //document.getElementById("mail").disabled = true;
        //document.getElementById("nuovaPassword").disabled = true;
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("Errore nel cambio della password");
        return false;
    }
    );
}
