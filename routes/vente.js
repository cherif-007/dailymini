var express = require('express');
var router = express.Router();
const { database } = require('../config/connection');

/* GET liste vente. */
router.get('/:identifiant', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    database.table('vente as v').join([
        {
            table: 'user as u',
            on: `u.id_user =  v.id_user`
        }

    ])
        .withFields(['v.id_vente as id_vente',
            'v.date_vente as date_vente',
            // 'v.montant as montant',
            // 'per.prenom as userPrenom',
            // 'per.nom as userNom',
            'v.id_user as id_user'
        ])
        .filter({"v.id_user" : id})
        .sort({ id_vente: .1 })
        .getAll()
        .then(listvente => {
            if (listvente.length > 0) {
                res.status(200).json({
                    count: listvente.length,
                    vente: listvente
                });
            }
            else {
                res.json({ Message: 'vente vide' })
            }
        }).catch(err => console.log(err))
});

//get Last vente

router.get('/lastIdVente/:identifiant', async (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    id_vente = await database.query("SELECT MAX(id_vente) as id_vente FROM vente  WHERE id_user = " +id)
    if (id_vente) {
        res.status(200).json({
            id_vente: id_vente,
        });
    }
    else {
        res.json({ Message: 'Vente vide' })
    }
});

/* rechercher vente . */

router.get('/recherche/:identifiant/&:identifiantVente', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    let idVente = req.params.identifiantVente.substring(1);
    idVente = parseInt(idVente);
    // console.log(id);
    database.table('vente').filter({ id_vente: id,id_user : id })
        .getAll().join([
            {
                table: 'user as u',
                on: `u.id_user =  v.id_user`

            }
        ])
        .withFields(['v.id_vente as id_vente',
            'v.date_vente as date_vente',
            'v.id_user as id_user'
        ]).then(vente => {
            if (vente) {
                res.json({ vente });
            } else {
                res.json({ message: `NO VENTE FOUND WITH ID : ${id}` })
                //console.log('Bassa oops Barca');
            }
        }).catch(err => console.log(err + " I'm here broa"));

});


/* Inserer vente. */

router.post('/insertVente', (req, res) => {
    database.table('vente').insert({
        date_vente: req.body.date_vente,
        id_vente: req.body.id_vente,
        id_user: req.body.id_user
    })
        .then(cool => {
            if (cool) {
                res.json({ message: `success` });
            } else {
                res.json({ message: `cannot insert ` })
                // console.log('ble filai ');
            }
        }).catch(err => console.log(`${err} I'm here Touris`));

});


/* Update  Vente. */

router.patch('/updateVente', async (req, res) => {
    let idVente = req.body.id_vente;
    idVente = parseInt(idVente);
    let id = req.body.id_user;
    id = parseInt(id);
    //console.log(" ici " + id);
    let vente = await database.table('vente').filter({ id_vente: idVente,id_user:id}).get();
    //console.log(vente);
    if (vente) {
        var date_vente = req.body.date_vente;
        var montant = req.body.montant;
        var id_user = req.body.id_user;

        database.table('vente').filter({ id_vente: vente.id_vente }).update({
            date_vente: date_vente,
            montant: montant,
            id_user: id_user
        }).then(result => res.json('vente updated successfully')).catch(err => res.json(err));
    }
});


/* Delete Vente*/

router.post('/deleteVente', (req, res) => {
    let idVente = req.body.id_vente;
    idVente = parseInt(idVente);
    let id = req.body.id_user;
    id = parseInt(id);
    //console.log(id);
    database.table('vente').filter({ id_vente: id,id_user:id })
        .get().then(vente => {
            if (vente) {
                database.table('vente').filter({ id_vente: id }).remove()
                    .then(success => {
                        //console.log('Supprimé');
                        res.json({ message: `vente deleted successfuly : ${id}` })
                    })
            } else {
                res.json({ message: `NO vente FOUND WITH ID : ${id}` })
                //console.log('Bassa oops');
            }
        }).catch(err => console.log(err + " I'm here broooo"));

});

router.get('/listeVenteByDate/:identifiant/&:debut/&:fin', (req, res) => {
    let debut = req.params.debut;
    let fin = req.params.fin;
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    debut.toString(); fin.toString();
    debut = debut.substring(1);
    fin = fin.substring(1);
    if ((debut == null || debut.length == 1) && (fin == null || fin.length == 1)) {
        database.query("SELECT v.id_vente as id_vente, v.date_vente as date_vente, v.id_user as id_user "
            + "FROM vente v JOIN user u ON v.id_user =  u.id_user WHERE V.id_user = "+id
        ).then(listevente => {
            if (listevente.length > 0) {
                res.status(200).json({
                    vente: listevente
                });
            }
            else {
                res.json({ Message: 'Vente vide' })
            }
        }).catch(err => console.log(err));
    }
    else if (fin == null || fin.length == 1) {
        debut = debut.substring(1)
        database.query("SELECT v.id_vente as id_vente, v.date_vente as date_vente, v.id_user as id_user  "
            + "FROM vente v JOIN user u ON v.id_user =  u.id_user "
            + "WHERE date_vente LIKE '%" + debut + "%' AND v.id_user = "+id
        ).then(listevente => {
            if (listevente.length > 0) {
                res.status(200).json({
                    vente: listevente
                });
            }
            else {
                res.json({ Message: 'Vente vide' })
            }
        }).catch(err => console.log(err));
    }
    else {
        
        // console.log(debut + "    " + fin)
        database.query("SELECT v.id_vente as id_vente, v.date_vente as date_vente, v.id_user as id_user "
            + "FROM vente v JOIN user u ON v.id_user =  u.id_user "
            + "WHERE v.id_user = "+id+" AND (date_vente BETWEEN '" + debut + "' AND '" + fin+"')" 
        ).then(listevente => {
            if (listevente.length > 0) {
                res.status(200).json({
                    vente: listevente
                });
            }
            else {
                res.json({ Message: 'Vente vide' })
            }
        }).catch(err => console.log(err));
    }


});

/* My test route. */
router.get('/broom/ble', (req, res) => {
    res.json('ni ta ye wa');
});


module.exports = router;
