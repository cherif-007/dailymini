var express = require('express');
var router = express.Router();
const { database } = require('../config/connection');

/* GET liste des Lignes Appro. */
router.get('/:identifiant', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    //id_produit	id_appro	quantite	prix_achat	id_vider
    database.table('ligne_appro as la').join([
        {
            table: 'produit as p',
            on: `p.id_produit =  la.id_produit`

        }
    ])

        .withFields(['la.id_produit as id_produit',
            'la.id_appro as id_appro',
            'la.quantite as quantite',
            'p.libelle as libelleProduit',
            'p.prix_achat as prix_achat',
            'p.prix_vente as prix_vente',
            'p.path as path',
            "p.id_user as id_user"
        ])
        .filter({"p.id_user" : id})
        .sort({ id_appro: .1 })
        .getAll()
        .then(listligneappro => {
            if (listligneappro.length > 0) {
                res.status(200).json({
                    count: listligneappro.length,
                    ligneappro: listligneappro
                });
            }
            else {
                res.json({ Message: 'ligne Approvisionnement vide' })
            }
        }).catch(err => console.log(err))
});

/* rechercher appro dans ligneappro . */
router.get('/recherche/:identifiant', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    console.log(id);
    database.table('ligne_appro as la').join([
        {
            table: 'produit as p',
            on: `p.id_produit =  la.id_produit`

        }
    ]).filter({ id_appro: id }).
        withFields(['la.id_produit as id_produit',
            'la.id_appro as id_appro',
            'la.quantite as quantite',
            'p.libelle as libelleProduit',
            'p.prix_achat as prix_achat',
            'p.prix_vente as prix_vente',
            'p.path as path'
        ])
        .getAll().then(appro => {
            if (appro) {
                res.json({ appro });
            } else {
                res.json({ message: `NO APPRO FOUND WITH ID : ${id}` })
                console.log('Bassa oops Barca');
            }
        }).catch(err => console.log(err + " I'm here broa"));

});


/* Inserer ligne_appro. */
//id_produit	id_appro	quantite	prix_achat	id_vider
router.post('/insertLigneAppro', (req, res) => {
    database.table('ligne_appro').insert({
        id_produit: req.body.id_produit,
        id_appro: req.body.id_appro,
        quantite: req.body.quantite
    })
        .then(cool => {
            if (cool) {
                res.json({ message: `success` });
            } else {
                res.json({ message: `cannot insert ` })
                console.log('ble filai ');
            }
        }).catch(err => console.log(`${err} I'm here Touris`));

});


/* Update  ligne_appro. */
//id_produit	id_appro	quantite	prix_achat	id_vider
router.patch('/updateLigneAppro', async (req, res) => {
    let id = req.body.id_appro;
    id = parseInt(id);
    console.log(" ici " + id);
    let ligne_appro = await database.table('ligne_appro').filter({ id_appro: id }).get();
    console.log(ligne_appro);
    if (appro) {
        var id_produit = req.body.id_produit;
        var id_appro = req.body.id_appro;
        var quantite = req.body.quantite;

        database.table('ligne_appro').filter({ id_appro: ligne_appro.id_appro }).update({
            id_produit: id_produit,
            id_appro: id_appro,
            quantite: quantite
        }).then(result => res.json('ligne_appro updated successfully')).catch(err => res.json(err));
    }
});


/* Delete Appro*/

router.post('/deleteLigneAppro', (req, res) => {
    let id = req.body.id_appro;
    id = parseInt(id);
    console.log(id);
    database.table('ligne_appro').filter({ id_appro: id })
        .getAll().then(ligne_appro => {
            if (ligne_appro) {
                database.table('ligne_appro').filter({ id_appro: id }).remove()
                    .then(success => {
                        console.log('Supprimé');
                        res.json({ message: `ligne_appro deleted successfuly : ${id}` })
                    })
            } else {
                res.json({ message: `NO ligne_appro FOUND WITH ID : ${id}` })
                console.log('Bassa oops');
            }
        }).catch(err => console.log(err + " I'm here broooo"));

});

/* liste ligne Appro By Id Appro  */

router.get('listeApproByIdAppro/:identifiant', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    //console.log(id);
    database.table('ligne_appro').filter({ id_appro: id })
        .getAll()
        .then(listligneappro => {
            if (listligneappro.length > 0) {
                res.status(200).json({
                    count: listligneappro.length,
                    ligneappro: listligneappro
                });
            }
            else {
                res.json({ Message: 'ligne Approvisionnement vide' })
            }
        }).catch(err => console.log(err))

});

/* My test route. */
router.get('/broom/ble', (req, res) => {
    res.json('ni ta ye wa');
});


module.exports = router;
