function cercaIngrediente() {
    var nome = document.getElementById("inputDispensa").value;
    var url = "http://localhost:3000/ingrediente/" + nome;
    fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nome : nome})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById("lista").innerHTML = data.nome;
    })
    .catch((error) => {
        console.error('Error:', error);
    }
    );

}