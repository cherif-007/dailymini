var express = require('express');
var router = express.Router();
const { database } = require('../config/connection');

/* GET liste des users. */
router.get('/', (req, res) => {
    database.table('user as u')
        .withFields(['u.login as login',
            'u.pass as pass',
            'nom_boutique',
            'type_boutique',
            'adresse',
            'telephone',
            'u.id_user'
        ])
        .sort({ id_user: .1 })
        .getAll()
        .then(listusers => {
            if (listusers.length > 0) {
                res.status(200).json({
                    count: listusers.length,
                    user: listusers
                });
            }
            else {
                res.json({ Message: 'Pas de user' })
            }
        }).catch(err => console.log(err))
});

/* check user by id personnel */
router.get('/checkUser/:identifiant', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    //console.log(id);
    database.table('user').filter({ id_personnel: id })
        .get().then(user => {
            if (user) {
                res.json({ user });
            } else {
                res.json({ message: `NO USER FOUND WITH ID : ${id}` })
            }
        }).catch(err => console.log(err + " I'm here "));
});

router.get('/checkUserByLoginAndPass/:login/&:password', (req, res) => {
    let login = req.params.login.substring(1);
    let password = req.params.password.substring(1);
    //console.log(id);
    database.table('user').filter({ login: login, pass: password })
        .get().then(user => {
            if (user) {
                res.json({ user });
            } else {
                res.json({ message: `NO USER FOUND ` })
                //console.log('Bassa oops Barca');
            }
        }).catch(err => console.log(err + " I'm here broa"));
});

/* rechercher un user . */
router.get('/recherche/:identifiant', (req, res) => {
    let id = req.params.identifiant.substring(1);
    id = parseInt(id);
    database.table('user').filter({ id_user: id })
        .get().then(user => {
            if (user) {
                res.json({ user });
            } else {
                res.json({ message: `NO USER FOUND WITH ID : ${id}` })
            }
        }).catch(err => console.log(err + " I'm here "));

});


/* Inserer un user. */
router.post('/insertUser', (req, res) => {
    database.table('user').insert({
        login: req.body.login,
        pass: req.body.pass,
        nom_boutique: req.body.nom_boutique,
        type_boutique: req.body.type_boutique,
        adresse: req.body.adresse,
        telephone: req.body.telephone
    })
        .then(cool => {
            if (cool) {
                res.json({ message: `success` });
            } else {
                res.json({ message: `NO USER FOUND ` })
            }
        }).catch(err => console.log(`${err} I'm here`));

});


/* Update  User. */
router.patch('/updateUser', async (req, res) => {
    let id = req.body.id_user;
    id = parseInt(id);
    //console.log(" ici "+ id);
    let user = await database.table('user').filter({ id_user: id }).get();
    console.log(user);
    if (user) {
        var login = req.body.login;
        var pass = req.body.pass;
        var nom_boutique = req.body.nom_boutique;
        var type_boutique = req.body.type_boutique;
        var adresse = req.body.adresse;
        var telephone = req.body.telephone;

        database.table('user').filter({ id_user: user.id_user }).update({
            login: login,
            pass: pass,
            nom_boutique: nom_boutique,
            type_boutique: type_boutique,
            adresse: adresse,
            telephone: telephone,
        }).then(result => res.json('User updated successfully')).catch(err => res.json(err));
    }
});


/* Delete User*/

router.post('/deleteUser', (req, res) => {
    let id = req.body.id_user;
    id = parseInt(id);
    //console.log(id);
    database.table('user').filter({ id_user: id })
        .get().then(user => {
            if (user) {
                database.table('user').filter({ id_user: id }).remove()
                    .then(success => {
                        //console.log('Supprimé');
                        res.json({ message: `User deleted successfuly : ${id}` })
                    })
            } else {
                res.json({ message: `NO USER FOUND WITH ID : ${id}` })
                console.log('Bassa oops');
            }
        }).catch(err => console.log(err + " I'm here broooo"));

});



/* router.patch('/updateUserStatut', async (req, res) => {
    let id = req.body.id_user;
    id = parseInt(id);
    //console.log(" ici "+ id);
    let user = await database.table('user').filter({ id_user: id }).get();
    console.log(user);
    if (user) {
        var statut = req.body.statut;
        database.table('user').filter({ id_user: user.id_user }).update({
            statut: statut,
        }).then(result => res.json('User Statut updated successfully')).catch(err => res.json(err));
    }
});
 */

/* My test route. */
router.get('/broom/ble', (req, res) => {
    res.json('ni ta ye wa');
});


module.exports = router;
