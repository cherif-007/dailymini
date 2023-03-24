var express = require('express');
var router = express.Router();
const { database } = require('../config/connection');

/* GET liste des produits. */
router.get('/:identifiant', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    database.table('produit as p').join([
        {
            table: 'user as u',
            on: `p.id_user =  u.id_user`

        }

    ])
        .withFields(['p.libelle as libelle',
            'p.stock_min as stock_min',
            'p.prix_achat as prix_achat',
            'p.prix_vente as prix_vente',
            'p.path as path',
            'p.id_user as id_user',
            // 'pers.nom as userName',
            // 'pers.prenom as userPrenom',
            'p.id_produit as id_produit',
        ]).filter({"p.id_user" : id})
        .sort({ id_produit: .1 })
        .getAll()
        .then(listproduit => {
            //console.log(listproduit);
            if (listproduit.length > 0) {
                res.status(200).json({
                    count: listproduit.length,
                    produit: listproduit
                });
            }
            else {
                res.json({ Message: 'Pas de produit' })
            }
        }).catch(err => console.log(err))
});

/* rechercher un Produit . */
router.get('/recherche/:identifiant/&:identifiantProduit', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    let idProduit = req.params.identifiantProduit.substring(1);
    idProduit = parseInt(idProduit);
    // console.log(id);
    database.table('produit').filter({id_produit: idProduit,id_user:id})
        .get().then(produit => {
            if (produit) {
                res.json({ produit });
            } else {
                res.json({ message: `NO PRODUIT FOUND WITH ID : ${id}` })
            }
        }).catch(err => console.log(err + " I'm here"));

});


/* Inserer un Produit. */

router.post('/insertProduit', (req, res) => {
    database.table('produit').insert({
        libelle: req.body.libelle,
        stock_min: req.body.stock_min,
        prix_achat: req.body.prix_achat,
        prix_vente: req.body.prix_vente,
        path: req.body.path,
        id_user: req.body.id_user
    })
        .then(cool => {
            if (cool) {
                res.json({ message: `success` });
            } else {
                res.json({ message: `cannot insert ` })
            }
        }).catch(err => console.log(`${err} I'm here`));

});


/* Update  Produit. */

router.patch('/updateProduit', async (req, res) => {
    let id = req.body.id_user;
    id = parseInt(id);
    let idProduit = req.body.id_produit;
    idProduit = parseInt(idProduit);
    //console.log(" ici " + id);
    let produit = await database.table('produit').filter({ id_produit: idProduit,id_user:id }).get();
    //console.log(produit);
    if (produit) {
        var libelle = req.body.libelle;
        var stock_min = req.body.stock_min;
        var prix_achat = req.body.prix_achat;
        var prix_vente = req.body.prix_vente;
        var path = req.body.path;
        var id_user = req.body.id_user;

        database.table('produit').filter({ id_produit: produit.id_produit,id_user:id }).update({
            libelle: libelle,
            stock_min: stock_min,
            prix_achat: prix_achat,
            prix_vente: prix_vente,
            path: path,
            id_user: id_user
        }).then(result => res.json('Produit updated successfully')).catch(err => res.json(err));
    }
});


/* Delete Personne*/

router.post('/deleteProduit', (req, res) => {
    let id = req.body.id_user;
    id = parseInt(id);
    let idProduit = req.body.id_produit;
    idProduit = parseInt(idProduit);
    //console.log(id);
    database.table('produit').filter({ id_produit: idProduit,id_user:id })
        .get().then(produit => {
            if (produit) {
                database.table('produit').filter({ id_produit: idProduit,id_user:id }).remove()
                    .then(success => {
                        //console.log('Supprimé');
                        res.json({ message: `produit deleted successfuly : ${id}` })
                    })
            } else {
                res.json({ message: `NO produit FOUND WITH ID : ${id}` })
                console.log('Bassa oops');
            }
        }).catch(err => console.log(err + " I'm here broooo"));

});


/* idProduitByLibelleAndFournisseur*/

router.get('/idProduitByLibelle/:identifiant/&:libelle', (req, res) => {
    let libelle = req.params.libelle.toString();
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    //console.log(libelle);
    database.query("SELECT id_produit FROM produit WHERE id_user = "+ id+" AND  libelle = '" + libelle + "' "
    ).then(id_produit => {
        if (id_produit) {
            res.json({ id_produit: id_produit });
        } else {
            res.json({ message: `NO PRODUIT FOUND WITH ID : ${id}` })
        }
    }).catch(err => console.log(err + " I'm here"));

});


/* My test route. */
router.get('/broom/ble', (req, res) => {
    res.json('ni ta ye wa');
});


module.exports = router;
