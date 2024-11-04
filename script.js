let TArticlesChoisis = [];
function init() {
    $.getJSON('articles.json', function(produits) {
        TArticles = produits; 
        const tbody = $('#produits-table-body'); 
        const rows = $.map(TArticles, function(product) {
            return `
                <tr>       
                    <td>${product.designation}</td>
                    <td>${product.prixUnitaire} DH</td>
                    <td>${product.quantite}</td>
                </tr>          
            `;
        }).join(''); 
        tbody.html(rows);
    });
}

$(document).ready(init);

function ajouter() {
    const nomClient = document.getElementById('nomClient').value.trim();
    const adresseClient = document.getElementById('AdresseClient').value.trim();
    const qualite = parseInt(document.getElementById('Qualite').value);
    const choisiPizzaElement = document.getElementById('choisiPizza');
    const pizzaCode = choisiPizzaElement.value;
    const pizzaDesignation = choisiPizzaElement.options[choisiPizzaElement.selectedIndex].text;
    const pizzaPrixUnitaire = parseInt(choisiPizzaElement.options[choisiPizzaElement.selectedIndex].dataset.price);

    const carteBnquaire = document.getElementById('carteBnquaire');
    const typePaiement = document.querySelector('input[name="payeClient"]:checked');

    if (!nomClient || !adresseClient) {
        alert('Le nom du client et l\'adresse sont obligatoires.');
        return false;
    }

    if (isNaN(qualite) || qualite < 1 || qualite > 10) {
        alert('La quantité doit être comprise entre 1 et 10.');
        return false;
    }

    if (typePaiement && typePaiement.value === 'carte banquaire' && !carteBnquaire.value.trim()) {
        alert('Le numéro de la carte bancaire est obligatoire si vous payez par carte.');
        return false;
    }

    const articleChoisi = {
        code: pizzaCode,
        designation: pizzaDesignation,
        prixUnitaire: pizzaPrixUnitaire,
        quantite: qualite,
        prixTotal: pizzaPrixUnitaire * qualite
    };

    TArticlesChoisis.push(articleChoisi);
    afficherArticlesChoisis();
    calculerMontantTotal();

    alert('Article ajouté avec succès!');
    return true;
}

function afficherArticlesChoisis() {
    const articlesTableBody = document.getElementById('produits-table-body');
    articlesTableBody.innerHTML = ''; 

    TArticlesChoisis.forEach(article => {
        const row = `
            <tr>
                <td>${article.designation}</td>
                <td>${article.prixUnitaire} DH</td>
                <td>${article.quantite}</td>
            </tr>
        `;
        articlesTableBody.innerHTML += row;
    });
}

function calculerMontantTotal() {
    const montantTotal = TArticlesChoisis.reduce((total, article) => total + article.prixTotal, 0);
    document.getElementById('montantTotal').value = montantTotal + ' DH';
    document.getElementById('montantTotalTitle').innerText = ` Le montant total est : ${montantTotal} DH`;
}

$(document).ready(() => {
    init();  
});

function gererPaiement() {
    const isCheque = document.getElementById('cheque').checked;
    const numCarteInput = document.getElementById('numCarteBancaire');

    numCarteInput.disabled = isCheque; 
    numCarteInput.style.backgroundColor = isCheque ? 'rgb(37, 33, 33,0.4)' : 'white';
    numCarteInput.value = isCheque ? 'Disabled' : '';
}

function afficherPopup() {
    const detailsCommande = document.getElementById("detailsCommande");

    detailsCommande.innerHTML = `
        <table style="margin-Bottom: 20px;"  class="table">
            <tr>
                <th>Désignation</th>
                <th>Quantité</th>
                <th>Prix Unitaire</th>
            </tr>
            ${TArticlesChoisis.map(article => `
                <tr>
                    <td>${article.designation}</td>
                    <td>${article.quantite}</td>
                    <td>${article.prixUnitaire} DH</td>
                </tr>
            `).join('')}
            <tr>
                <td colspan="2">Total</td>
                <td style="font-weight: bold; color: red;">${TArticlesChoisis.reduce((total, article) => total + article.prixTotal, 0)} DH</td>
            </tr>
        </table>
    `;

    const popup = document.getElementById("popup");
    popup.style.display = "block";
}

function fermerPopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none";
}

function imprimerCommande() {
    window.print();
}
