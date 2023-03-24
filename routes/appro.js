var express = require('express');
var router = express.Router();
const { database } = require('../config/connection');

/* GET liste des Appro. */
router.get('/:identifiant', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    database.table('appro as a')
        .join([
            {
                table: 'user as u',
                on: `u.id_user =  a.id_user`

            }
        ])
        .withFields(['a.date_appro as date_appro',
            // 'a.montant as montant',
            'a.id_user as id_user',
            'a.id_appro as id_appro'
        ]).filter({"a.id_user" : id})
        .sort({ id_appro: .1 })
        .getAll()
        .then(listappro => {
            if (listappro.length > 0) {
                res.status(200).json({
                    count: listappro.length,
                    appro: listappro
                });
            }
            else {
                res.json({ Message: 'Approvisionnement vide' })
            }
        }).catch(err => console.log(err))
});

/* rechercher un appro . */
router.get('/recherche/:identifiant/&:identifiantAppro', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    let idAppro = req.params.identifiantAppro.substring(1);
    idAppro = parseInt(idAppro);
    //console.log(id);
    database.table('appro').filter({ id_appro: idAppro, id_user : id})
        .get().then(appro => {
            if (appro) {
                res.json({ appro });
            } else {
                res.json({ message: `NO APPRO FOUND WITH ID : ${id}` })
            }
        }).catch(err => console.log(err + " I'm here broa"));

});


/* Inserer un appro. */
//id_appro	date_appro	montant	valider	id_personne	id_user
router.post('/insertAppro', (req, res) => {
    database.table('appro').insert({
        date_appro: req.body.date_appro,
        id_user: req.body.id_user
    })
        .then(cool => {
            if (cool) {
                res.json({ message: `success` });
            } else {
                res.json({ message: `cannot insert ` })
            }
        }).catch(err => console.log(`${err} error here`));

});


/* Update  Depense. */
//id_appro	date_appro	montant	valider	id_personne	id_user
router.patch('/updateAppro', async (req, res) => {
    let idAppro = req.body.id_appro;
    idAppro = parseInt(idAppro);
    let id = req.body.id_user;
    id = parseInt(id);
    //console.log(" ici " + id);
    let appro = await database.table('appro').filter({ id_appro: idAppro, id_user:id }).get();
    //console.log(appro);
    if (appro) {
        var date_appro = req.body.date_appro;
        var id_user = req.body.id_user;

        database.table('appro').filter({  id_appro: idAppro, id_user:id }).update({
            date_appro: date_appro,
            id_user: id_user
        }).then(result => res.json('appro updated successfully')).catch(err => res.json(err));
    }
});


/* Delete Appro*/

router.post('/deleteAppro', (req, res) => {
    let idAppro = req.body.id_appro;
    idAppro = parseInt(id);
    let id = req.body.id_user;
    id = parseInt(id);
    //console.log(id);
    database.table('appro').filter({ id_appro: idAppro, id_user:id})
        .get().then(appro => {
            if (appro) {
                database.table('appro').filter({ id_appro: idAppro, id_user:id}).remove()
                    .then(success => {
                        //console.log('Supprimé');
                        res.json({ message: `appro deleted successfuly : ${id}` })
                    })
            } else {
                res.json({ message: `NO appro FOUND WITH ID : ${id}` })
                console.log('Bassa oops');
            }
        }).catch(err => console.log(err + " I'm here broooo"));

});

/* get listeApproByDate*/

router.get('/listeApproByDate/:identifiant/&:debut/&:fin', (req, res) => {
    let debut = req.params.debut;
    let fin = req.params.fin;
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    debut.toString(); fin.toString();
    debut = debut.substring(1);
    fin = fin.substring(1);

    database.query("SELECT *  FROM appro a INNER JOIN user u ON a.id_user = u.id_user "
        + " WHERE (date_appro BETWEEN '" + debut + "' AND '" + fin + "') AND a.id_user = "+id
    )
        .then(listappro => {
            if (listappro.length > 0) {
                res.status(200).json({
                    count: listappro.length,
                    appro: listappro
                });
            }
            else {
                res.json({ Message: 'Approvisionnement vide' })
            }
        }).catch(err => console.log(err))
});

/* get MontantByAppro*/

router.get('/montantByAppro/:identifiant/&:identifiantAppro', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    let idAppro = req.params.identifiantAppro.substring(1);
    idAppro = parseInt(idAppro);
    //console.log(id);
    database.query("SELECT *  FROM ligne_appro la INNER JOIN appro a ON a.id_appro=la.id_appro INNER JOIN user u ON a.id_user = u.id_user INNER JOIN produit p"
    +" ON p.id_produit = la.id_produit WHERE a.id_appro = " 
    + idAppro +" AND a.id_user = "+id
    )
        .then(listappro => {
            if (listappro.length > 0) {
                let appro;
                let montant = 0;
                for (let index = 0; index < listappro.length; index++) {
                    appro = listappro[index];
                    montant += appro.quantite * appro.prix_achat
                }
                res.status(200).json({
                    count: listappro.length,
                    appro: listappro,
                    montant: montant
                });
            }
            else {
                res.json({ Message: 'Approvisionnement vide'})
            }
        }).catch(err => console.log(err))
});

router.get('/lastIdAppro/:identifiant', async (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    id_appro = await database.query("SELECT MAX(id_appro) as id_appro FROM appro WHERE id_user = " +id)
    if (id_appro) {
        res.status(200).json({
            id_appro: id_appro,
        });
    }
    else {
        res.json({ Message: 'Appro vide' })
    }
});

/* My test route. */
router.get('/broom/ble', (req, res) => {
    res.json('ni ta ye wa');
});


module.exports = router;

