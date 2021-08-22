const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../configs/db");

exports.signUp = (req, res) => {
  const { name, email, password } = req.body;

   client
    .query(`SELECT * FROM users WHERE email = '${email}';`)
    .then((data) => {
      isValid = data.rows;

        if (isValid.length != 0) {
        res.status(400).json({
          error: "User already exists.",
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              error: "Internal server error.",
            });
          }

          const user = {
          
            name,
            email,
            password: hash,
          };
          console.log(user);

          client
            .query(
              `INSERT INTO users ( name, email, password) VALUES ('${user.name}', '${user.email}' , '${user.password}');`
            )
            .then((data) => {
                const token = jwt.sign(
                {
                  email: email,
                },
                process.env.SECRET_KEY
              );

              res.status(200).json({
                message: "User added successfully to database",
                token: token,
              });
            })
            .catch((err) => {
                res.status(500).json({
                error: "Database error occurred!",
              });
            });
        });
      }
    })
    .catch((err) => {
        res.status(500).json({
        error: "Database error occurred!",
      });
    });
};

exports.signIn = (req, res) => {
    const { email, password } = req.body;

    client
    .query(`SELECT * FROM users WHERE email = '${email}';`)
    .then((data) => {
      userData = data.rows;
     
      if (userData.length === 0) {
        
        res.status(400).json({
          error: "User does not exist, signup instead!",
        });
      } else {
       
        bcrypt.compare(password, userData[0].password, (err, result) => {
          if (err) {
           res.status(500).json({
              error: "Server error!",
            });
          } else if (result === true) {
            const token = jwt.sign(
              {
                email: email,
              },
              process.env.SECRET_KEY
            );
            res.status(200).json({
              message: "User signed in successfully",
              token: token,
            });
          } else {
             res.status(400).json({
              error: "Enter correct password",
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Database error occurred",
      });
    });
};

exports.getuser = (req, res) => {
  client
    .query(`SELECT * from users where email = '${req.email}'`)
    .then((data) => {
      console.log(data);
      const { name, email, id } = data.rows[0];
      res.send({
        name,
        email,
        id,
      });
    })
 
    .catch((err) => {
      res.status(500).json({
        message: "Database error",
      });
    });
};