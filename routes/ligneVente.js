var express = require('express');
var router = express.Router();
const { database } = require('../config/connection');

/* GET liste */
router.get('/:identifiant', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    database.table('ligne_vente as lv').join([
        {
            table: 'produit as p',
            on: `p.id_produit =  lv.id_produit`

        }
    ])
        .withFields(['lv.id_produit as id_produit',
            'p.libelle as libelleProduit',
            'lv.id_vente as id_vente',
            'lv.quantite as quantite',
            'p.prix_vente as prix_vente',
            'p.prix_achat as prix_achat',
            "p.id_user as id_user"
        ])
        .filter({"p.id_user" : id})
        .sort({ id_vente: .1 })
        .getAll()
        .then(listlignevente => {
            if (listlignevente.length > 0) {
                res.status(200).json({
                    count: listlignevente.length,
                    lignevente: listlignevente
                });
            }
            else {
                res.json({ Message: 'ligne vente vide' })
            }
        }).catch(err => console.log(err))
});

/* rechercher . */
router.get('/recherche/:identifiant', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    console.log(id);
    database.table('ligne_vente as lv')
        .filter({ id_vente: id }).join([
            {
                table: 'produit as p',
                on: `p.id_produit =  lv.id_produit`

            }
        ])
        .withFields(['lv.id_produit as id_produit',
            'p.libelle as libelleProduit',
            'lv.id_vente as id_vente',
            'lv.quantite as quantite',
            'p.prix_vente as prix_vente',
            'p.prix_achat as prix_achat'
        ])
        .getAll().then(vente => {
            if (vente) {
                res.json({ vente });
            } else {
                res.json({ message: `NO VENTE FOUND WITH ID : ${id}` })
                console.log('Bassa oops Barca');
            }
        }).catch(err => console.log(err + " I'm here"));

});


/* Inserer */
router.post('/insertLigneVente', (req, res) => {
    database.table('ligne_vente').insert({
        id_produit: req.body.id_produit,
        id_vente: req.body.id_vente,
        quantite: req.body.quantite
    })
        .then(cool => {
            if (cool) {
                res.json({ message: `success` });
            } else {
                res.json({ message: `cannot insert ` })
            }
        }).catch(err => console.log(`${err} I'm here`));

});


/* Update*/
router.patch('/updateLigneVente', async (req, res) => {
    let id = req.body.id_vente;
    id = parseInt(id);
    console.log(" ici " + id);
    let ligne_vente = await database.table('ligne_vente').filter({ id_vente: id }).get();
    console.log(ligne_vente);
    if (ligne_vente) {
        var id_produit = req.body.id_produit;
        var id_vente = req.body.id_vente;
        var quantite = req.body.quantite;

        database.table('ligne_vente').filter({ id_vente: ligne_vente.id_vente }).update({
            id_produit: id_produit,
            id_vente: id_vente,
            quantite: quantite
        }).then(result => res.json('ligne_vente updated successfully')).catch(err => res.json(err));
    }
});


/* Delete*/

router.post('/deleteLigneVente', (req, res) => {
    let id = req.body.id_vente;
    id = parseInt(id);
    console.log(id);
    database.table('ligne_vente').filter({ id_vente: id })
        .getAll().then(ligne_vente => {
            if (ligne_vente) {
                database.table('ligne_vente').filter({ id_vente: id }).remove()
                    .then(success => {
                        console.log('Supprimé');
                        res.json({ message: `ligne_vente deleted successfuly : ${id}` })
                    })
            } else {
                res.json({ message: `NO ligne_vente FOUND WITH ID : ${id}` })
                console.log('Bassa oops');
            }
        }).catch(err => console.log(err + " I'm here broooo"));

});

/* listeVenteByIdVente*/

router.get('listeVenteByIdVente/:identifiant', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    console.log(id);
    database.table('ligne_vente').filter({ id_vente: id })
        .getAll()
        .then(listLigneVente => {
            if (listLigneVente.length > 0) {
                res.status(200).json({
                    count: listLigneVente.length,
                    ligneVente: listLigneVente
                });
            }
            else {
                res.json({ Message: 'ligne vente vide' })
            }
        }).catch(err => console.log(err))

});

/* CumulVenteByDate*/
router.get('/cumulVenteByDate/:identifiant/&:debut/&:fin', (req, res) => {
    let debut = req.params.debut;
    let fin = req.params.fin;
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    debut.toString(); fin.toString();
    debut = debut.substring(1);
    fin = fin.substring(1);
    if (fin == null || fin == ':') {
        database.query("SELECT libelle, prix_vente, prix_achat, SUM(quantite) as quantite, date_vente FROM ligne_vente "
            + "INNER JOIN vente ON ligne_vente.id_vente = vente.id_vente INNER JOIN produit ON ligne_vente.id_produit = produit.id_produit "
            + " WHERE vente.id_user = "+id+" AND date_vente LIKE '%" + debut + "%' GROUP BY produit.id_produit"
        )
            .then(listLigneVente => {
                if (listLigneVente.length > 0) {
                    res.status(200).json({
                        count: listLigneVente.length,
                        ligneVente: listLigneVente
                    });
                }
                else {
                    res.json({ Message: 'Pas de vente' })
                }
            }).catch(err => console.log(err))
    } else {
        database.query("SELECT libelle, prix_vente, prix_achat, SUM(quantite) as quantite, date_vente FROM ligne_vente "
            + "INNER JOIN vente ON ligne_vente.id_vente = vente.id_vente INNER JOIN produit ON ligne_vente.id_produit = produit.id_produit "
            + "WHERE vente.id_user = "+id+" AND date_vente BETWEEN '" + debut + "' AND '" + fin + "' GROUP BY produit.id_produit"
        )
            .then(listlignevente => {
                if (listlignevente.length > 0) { 
                    res.status(200).json({
                        count: listlignevente.length,
                        ligneVente: listlignevente
                    });
                }
                else {
                    res.json({ Message: 'Pas de vente' })
                }
            }).catch(err => console.log(err))
    }
});

/* listeProduitVendu */

router.get('/listeProduitVenduByDate/:identifiant/&:debut/&:fin', (req, res) => {
    let debut = req.params.debut;
    let fin = req.params.fin;
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    debut.toString(); fin.toString();
    debut = debut.substring(1);
    fin = fin.substring(1);
    if ((fin == null || fin == ':') && (debut == null || debut == ':')) {
        database.query("SELECT libelle, prix_vente, prix_achat, SUM(quantite) as quantite, date_vente FROM ligne_vente "
            + "INNER JOIN vente ON ligne_vente.id_vente = vente.id_vente INNER JOIN produit ON ligne_vente.id_produit = produit.id_produit "
            + " WHERE vente.id_user = "+id+" GROUP BY produit.id_produit ORDER BY SUM(quantite) DESC"
        )
            .then(listLigneVente => {
                if (listLigneVente.length > 0) {
                    res.status(200).json({
                        count: listLigneVente.length,
                        ligneVente: listLigneVente
                    });
                }
                else {
                    res.json({ Message: 'Pas de vente' })
                }
            }).catch(err => console.log(err))
    }
    else if (fin == null || fin == ":") {
        database.query("SELECT libelle, prix_vente, prix_achat, SUM(quantite) as quantite, date_vente FROM ligne_vente "
            + "INNER JOIN vente ON ligne_vente.id_vente = vente.id_vente INNER JOIN produit ON ligne_vente.id_produit = produit.id_produit  "
            + "WHERE vente.id_user = "+id+" AND date_vente LIKE '%" + debut + "%' GROUP BY produit.id_produit ORDER BY SUM(quantite) DESC"
        )
            .then(listLigneVente => {
                if (listLigneVente.length > 0) {
                    res.status(200).json({
                        count: listLigneVente.length,
                        ligneVente: listLigneVente
                    });
                }
                else {
                    res.json({ Message: 'Pas de vente' })
                }
            }).catch(err => console.log(err))
    } else {
        database.query("SELECT libelle, prix_vente, prix_achat, SUM(quantite) as quantite, date_vente FROM ligne_vente "
            + "INNER JOIN vente ON ligne_vente.id_vente = vente.id_vente INNER JOIN produit ON ligne_vente.id_produit = produit.id_produit "
            + "WHERE vente.id_user = "+id+" AND (date_vente BETWEEN '" + debut + "' AND '" + fin + "') GROUP BY produit.id_produit ORDER BY SUM(quantite) DESC"
        )
            .then(listlignevente => {
                if (listlignevente.length > 0) {
                    res.status(200).json({
                        count: listlignevente.length,
                        ligneVente: listlignevente
                    });
                }
                else {
                    res.json({ Message: 'Pas de vente' })
                }
            }).catch(err => console.log(err))
    }
});

/* My test route. */
router.get('/broom/ble', (req, res) => {
    res.json('ni ta ye wa');
});


module.exports = router;
