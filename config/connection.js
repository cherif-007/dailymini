var MySqli = require('MySqli');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let conn = new MySqli({
    Host: 'localhost',
    Port: 3306,
    user: 'root',
    passwd: 'Malle2017',
    db: 'daily_stock_mini'
});

let db = conn.emit(false, '');

const secret = "codesecret007";

let utilisateur;

module.exports = {
    database: db,
    secret: secret,
    utilisateur: utilisateur,
    validJWTNeeded: (req, res, next) => {
        if (req.headers['authorization']) {
            try {
                let authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send();
                } else {
                    req.jwt = jwt.verify(authorization[1], secret);
                    return next();
                }
            } catch (err) {
                return res.status(403).send("Authentication faileds");
            }
        } else {
            return res.status(401).send("No authorization header found.");
        }
    },
    hasAuthFields: (req, res, next) => {
        let errors = [];

        if (req.body) {
            if (!req.body.login) {
                errors.push('Le champs login est requis');
            }
            if (!req.body.password) {
                errors.push('Le champs password est requis');
            }

            if (errors.length) {
                return res.status(400).send({ errors: errors.join(',') });
            } else {
                return next();
            }
        } else {
            return res.status(400).send({ errors: 'Les champs login et password sont requis' });
        }
    },
    isPasswordAndUserMatch: async (req, res, next) => {
        const myPlaintextPassword = req.body.password;
        const login = req.body.login;
        console.log(login + " " + myPlaintextPassword)

        const user = await db.table('user').filter({ $or: [{ login: login }] }).get();
        if (user) {
            const match = await db.table('user').filter({ $or: [{ pass: myPlaintextPassword }] }).get();

            if (match) {
                req.password = user.pass;
                req.login = user.login;
                //res.status(200).send(user);
                //utilisateur = user
                next();

            } else {
                res.status(401).send("password incorrect");
            }

        } else {
            res.status(401).send("Login ou password incorrect");
        }

    }
};
