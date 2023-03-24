var express = require('express');
var router = express.Router();
const { database } = require('../config/connection');

/* GET liste des Depense. */
router.get('/:identifiant', (req, res) => {
    //libelle	montant	date_depense	id_user
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    database.table('depense as d').join([
        {
            table: 'user as u',
            on: `d.id_user =  u.id_user`

        }
    ])
        .withFields(['d.libelle as libelle',
            'd.montant as montant',
            'd.id_depense as id_depense',
            'd.date_depense as date_depense',
            'd.id_user as id_user'
        ]).filter({"d.id_user" : id})
        .sort({ id_depense: .1 })
        .getAll()
        .then(listdepense => {
            if (listdepense.length > 0) {
                res.status(200).json({
                    count: listdepense.length,
                    depense: listdepense
                });
            }
            else {
                res.json({ Message: 'Pas de depense' })
            }
        }).catch(err => console.log(err))
});

/* rechercher un depense . */
router.get('/recherche/:identifiant/&:identifiantDepense', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    let idDepense = req.params.identifiantDepense.substring(1);
    idDepense = parseInt(idDepense);
    database.table('depense').filter({id_depense: idDepense , id_user : id})
        .get().then(depense => {
            if (depense) {
                res.json({ depense });
            } else {
                res.json({ message: `NO DEPENSE FOUND WITH ID : ${id}` })
            }
        }).catch(err => console.log(err + " I'm here broa"));

});


/* Inserer un Depense. */
//libelle	montant	date_depense	id_user
router.post('/insertDepense', (req, res) => {
    database.table('depense').insert({
        libelle: req.body.libelle,
        montant: req.body.montant,
        date_depense: req.body.date_depense,
        id_user: req.body.id_user
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


/* Update  Depense. */
//libelle	montant	date_depense	id_user
router.patch('/updateDepense', async (req, res) => {
    let id = req.body.id_user;
    id = parseInt(id);
    let idDepense = req.body.id_DidDepense;
    idDepense = parseInt(idDepense);
    //console.log(" ici "+ id);
    let depense = await database.table('depense').filter({ id_depense: idDepense ,id_user:id }).get();
    //console.log(depense);
    if (depense) {
        var libelle = req.body.libelle;
        var montant = req.body.montant;
        var date_depense = req.body.date_depense;
        var id_user = req.body.id_user;

        database.table('depense').filter({ id_depense: idDepense, id_user:id }).update({
            libelle: libelle,
            montant: montant,
            date_depense: date_depense,
            id_user: id_user
        }).then(result => res.json('depense updated successfully')).catch(err => res.json(err));
    }
});


/* Delete Personne*/

router.post('/deleteDepense', (req, res) => {
    let id = req.body.id_user;
    id = parseInt(id);
    let idDepense = req.body.id_DidDepense;
    idDepense = parseInt(idDepense);
    //console.log(id);
    database.table('depense').filter({ id_depense: idDepense, id_user:id })
        .get().then(depense => {
            if (depense) {
                database.table('depense').filter({ id_depense: idDepense, id_user:id }).remove()
                    .then(success => {
                        //console.log('Supprimé');
                        res.json({ message: `depense deleted successfuly : ${id}` })
                    })
            } else {
                res.json({ message: `NO depense FOUND WITH ID : ${id}` })
                console.log('Bassa oops');
            }
        }).catch(err => console.log(err + " I'm here broooo"));

});

/* DepenseByDate */

router.get('/depenseByDate/:identifiant/&:debut/&:fin', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    let debut = req.params.debut.toString();
    let fin = req.params.fin.toString();
    debut = debut.substring(1);
    fin = fin.substring(1);

    if (fin == null || fin == ':') {
        database.query("SELECT * FROM depense INNER JOIN user ON depense.id_user = user.id_user  WHERE depense.id_user = "+id +" AND date_depense LIKE '%" + debut + "%' ORDER BY id_depense DESC"
        )
            .then(listdepense => {
                if (listdepense.length > 0) {
                    res.status(200).json({
                        count: listdepense.length,
                        depense: listdepense
                    });
                }
                else {
                    res.json({ Message: 'Pas de depense' })
                }
            }).catch(err => console.log(err))
    } else {
        database.query("SELECT * FROM depense INNER JOIN user ON depense.id_user = user.id_user  WHERE depense.id_user = "+id +" AND date_depense BETWEEN '" + debut + "' AND '" + fin + "' ORDER BY id_depense DESC"
        )
            .then(listdepense => {
                if (listdepense.length > 0) {
                    res.status(200).json({
                        count: listdepense.length,
                        depense: listdepense
                    });
                }
                else {
                    res.json({ Message: 'Pas de depense' })
                }
            }).catch(err => console.log(err))
    }
});

/* montantDepenseByDate */

router.get('/montantDepenseByDate/:identifiant/&:debut', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    let debut = req.params.debut.toString();
    debut = debut.substring(1)
    
        database.query("SELECT * FROM depense WHERE depense.id_user = "+id+" AND date_depense LIKE '%"+debut+"%' "
        )
            .then(listdepense => {
                if (listdepense.length > 0) {
                    let depense;
                    let montant = 0;
                    for (let index = 0; index < listdepense.length; index++) {
                        depense = listdepense[index];
                        montant += depense.montant;
                    }
                    res.status(200).json({
                        count: listdepense.length,
                        depense: listdepense,
                        montant: montant
                    });
                }
                else {
                    res.json({ Message: 'Pas de depense cette date' })
                }
            }).catch(err => console.log(err))
});
 

module.exports = router;
