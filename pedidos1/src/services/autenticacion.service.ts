import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { Llaves } from '../config/llaves';
import { Usuario } from '../models';
import { UsuarioRepository } from '../repositories';
const generador = require('password-generator');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(            /* Add @inject to inject parameters */
  @repository(UsuarioRepository) 
  public usuarioRepository : UsuarioRepository
  ) {}

  /*
   * Add service methods here
   */
  GenerarClave(){    //metodo que genera la clave
    let clave = generador(8,false);
    return clave;
  }
  CifrarClave(clave:string){   //variable claveCifrada
  let claveCifrada = cryptoJS.MD5(clave).toString();  // MD5 metodo de cifrado
  return claveCifrada;  //metodo que cifra la clave
  
}
IdentificarUsuario(usuario: string, clave: string){     //usuario/clave o contrasena viene del frontend
  try{
    let p = this.usuarioRepository.findOne({where:{correo: usuario,clave: clave}}); //estan en repositoryUsuario
    //correo y clave/contrasena debe coincidir con usuarioModel

    if(p){
      return p;
    }else{
      return false;
    }
  }catch{
    return false;
  }
}
 GenerarTokenJWT(usuario: Usuario){
  let token = jwt.sign({
    data:{
      id: usuario.id,
      correo: usuario.correo,
      nombre: usuario.nombre,
        }
  },
  Llaves.claveJWT);
  return token;
 }
 ValidarTokenJWT(token: string){
  try{
   let datos = jwt.verify(token,Llaves.claveJWT);
   return datos;
  }catch{
    return false;
  }
 }
}