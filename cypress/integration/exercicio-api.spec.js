/// <reference types="cypress" />
import { faker } from '@faker-js/faker'
import contrato from '../contracts/usuario.contract'


describe('Testes da Funcionalidade Usuários', () => {
     const name = faker.name.fullName()
     let email = faker.internet.email()

    it('Deve validar contrato de usuários', () => {
       cy.request('usuarios').then(response => {
          return contrato.validateAsync(response.body)  
       })

    });

    it('Deve listar usuários cadastrados', () => {
        cy.request({
          method: 'GET',
          url: 'usuarios'
        }).then((response) =>{
            expect(response.body.usuarios[0].nome).to.equal('Maria da Silva')
            expect(response.status).to.equal(200)
            expect(response.duration).to.be.lessThan(50)
          })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
        
         cy.cadastarUsuario(name, email, 'teste', 'true')
         .then((response) => {
          expect(response.status).to.equal(201)
          expect(response.body.message).to.equal('Cadastro realizado com sucesso')
         })
    });

    it('Deve validar um usuário com email inválido', () => {
         cy.cadastarUsuario('Fulano da Silva', 'beltrano@qa..br', 'teste', 'true')
           .then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.email).to.equal('email deve ser um email válido')
           })
    });

    it('Deve editar um usuário previamente cadastrado', () => {
        let usuario = `Maria da Silva ${Math.floor(Math.random() * 100000000)}`
        cy.request('usuarios').then((response) => {
          let id = response.body.usuarios[0]._id
            cy.request({
              method: 'PUT',
              url: `usuarios/${id}`,
              body:
              {
               "nome": produto,
               "email": "maria@qa.com.br",
               "password": "teste1",
               "administrador": "true"
             } 
            })
            .then(response => {
               expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })  
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
     cy.request('usuarios').then(response => {
          let id = response.body.usuarios[2]._id
            cy.request({
              method: 'DELETE',
              url: `usuarios/${id}`,
            })
            .then(response => {
               expect(response.status).to.equal(200)
               expect(response.body.message).to.equal('Registro excluído com sucesso')
            })
    })  
    });

});
