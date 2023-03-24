const Joi = require('joi');
var router = express.Router();

const depenseSchema = Joi.object({
    nom: Joi.string().required(),
    date: Joi.date().required(),
    prix: Joi.number().required(),
    categorie: Joi.string().required(),
    commentaire: Joi.string().allow('')
});

const validateDepense = (depense) => {
    return depenseSchema.validate(depense);
};
module.exports = router;