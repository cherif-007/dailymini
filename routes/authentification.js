const express = require('express');
// const {check, validationResult, body} = require('express-validator');
const router = express.Router();
const helper = require('../config/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// LOGIN ROUTE
router.post('/login', [helper.hasAuthFields, helper.isPasswordAndUserMatch], (req, res) => {
    let token = jwt.sign({ state: 'true', login: req.body.login }, helper.secret, {
        algorithm: 'HS512',
        expiresIn: '2h'
    });
    res.json({ token: token, auth: true, login: req.body.login });
});

// REGISTER ROUTE
/* router.post('/inserer', [
    check('email').not().isEmpty().withMessage('Field can\'t be empty'),
    check('password').escape().trim().not().isEmpty().withMessage('Field can\'t be empty')
        .isLength({ min: 6 }).withMessage("must be 6 characters long"),
    body('email').custom(value => {
        return helper.database.table('user').filter({
            $or:
                [
                    { email: value }
                ]
        }).get().then(user => {
            if (user) {
                console.log(user + ' on est la ' + value);
                return Promise.reject('Cet Email existe deja choisissez un autre svp.');
            }
        })
    })
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {

        let nom = req.body.nom;
        let prenom = req.body.prenom;
        let tel = req.body.tel;
        let adresse = req.body.adresse;
        let pays = req.body.pays;
        let email = req.body.email;
        let password = await bcrypt.hash(req.body.password, 10);
        let sexe = req.body.sexe;
        let code_postale = req.body.code_postale;
        let ville = req.body.ville;
        let id_categorie_client = req.body.id_categorie_client

        helper.database.table('user').insert({
            tel: tel,
            password: password,
            email: email,
            role: 'user',
            nom: nom || null,
            prenom: prenom || null,
            adresse: adresse || null,
            pays: pays || null,
            sexe: sexe || null,
            code_postale: code_postale || null,
            ville: ville || null,
            id_categorie_client: id_categorie_client || null
        }).then(lastId => {
            if (lastId > 0) {
                res.status(201).json({ message: 'Enregistré avec succès.' });
            } else {
                res.status(501).json({ message: 'Echec dans l\'enregistrement.' });
            }
        }).catch(err => res.status(433).json({ error: err }));
    }
});
 */

module.exports = router;
