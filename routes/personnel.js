var express = require('express');
var router = express.Router();
const {database}=require('../config/connection');

/* GET liste des personnels. */
router.get('/', (req, res) =>{
    database.table('personnel as p')
    .withFields(['p.nom as nom',
            'p.prenom as prenom',
            'p.telephone as telephone',
            'p.sexe',
            'p.adresse as adresse',
            'p.fonction as fonction',
            'p.id_personnel as id_personnel',
        ])
    .sort({id_personnel : .1})
    .getAll()
    .then(listpersonnels => {
        if(listpersonnels.length > 0){
            res.status(200).json({
                count : listpersonnels.length,
                personnel : listpersonnels
            });
        }
        else{
            res.json({Message : 'Pas de personnel' , startvalue , endvalue})
        }
    }).catch(err =>console.log(err))
});

/* rechercher un Personnel . */
router.get('/recherche/:identifiant', (req, res) =>{
    let id = req.params.identifiant.substring(1);
    id=parseInt(id);
    console.log(id);
    database.table('personnel').filter({id_personnel:id})
    .get().then(personnel =>{
        if (personnel) {
            res.json({personnel});
        } else {
            res.json({message : `NO PERSONNEL FOUND WITH ID : ${id}`})
        }
    }).catch(err => console.log(err + " I'm here broa"));
    
});


/* Inserer un Personnel. */
router.post('/insertPersonnel', (req, res) =>{
    database.table('personnel').insert({
        nom: req.body.nom,
        prenom: req.body.prenom,
        telephone: req.body.telephone,
        sexe: req.body.sexe,
        adresse: req.body.adresse,
        fonction: req.body.fonction
        
    })
    .then(cool =>{
        if (cool) {
            res.json({message : `success` });
        } else {
            res.json({message : `cannot insert ` })
        }
    }).catch(err => console.log(`${err} I'm here`));
    
});


/* Update  Personnel. */
router.patch('/updatePersonnel',async(req, res) =>{
    let id = req.body.id_personnel;
    id=parseInt(id);
    console.log(" ici "+ id);
    let personnel =  await database.table('personnel').filter({id_personnel:id}).get();
    console.log(personnel);
    if (personnel) {
            var nom= req.body.nom;
            var prenom = req.body.prenom;
            var telephone = req.body.telephone;
            var sexe= req.body.sexe;
            var adresse= req.body.adresse;
            var fonction= req.body.fonction
            var id_personnel = id
            database.table('personnel').filter({id_personnel: personnel.id_personnel}).update({
            nom : nom,    
            prenom :   prenom,
            sexe : sexe,
            telephone :   telephone,
            adresse: adresse ,
            fonction: fonction,
            id_personnel : id_personnel
            }).then(result => res.json('Personnel updated successfully')).catch(err => res.json(err));
        }
});


/* Delete Personnel*/

router.post('/deletePersonnel', (req, res) =>{
    let id = req.body.id_personnel;
    id=parseInt(id);
    console.log(id);
    database.table('personnel').filter({id_personnel:id})
    .get().then(personnel =>{
        if (personnel) {
            database.table('personnel').filter({id_personnel:id}).remove( ) 
                . then ( success  =>  { 
                    console.log('Supprimé');
                    res.json({message : `Personnel deleted successfuly : ${id}`})
                })
        } else {
            res.json({message : `NO Personnel FOUND WITH ID : ${id}`})
            console.log('Bassa oops');
        }
    }).catch(err => console.log(err + " I'm here broooo"));
    
});

/* My test route. */
router.get('/broom/ble', (req, res) =>{
    res.json('ni ta ye wa');
});


module.exports = router;
