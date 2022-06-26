
const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });
        if( existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'Las credenciales no son validas'
            })
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt  = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        const token = await generarJWT( usuario.id);

        res.json({

            ok: true,
            usuario,
            token

        });
       
        
    } catch (error) {
        console.log(error);
        res.statur(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
    
    
}

const login = async (req, res = response) =>  {

    const { email, password } =  req.body;


    try {

        const usuarioDB = await Usuario.findOne({ email });
        if( !usuarioDB){
            return response.status(404).json({
                ok: false,
                msg: "No se pudo iniciar sesion"
            });
        }
        
        //validar password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if( !validPassword ){
            return response.status(400).json({
                ok: false,
                msg: "No se pudo iniciar sesion"
            });
        }
        
        // Generar el JWT
        const token = await generarJWT( usuarioDB.id);
        
        res.json({

            ok: true,
            usuarioDB,
            token

        });
        
    } catch (error) {

        


        return res.status(500).json({
            ok: false,
            msg: 'No se pudo iniciar sesion'
        });
        
    }


    
}

const renewToken = async(req, res = response) => {

    try {

        const usuarioDB = await Usuario.findById( req.uid );

        const token = await generarJWT( req.uid);

        res.json({
            ok: true,
            usuarioDB,
            token
        });

    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg: 'Hubo un problema al iniciar sesion'
        });
        
    }

    response.json({
        ok: true,
        uid: req.uid
    })
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}