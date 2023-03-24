var express = require('express');
var router = express.Router();
const { database } = require('../config/connection');

/* GET liste */
router.get('/:identifiant', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    database.table('stock as s').join([
        {
            table: 'produit as p',
            on: 's.id_produit = p.id_produit'
        }
    ])
        // id_stock id_produit quantite
        .withFields(['s.id_stock as id_stock',
            'p.libelle as produit',
            'p.stock_min as stock_min',
            'p.prix_achat as prix_achat',
            'p.prix_vente as prix_vente',
            'p.path as path',
            'p.id_user as id_user',
            's.id_produit as id_produit',
            's.quantite as quantite'
        ]).filter({ id_user: id })
        .sort({ id_stock: .1 })
        .getAll()
        .then(liststock => {
            if (liststock.length > 0) {
                res.status(200).json({
                    count: liststock.length,
                    stock: liststock
                });
            }
            else {
                res.json({ Message: 'Pas de stock' })
            }
        }).catch(err => console.log(err))
});

/* rechercher */
router.get('/recherche/:identifiant/&:identifiantStock', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    let idStock = req.params.identifiantStock.substring(1);
    idStock = parseInt(idStock);
    database.table('stock as s').join([
        {
            table: 'produit as p',
            on: 's.id_produit = p.id_produit'
        }
    ]).filter({ id_stock: idStock, id_user: id })
        .get().then(stock => {
            if (stock) {
                res.json({ stock });
            } else {
                res.json({ message: `NO stock FOUND WITH ID : ${id}` })
            }
        }).catch(err => console.log(err + " I'm here "));

});


/* Inserer */
// id_stock id_produit quantite
router.post('/insertStock', (req, res) => {
    database.table('stock').insert({
        id_produit: req.body.id_produit,
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


/* Update */

router.patch('/updateStock', async (req, res) => {
    let id = req.body.id_stock;
    id = parseInt(id);
    // console.log(" ici " + id);
    let stock = await database.table('stock').filter({ id_stock: id }).get();
    // console.log(stock);
    if (stock) {
        var id_produit = req.body.id_produit;
        var quantite = req.body.quantite;

        database.table('stock').filter({ id_stock: stock.id_stock }).update({
            id_produit: id_produit,
            quantite: quantite
        }).then(result => res.json('stock updated successfully')).catch(err => res.json(err));
    }
});


/* Delete */

router.post('/deleteStock', (req, res) => {
    let id = req.body.id_stock;
    id = parseInt(id);
    //console.log(id);
    database.table('stock').filter({ id_stock: id })
        .get().then(stock => {
            if (stock) {
                database.table('stock').filter({ id_stock: id }).remove()
                    .then(success => {
                        //console.log('Supprimé');
                        res.json({ message: `stock deleted successfuly : ${id}` })
                    })
            } else {
                res.json({ message: `NO stock FOUND WITH ID : ${id}` })
                //console.log('Bassa oops');
            }
        }).catch(err => console.log(err + " I'm here broooo"));

});

/* Inventaire */
router.get('/listeInventaire/:identifiant', async (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    let stock = await database.query("SELECT stock.id_produit, produit.libelle, stock.quantite FROM stock INNER JOIN produit ON stock.id_produit = "
        + "produit.id_produit  WHERE produit.id_user = " + id + " AND stock.quantite > 0 GROUP BY produit.id_produit, produit.libelle ORDER BY stock.id_produit ASC");
    if (stock.length > 0) {
        for (let index = 0; index < stock.length; index++) {
            st = stock[index];
            if (st.quantite > 0) {
                product = await database.query("SELECT * FROM produit WHERE id_produit = " + st.id_produit + " ORDER BY id_produit DESC ");
                if (product) {
                    for (let k = 0; k < product.length; k++) {
                        stock[index].prix_achat = product[k].prix_achat;
                        stock[index].prix_vente = product[k].prix_vente;
                        stock[index].montant = Math.trunc(product[k].prix_achat * stock[index].quantite);
                    }
                }
            }

        }

        if (stock) {
            res.json({ stock });
        } else {
            res.json({ message: `NO regler_client FOUND WITH ID : ${id}` })
            console.log('Bassa oops Barca');
        }
    } else {
        res.json({ Message: 'Pas de stock' })
    }
});

/*  listeStockAlert */

router.get('/listeStockAlert/:identifiant', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    let stock = database.query("SELECT id_stock, quantite, libelle, stock_min, path  FROM `stock` INNER JOIN produit ON stock.id_produit = produit.id_produit "
        + " WHERE produit.id_user = " + id + " AND produit.stock_min >= stock.quantite ORDER BY libelle ASC"
    )
    if (stock.length > 0) {
        res.status(200).json({
            count: stock.length,
            stock: stock
        });
    }
    else {
        res.json({ Message: 'Pas de stock minimum atteint' })
    }
});

/* My test route. */
router.get('/broom/ble', (req, res) => {
    res.json('ni ta ye wa');
});

module.exports = router;
